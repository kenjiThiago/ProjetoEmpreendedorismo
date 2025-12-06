from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Configuração inicial (mantendo sua lógica)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

classificacao_blueprint = Blueprint("classificacao_projeto", __name__)


def consultar_gemini(titulo, descricao):
    if not api_key:
        raise ValueError("API Key não configurada")

    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
    Você é o CTO da "DevStart". Analise este projeto e classifique a dificuldade para um ESTUDANTE.

    ENTRADA:
    Título: {titulo}
    Descrição: {descricao}

    DIRETRIZES DE COMPLEXIDADE E PRAZO:
    - BAIXA: Landing Pages, Scripts simples (5 a 15 dias).
    - MEDIA: CRUDs, Apps Mobile simples (20 a 40 dias).
    - ALTA: E-commerce, IAs, Sistemas complexos (50 a 90 dias).

    SAÍDA (JSON Puro):
    {{
        "complexidade": "BAIXA" | "MEDIA" | "ALTA",
        "justificativa": "texto curto explicando",
        "modalidade_sugerida": "ex: Web React, Mobile Flutter" (não pode ter mais de 50 caracteres),
        "estimativa_dias": integer (número exato de dias sugeridos para entrega, seja realista)
    }}
    """

    response = model.generate_content(
        prompt, generation_config={"response_mime_type": "application/json"}
    )
    return json.loads(response.text)


@classificacao_blueprint.route("/projetos/classificar", methods=["POST"])
def classificar_projeto_route():
    try:
        data = request.get_json(force=True)
        titulo = data.get("titulo")
        descricao = data.get("descricao")

        if not titulo or not descricao:
            return jsonify({"erro": "Título e descrição são obrigatórios"}), 400

        # Chama a IA
        resultado = consultar_gemini(titulo, descricao)

        # Normaliza a resposta para garantir maiúsculas no ENUM do banco
        resultado["complexidade"] = resultado["complexidade"].upper()

        # Mapeia 'MÉDIA' para 'MEDIA' (sem acento) se necessário para o banco
        if resultado["complexidade"] == "MÉDIA":
            resultado["complexidade"] = "MEDIA"

        return jsonify(resultado), 200

    except Exception as e:
        print(f"Erro na IA: {e}")
        return jsonify({"erro": "Falha ao classificar projeto"}), 500
