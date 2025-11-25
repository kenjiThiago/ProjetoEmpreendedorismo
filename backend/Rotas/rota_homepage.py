from flask import Blueprint, jsonify
from Database.classe_estudante import Estudante
from Database.classe_empresa import Empresa
from Database.classe_projeto import Projeto

homepage_blueprint = Blueprint("homepage", __name__)

@homepage_blueprint.route("/", methods=["GET"])
def dados_homepage():
    Estudantes  = Estudante()
    Empresas    = Empresa()
    Projetos     = Projeto()

    n_estudante = Estudantes.count_total()
    n_empresas  = Empresas.get_numero_empresas()
    n_projetos    = Projetos.get_numero_projetos()

    dados_homepage = {
        "num_alunos": n_estudante,
        "num_empresas":n_empresas,
        "num_projetos":n_projetos,
    }

    return jsonify(dados_homepage), 200

