from flask import Blueprint, Response, request
import json
from Database.classe_habilidades_projeto import HabilidadesProjeto

habilidades_projeto_blueprint = Blueprint("habilidades_projeto", __name__)

@habilidades_projeto_blueprint.route("/habilidades_projeto", methods=["GET"])
def get_habilidades_projeto():
    projeto_id = request.args.get("projeto_id")
    if not projeto_id:
        return Response(
            json.dumps({"error": "É necessário informar o projeto_id"}, ensure_ascii=False, indent=4),
            status=400,
            mimetype="application/json"
        )

    projeto_id = int(projeto_id)
    habilidades_model = HabilidadesProjeto()
    habilidades = habilidades_model.get_habilidades_por_projeto(projeto_id)

    response_data = {
        "projeto_id": projeto_id,
        "habilidades": [
            {
                "id_habilidade": h["id_habilidade"],
                "nome": h["habilidade_nome"]
            } for h in habilidades
        ]
    }

    return Response(
        json.dumps(response_data, ensure_ascii=False, indent=4),
        mimetype="application/json"
    )
