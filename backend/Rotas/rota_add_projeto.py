from flask import Blueprint, request, jsonify
from Database.classe_projeto import Projeto

projetos_blueprint_add = Blueprint("add_projeto", __name__)
projetos = Projeto()

@projetos_blueprint_add.route("/projetos/adicionar_projeto", methods=["POST"])
def adicionar_projeto():
    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"status": "erro", "mensagem": "JSON inválido"}), 400

    empresa_nome = data.get("empresa_nome")
    titulo = data.get("titulo")

    descricao = data.get("descricao")
    complexidade = data.get("complexidade")
    modalidade = data.get("modalidade")
    orcamento_total = data.get("orcamento_total")
    orcamento_estudantes = data.get("orcamento_estudantes")
    data_inicio = data.get("data_inicio")
    prazo_entrega = data.get("prazo_entrega")

    estado = "ANALISE"

    if not empresa_nome or not titulo:
        return jsonify({
            "status": "erro",
            "mensagem": "empresa_nome e titulo são obrigatórios."
        }), 400

    try:
        novo_projeto = projetos.adicionar_projeto(
            empresa_nome,
            titulo,
            descricao,
            complexidade,
            modalidade,
            orcamento_total,
            orcamento_estudantes,
            data_inicio,
            prazo_entrega,
            estado
        )

        return jsonify({
            "status": "sucesso",
            "projeto": novo_projeto
        }), 201

    except Exception as e:
        return jsonify({"status": "erro", "mensagem": str(e)}), 500
