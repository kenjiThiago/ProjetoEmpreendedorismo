from flask import Blueprint, Response, request
import json
from Database.classe_membros_projeto import MembrosProjeto
from decimal import Decimal
from datetime import date

membros_projeto_blueprint = Blueprint("membros_projeto", __name__)

@membros_projeto_blueprint.route("/membros_projeto", methods=["GET"])
def get_membros_projeto():
    projeto_id = request.args.get("projeto_id")
    projeto_id = int(projeto_id) if projeto_id else None

    estudante_cpf = request.args.get("estudante_cpf", "")
    estado = request.args.get("estado", "")

    membros_model = MembrosProjeto()
    membros = membros_model.get_membros(
        projeto_id=projeto_id,
        estudante_cpf=estudante_cpf,
        estado=estado
    )

    projetos_dict = {}
    for m in membros:
        pid = m["projeto_id"]
        if pid not in projetos_dict:
            projetos_dict[pid] = {
                "projeto_id": pid,
                "titulo": m["projeto_titulo"],
                "empresa": m["projeto_empresa"],
                "estado": m["projeto_estado"],
                "membros": []
            }
        projetos_dict[pid]["membros"].append({
            "estudante_cpf": m["estudante_cpf"],
            "nome": m["estudante_nome"],
            "email": m["estudante_email"],
            "universidade": m["estudante_universidade"],
            "curso": m["estudante_curso"],
            "semestre": m["estudante_semestre"],
            "papel_no_projeto": m["papel_no_projeto"],
            "estado": m["membro_estado"]
        })

    response_list = list(projetos_dict.values())

    def convert(obj):
        if isinstance(obj, list):
            return [convert(i) for i in obj]
        elif isinstance(obj, dict):
            return {k: convert(v) for k, v in obj.items()}
        elif isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, date):
            return obj.isoformat()
        else:
            return obj

    return Response(
        json.dumps(convert(response_list), ensure_ascii=False, indent=4),
        mimetype="application/json"
    )
