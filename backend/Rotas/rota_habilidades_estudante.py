from flask import Blueprint, Response, request
import json
from Database.classe_habilidades_estudante import HabilidadesEstudante

habilidades_estudante_blueprint = Blueprint("habilidades_estudante", __name__)

@habilidades_estudante_blueprint.route("/habilidades_estudante", methods=["GET"])
def get_habilidades_estudante():
    estudante_cpf = request.args.get("estudante_cpf")
    habilidade_id = request.args.get("habilidade_id")

    he_model = HabilidadesEstudante()

    #Se a pessoa passou estudante_cpf, retorna habilidades desse estudante
    if estudante_cpf:
        habilidades = he_model.get_habilidades_por_estudante(estudante_cpf)
        return Response(
            json.dumps({"estudante_cpf": estudante_cpf, "habilidades": habilidades}, ensure_ascii=False, indent=4),
            mimetype="application/json"
        )

    # Se a pesoa passou habilidade_id, retorna estudantes que possuem essa habilidade
    elif habilidade_id:
        try:
            habilidade_id = int(habilidade_id)
        except ValueError:
            return Response(
                json.dumps({"error": "habilidade_id deve ser um número inteiro"}, ensure_ascii=False, indent=4),
                status=400,
                mimetype="application/json"
            )

        estudantes = he_model.get_estudantes_por_habilidade(habilidade_id)
        return Response(
            json.dumps({"habilidade_id": habilidade_id, "estudantes": estudantes}, ensure_ascii=False, indent=4),
            mimetype="application/json"
        )

    # Se nao passar paramentro, retorna erro
    else:
        return Response(
            json.dumps({"error": "Informe estudante_cpf ou habilidade_id"}, ensure_ascii=False, indent=4),
            status=400,
            mimetype="application/json"
        )
