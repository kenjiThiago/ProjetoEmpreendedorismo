from flask import Blueprint, request, jsonify
from Database.classe_estudante import Estudante

estudantes_blueprint_add = Blueprint("estudantes_add", __name__)
estudantes = Estudante()

#Lista daa 50 maiores universidades do brasil
DOMINIOS_VALIDOS = [
    "usp.br",                          # Universidade de São Paulo
    "unicamp.br",                      # Universidade Estadual de Campinas
    "ufrgs.br",                        # Universidade Federal do Rio Grande do Sul
    "ufmg.br",                         # Universidade Federal de Minas Gerais
    "ufrj.br",                         # Universidade Federal do Rio de Janeiro
    "unesp.br",                        # Universidade Estadual Paulista
    "ufsc.br",                         # Universidade Federal de Santa Catarina
    "unb.br",                          # Universidade de Brasília
    "ufpr.br",                         # Universidade Federal do Paraná
    "ufscar.br",                       # Universidade Federal de São Carlos
    "unifesp.br",                      # Universidade Federal de São Paulo
    "ufpe.br",                         # Universidade Federal de Pernambuco
    "ufg.br",                          # Universidade Federal de Goiás
    "ufba.br",                         # Universidade Federal da Bahia
    "uff.br",                          # Universidade Federal Fluminense
    "ufu.br",                          # Universidade Federal de Uberlândia
    "ufrn.br",                         # Universidade Federal do Rio Grande do Norte
    "ufv.br",                          # Universidade Federal de Viçosa
    "ufc.br",                          # Universidade Federal do Ceará
    "ufsm.br",                         # Universidade Federal de Santa Maria
    "pucrs.br",                        # Pontifícia Universidade Católica do RS
    "uerj.br",                         # Universidade do Estado do RJ
    "ufes.br",                         # Universidade Federal do Espírito Santo
    "puc-rio.br",                      # PUC Rio
    "ufjf.br",                         # Universidade Federal de Juiz de Fora
    "ufla.br",                         # Universidade Federal de Lavras
    "uem.br",                          # Universidade Estadual de Maringá
    "ufpb.br",                         # Universidade Federal da Paraíba
    "uel.br",                          # Universidade Estadual de Londrina
    "ufpa.br",                         # Universidade Federal do Pará
    "pucpr.br",                        # Pontifícia Universidade Católica do Paraná
    "ufs.br",                          # Universidade Federal de Sergipe
    "unisinos.br",                     # Universidade do Vale do Rio dos Sinos
    "ufpel.edu.br",                    # Universidade Federal de Pelotas
    "ufabc.edu.br",                    # Universidade Federal do ABC
    "ufms.br",                         # Universidade Federal de Mato Grosso do Sul
    "utfpr.edu.br",                    # Universidade Tecnológica Federal do Paraná
    "ufal.br",                         # Universidade Federal de Alagoas
    "ufcg.edu.br",                     # Universidade Federal de Campina Grande
    "ufop.br",                         # Universidade Federal de Ouro Preto
    "ufmt.br",                         # Universidade Federal de Mato Grosso
    "mackenzie.br",                    # Universidade Presbiteriana Mackenzie
    "uenf.br",                         # Universidade Estadual do Norte Fluminense
    "udesc.br",                        # Universidade do Estado de Santa Catarina
    "ufpi.br",                         # Universidade Federal do Piauí
    "unioeste.br",                     # Universidade Estadual do Oeste do Paraná
    "unifal-mg.edu.br",                # Universidade Federal de Alfenas
    "ufam.edu.br",                     # Universidade Federal do Amazonas
    "furg.br",                         # Universidade Federal do Rio Grande
    "ufcspa.edu.br"                    # Universidade Federal de Ciências da Saúde de Porto Alegre
]

def dominio_valido(email):
    return any(email.lower().endswith("@" + d) for d in DOMINIOS_VALIDOS)


@estudantes_blueprint_add.route("/estudantes/adicionar", methods=["POST"])
def adicionar_estudante():
    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"status": "erro", "mensagem": "JSON inválido"}), 400

    cpf = data.get("cpf")
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    data_nascimento = data.get("data_nascimento")
    universidade = data.get("universidade")
    curso = data.get("curso")
    semestre = data.get("semestre")

    # Campos obrigatórios
    if not all([cpf, nome, email, senha, data_nascimento, universidade, curso, semestre]):
        return jsonify({
            "status": "erro",
            "mensagem": "Todos os campos são obrigatórios."
        }), 400

    # Validação do domínio do e-mail institucional
    if not dominio_valido(email):
        return jsonify({
            "status": "erro",
            "mensagem": "E-mail institucional inválido. Use o e-mail da sua universidade."
        }), 400

    # Inserir no banco
    try:
        ok = estudantes.inserir_estudante(
            cpf, nome, email, senha, data_nascimento, universidade, curso, semestre
        )

        if ok:
            return jsonify({
                "mensagem": "Login bem-sucedido",
                "estudante": {
                    "cpf": cpf,
                    "nome": nome,
                    "email": email,
                }
            }), 201
        else:
            return jsonify({
                "status": "erro",
                "mensagem": "Erro ao inserir estudante no banco."
            }), 500

    except Exception as e:
        return jsonify({"status": "erro", "mensagem": str(e)}), 500
