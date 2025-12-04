from flask import Flask
from flask_cors import CORS

from Rotas.rota_homepage import homepage_blueprint
from Rotas.rota_estudante import estudante_blueprint
from Rotas.rota_empresa import empresa_blueprint
from Rotas.rota_projeto import projeto_blueprint
from Rotas.rota_membros_projeto import membros_projeto_blueprint
from Rotas.rota_habilidades_projeto import habilidades_projeto_blueprint
from Rotas.rota_habilidades_estudante import habilidades_estudante_blueprint
from Rotas.rota_login import login_blueprint
from Rotas.rota_add_membros_projeto import membros_projeto_blueprint_add
from Rotas.rota_add_projeto import projetos_blueprint_add
from Rotas.rota_add_estudante import estudantes_blueprint_add
from Rotas.rota_classificacao import classificacao_blueprint

app = Flask(__name__)
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True
CORS(app, origins="*")

app.register_blueprint(homepage_blueprint)
app.register_blueprint(estudante_blueprint)
app.register_blueprint(empresa_blueprint)
app.register_blueprint(projeto_blueprint)
app.register_blueprint(membros_projeto_blueprint)
app.register_blueprint(habilidades_projeto_blueprint)
app.register_blueprint(habilidades_estudante_blueprint)
app.register_blueprint(login_blueprint)
app.register_blueprint(membros_projeto_blueprint_add)
app.register_blueprint(projetos_blueprint_add)
app.register_blueprint(estudantes_blueprint_add)
app.register_blueprint(classificacao_blueprint)


app.run("0.0.0.0", port=8000, debug=False)
