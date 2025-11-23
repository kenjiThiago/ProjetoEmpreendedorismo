from flask import Blueprint, jsonify
from Database.classe_estudante import Estudante
from Database.classe_empresa import Empresa

homepage_blueprint = Blueprint("homepage", __name__)

@homepage_blueprint.route("/", methods=["GET"])
def dados_homepage():
    Estudantes  = Estudante()
    Empresas    = Empresa()

    n_estudante = Estudantes.count_total()
    n_empresas  = Empresas.get_numero_empresas()
    n_cursos    = Estudantes.count_cursos()

    dados_homepage = {
        "num_alunos": n_estudante,
        "num_empresas":n_empresas,
        "num_cursos":n_cursos,
    }

    return jsonify(dados_homepage), 200

