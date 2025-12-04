import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("ERRO: A variável de ambiente GEMINI_API_KEY não foi encontrada. Verifique seu arquivo .env")

genai.configure(api_key=api_key)

def classificar_projeto(titulo, descricao):
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    Você é o Chief Technology Officer (CTO) da "DevStart", uma plataforma que conecta empresas a estudantes universitários de TI para projetos freelance.

    Sua missão é analisar a demanda da empresa e classificar a dificuldade SOB A ÓTICA DE UM ESTUDANTE UNIVERSITÁRIO (Nível Estagiário ou Júnior).

    ---
    ENTRADA:
    Título: {titulo}
    Descrição: {descricao}
    ---

    DIRETRIZES DE CLASSIFICAÇÃO:

    1. BAIXA COMPLEXIDADE (Ideal para 1º/2º ano):
    - Landing Pages estáticas (HTML/CSS/JS).
    - Scripts simples de automação (Python/Pandas) ou Web Scraping básico.
    - Pequenas alterações em sites WordPress/Wix.
    - Dashboards simples (Excel/Power BI) sem ETL complexo.

    2. MÉDIA COMPLEXIDADE (Ideal para 3º/4º ano ou quem já faz estágio):
    - Sites dinâmicos com CRUD (Create, Read, Update, Delete).
    - Aplicativos Mobile com poucas telas.
    - Integração com APIs públicas documentadas.
    - Configuração de servidores básicos ou deploy simples (Vercel, Heroku).

    3. ALTA COMPLEXIDADE (Desafiador, requer dedicação de TCC ou nível Pleno):
    - E-commerces completos com gateway de pagamento real.
    - Sistemas que exigem alta segurança ou LGPD rigorosa.
    - Uso de IAs complexas (treinamento de modelos) ou Blockchain.
    - Manutenção de código legado (sistemas antigos sem documentação).
    - Arquitetura de microsserviços.

    ---
    SAÍDA ESPERADA (JSON):

    Retorne APENAS um JSON válido com a seguinte estrutura (sem markdown code blocks):
    {{
        "complexidade": "Baixa" | "Média" | "Alta",
        "justificativa": "texto curto explicando a classificação",
        "horas_estimadas": 20
    }}
    """
    
    try:
        # generation_config força a resposta a ser um JSON válido
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Converte o texto da resposta em um dicionário Python
        dados_classificados = json.loads(response.text)
        return dados_classificados

    except Exception as e:
        # Retorna um dicionário de erro para não quebrar a aplicação
        return {"erro": f"Falha na análise: {str(e)}"}


# --- Exemplo de uso ---
if __name__ == "__main__":
    projeto_exemplo = {
        "titulo": "Criar um dashboard de vendas",
        "descricao": "Preciso de um painel que pegue dados do Excel e mostre gráficos de vendas mensais com login de usuário."
    }

    print("Analisando projeto...")
    resultado = classificar_projeto(projeto_exemplo["titulo"], projeto_exemplo["descricao"])
    
    # Exibe o resultado formatado (pretty print)
    print(json.dumps(resultado, indent=4, ensure_ascii=False))