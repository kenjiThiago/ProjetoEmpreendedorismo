from flask import Blueprint, Response, request
import json
from decimal import Decimal
from datetime import date
from Database.classe_projeto import Projeto

projeto_blueprint = Blueprint("projeto", __name__)

@projeto_blueprint.route("/projetos", methods=["GET"])
def get_projetos():
    # Captura dos parâmetros da query
    id = request.args.get("id")
    id = int(id) if id else None

    empresa_nome = request.args.get("empresa_nome", "")
    titulo = request.args.get("titulo", "")
    descricao = request.args.get("descricao", "")
    complexidade = request.args.get("complexidade", "")
    modalidade = request.args.get("modalidade", "")

    orcamento_total = request.args.get("orcamento_total")
    orcamento_total = float(orcamento_total) if orcamento_total else None

    orcamento_estudantes = request.args.get("orcamento_estudantes")
    orcamento_estudantes = float(orcamento_estudantes) if orcamento_estudantes else None

    data_inicio = request.args.get("data_inicio", "")
    prazo_entrega = request.args.get("prazo_entrega", "")
    estado = request.args.get("estado", "")

    # Busca os projetos no banco
    projetos_model = Projeto()
    projetos = projetos_model.get_projetos(
        id=id,
        empresa_nome=empresa_nome,
        titulo=titulo,
        descricao=descricao,
        complexidade=complexidade,
        modalidade=modalidade,
        orcamento_total=orcamento_total,
        orcamento_estudantes=orcamento_estudantes,
        data_inicio=data_inicio,
        prazo_entrega=prazo_entrega,
        estado=estado,
    )

    total_projetos = projetos_model.get_numero_projetos()

    response_data = {
        "projetos": projetos,
        "total_projetos": total_projetos
    }

    # Função para converter Decimal e date
    def convert_types(obj):
        if isinstance(obj, list):
            return [convert_types(item) for item in obj]
        elif isinstance(obj, dict):
            return {k: convert_types(v) for k, v in obj.items()}
        elif isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, date):
            return obj.isoformat()  # transforma em "YYYY-MM-DD"
        else:
            return obj

    response_data = convert_types(response_data)

    return Response(
        json.dumps(response_data, ensure_ascii=False, indent=4),
        mimetype="application/json"
    )
