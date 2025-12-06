from flask import Blueprint, request, jsonify
from Database.conector import DatabaseManager

admin_blueprint = Blueprint("admin", __name__)

# --- PROJETOS PENDENTES ---
@admin_blueprint.route("/admin/projetos_pendentes", methods=["GET"])
def get_projetos_pendentes():
    db = DatabaseManager() # INSTANCIA AQUI (Conexão nova por request)
    
    query = """
    SELECT id, titulo, empresa_nome, descricao, estado 
    FROM Projeto 
    WHERE estado = 'ANALISE'
    ORDER BY id DESC
    """
    try:
        projetos = db.execute_select_all(query)
        return jsonify(projetos), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if db.conn: db.conn.close() # Garante fechamento

@admin_blueprint.route("/admin/aprovar_projeto", methods=["POST"])
def aprovar_projeto():
    db = DatabaseManager() # INSTANCIA AQUI
    
    data = request.get_json()
    projeto_id = data.get("projeto_id")
    acao = data.get("acao") 

    if not projeto_id or acao not in ['APROVAR', 'REJEITAR']:
        return jsonify({"erro": "Dados inválidos"}), 400

    novo_estado = "BUSCANDO_EQUIPE" if acao == 'APROVAR' else "CANCELADO"
    
    query = "UPDATE Projeto SET estado = %s WHERE id = %s"
    try:
        db.cursor.execute(query, (novo_estado, projeto_id))
        db.conn.commit()
        return jsonify({"mensagem": f"Projeto {novo_estado} com sucesso"}), 200
    except Exception as e:
        db.conn.rollback()
        return jsonify({"erro": str(e)}), 500
    finally:
        if db.conn: db.conn.close()

# --- ALUNOS (MEMBROS) PENDENTES ---
@admin_blueprint.route("/admin/membros_pendentes", methods=["GET"])
def get_membros_pendentes():
    db = DatabaseManager() # INSTANCIA AQUI
    
    query = """
    SELECT 
        mp.id, 
        mp.estudante_cpf, 
        e.nome as estudante_nome, 
        p.titulo as projeto_titulo, 
        mp.papel_no_projeto,
        mp.estado
    FROM Membros_projeto mp
    JOIN Estudante e ON mp.estudante_cpf = e.cpf
    JOIN Projeto p ON mp.projeto_id = p.id
    WHERE mp.estado = 'EM ANALISE'
    ORDER BY mp.id DESC
    """
    try:
        membros = db.execute_select_all(query)
        return jsonify(membros), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        if db.conn: db.conn.close()

@admin_blueprint.route("/admin/aprovar_membro", methods=["POST"])
def aprovar_membro():
    db = DatabaseManager() # INSTANCIA AQUI
    
    data = request.get_json()
    membro_id = data.get("membro_id")
    acao = data.get("acao") 

    if not membro_id or acao not in ['APROVAR', 'REJEITAR']:
        return jsonify({"erro": "Dados inválidos"}), 400

    novo_estado = "ATIVO" if acao == 'APROVAR' else "REMOVIDO"
    
    query = "UPDATE Membros_projeto SET estado = %s WHERE id = %s"
    try:
        db.cursor.execute(query, (novo_estado, membro_id))
        db.conn.commit()
        return jsonify({"mensagem": f"Membro {novo_estado} com sucesso"}), 200
    except Exception as e:
        db.conn.rollback()
        return jsonify({"erro": str(e)}), 500
    finally:
        if db.conn: db.conn.close()
