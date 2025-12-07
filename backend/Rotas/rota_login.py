from flask import Blueprint, request, jsonify
from Database.classe_empresa import Empresa
from Database.classe_estudante import Estudante
from Database.classe_admin import Administrador

login_blueprint = Blueprint("login", __name__)


@login_blueprint.route("/login/estudante", methods=["POST"])
def login_estudante():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("password")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    Estudantes = Estudante()
    estudante = Estudantes.buscar_por_email(email)

    if not estudante:
        return jsonify({"erro": "Estudante não encontrado"}), 404

    if estudante["senha"] != senha:
        return jsonify({"erro": "Senha incorreta"}), 401

    return (
        jsonify(
            {
                "mensagem": "Login bem-sucedido",
                "estudante": {
                    "cpf": estudante["cpf"],
                    "nome": estudante["nome"],
                    "email": estudante["email"],
                },
            }
        ),
        200,
    )


@login_blueprint.route("/login/empresa", methods=["POST"])
def login_empresa():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("password")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    Empresas = Empresa()
    empresa = Empresas.buscar_por_email(senha)

    if not empresa:
        return jsonify({"erro": "Empresa não encontrada"}), 404

    if empresa["senha"] != senha:
        return jsonify({"erro": "Senha incorreta"}), 401

    return (
        jsonify(
            {
                "mensagem": "Login bem-sucedido",
                "empresa": {
                    "cnpj": empresa["cnpj"],
                    "nome": empresa["nome"],
                    "email": empresa["email"],
                },
            }
        ),
        200,
    )


@login_blueprint.route("/login/admin", methods=["POST"])
def login_admin():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("password")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    Admins = Administrador()
    admin = Admins.buscar_por_email(email)

    if not admin:
        return jsonify({"erro": "Administrador não encontrado"}), 404

    if admin["senha"] != senha:
        return jsonify({"erro": "Senha incorreta"}), 401

    return (
        jsonify(
            {
                "mensagem": "Login de admin bem-sucedido",
                "admin": {
                    "id": admin["id"],
                    "nome": admin["nome"],
                    "email": admin["email"],
                },
            }
        ),
        200,
    )
