from flask import Blueprint, request, jsonify
from Database.classe_membros_projeto import MembrosProjeto

membros_projeto_blueprint_add = Blueprint("membros_projeto_add", __name__)
membros = MembrosProjeto()

@membros_projeto_blueprint_add.route("/projetos/adicionar_estudante", methods=["POST"])
def adicionar_estudante_projeto():
    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"status": "erro", "mensagem": "JSON inválido"}), 400

    projeto_id = data.get("projeto_id")
    estudante_cpf = data.get("estudante_cpf")
    papel = data.get("papel_no_projeto")

    estado = "EM ANALISE"

    if not projeto_id or not estudante_cpf or not papel:
        return jsonify({
            "status": "erro",
            "mensagem": "projeto_id, estudante_cpf e papel_no_projeto são obrigatórios."
        }), 400

    try:
        membro = membros.adicionar_membro(
            projeto_id,
            estudante_cpf,
            papel,
            estado
        )

        return jsonify({
            "status": "sucesso",
            "membro": membro
        }), 201

    except Exception as e:
        return jsonify({
            "status": "erro",
            "mensagem": str(e)
        }), 500
