from flask import Blueprint, request, Response, jsonify
import json
from Database.classe_estudante import Estudante

estudante_blueprint = Blueprint("estudante", __name__)

@estudante_blueprint.route("/estudantes", methods=["GET"])
def get_estudantes():
    cpf             = request.args.get("cpf")
    nome            = request.args.get("nome")
    email           = request.args.get("email")
    senha           = request.args.get("senha")
    data_nascimento = request.args.get("data_nascimento")
    universidade    = request.args.get("universidade")
    curso           = request.args.get("curso")
    semestre        = request.args.get("semestre")

    estudante_model = Estudante()

    estudantes = estudante_model.get_estudantes(
        cpf=cpf,
        nome=nome,
        email=email,
        senha=senha,
        data_nascimento=data_nascimento,
        universidade=universidade,
        curso=curso,
        semestre=semestre
    )

    return Response(
        json.dumps({"estudantes": estudantes}, ensure_ascii=False, indent=4),
        mimetype="application/json"
    )




@estudante_blueprint.route("/alunos", methods=["POST"])
def criar_estudante():
    data = request.get_json()

    cpf = data.get("cpf")
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("password")
    data_nascimento = data.get("birthDate")  # Formato: 'YYYY-MM-DD'
    universidade = data.get("universidade")
    curso = data.get("curso")
    semestre = data.get("semestre")

    Estudantes = Estudante()
    sucesso = Estudantes.inserir_estudante(
        cpf, nome, email, senha, data_nascimento, universidade, curso, semestre
    )

    if sucesso:
        return jsonify({
            "mensagem": "Login bem-sucedido",
            "estudante": {
                "cpf": cpf,
                "nome": nome,
                "email": email,
            }
        }), 201
    else:
        return jsonify({"erro": "Erro ao inserir estudante"}), 500
