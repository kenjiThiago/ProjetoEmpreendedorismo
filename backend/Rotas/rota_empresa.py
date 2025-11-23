from flask import Blueprint, Response, request
import json
from Database.classe_empresa import Empresa

empresa_blueprint = Blueprint("empresa", __name__)

@empresa_blueprint.route("/empresas", methods=["GET"])
def get_empresas():
    nome        = request.args.get("nome", "")
    cnpj        = request.args.get("cnpj", "")
    email       = request.args.get("email", "")
    senha       = request.args.get("senha", "")
    localizacao = request.args.get("localizacao", "")
    setor       = request.args.get("setor", "")
    descricao   = request.args.get("descricao", "")
    porte       = request.args.get("porte", "")


    empresa_model = Empresa()

    empresas = empresa_model.get_empresas(
        nome=nome,
        cnpj=cnpj,
        email=email,
        senha=senha,
        localizacao=localizacao,
        setor=setor,
        descricao=descricao,
        porte=porte,
    )

    total_empresas = empresa_model.get_numero_empresas()

    response_data = {
        "empresas": empresas,
        "total_empresas": total_empresas
    }

    return Response(
        json.dumps(response_data, ensure_ascii=False, indent=4),
        mimetype="application/json"
    )
