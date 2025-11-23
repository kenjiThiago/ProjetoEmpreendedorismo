import re

# Nome do arquivo original e do novo arquivo
ARQUIVO_ENTRADA = "insert_dados_v6.sql" # Ou o nome do seu arquivo atual
ARQUIVO_SAIDA = "insert_dados_final.sql"

def gerar_descricao_inteligente(titulo, complexidade, modalidade):
    desc = ""
    
    # 1. Baseada no Tipo de Projeto (Palavras-chave no Título)
    titulo_lower = titulo.lower()
    
    if "website" in titulo_lower or "site" in titulo_lower:
        desc = "Desenvolvimento de interface web responsiva, focada na experiência do usuário e boas práticas de SEO."
    elif "app" in titulo_lower or "mobile" in titulo_lower:
        desc = "Criação de aplicativo nativo ou híbrido, com foco em performance e usabilidade em dispositivos móveis."
    elif "e-commerce" in titulo_lower:
        desc = "Implementação de funcionalidades de loja virtual, incluindo catálogo de produtos, carrinho e checkout seguro."
    elif "api" in titulo_lower or "backend" in titulo_lower or "microsserviços" in titulo_lower:
        desc = "Estruturação de serviços backend robustos, documentação de rotas e garantia de segurança na troca de dados."
    elif "dados" in titulo_lower or "bi" in titulo_lower or "dashboard" in titulo_lower:
        desc = "Coleta, tratamento e visualização de dados para auxílio na tomada de decisões estratégicas da empresa."
    elif "chatbot" in titulo_lower or "ia" in titulo_lower:
        desc = "Implementação de assistente virtual inteligente com fluxo de conversação natural e integração com sistemas."
    elif "design" in titulo_lower or "ui" in titulo_lower or "landing page" in titulo_lower:
        desc = "Prototipagem de alta fidelidade e criação de identidade visual moderna para engajamento do público alvo."
    elif "automação" in titulo_lower or "script" in titulo_lower:
        desc = "Desenvolvimento de rotinas automatizadas para otimizar processos manuais e aumentar a eficiência."
    elif "login" in titulo_lower or "segurança" in titulo_lower:
        desc = "Implementação de módulos de autenticação segura e controle de acesso de usuários."
    else:
        desc = "Projeto de desenvolvimento tecnológico focado em resolver dores específicas do negócio através de software."

    # 2. Adiciona contexto baseado na Complexidade
    if complexidade == "BAIXA":
        desc += " Ideal para estudantes iniciantes praticarem fundamentos."
    elif complexidade == "MEDIA":
        desc += " Requer conhecimento intermediário e capacidade de resolução de problemas."
    elif complexidade == "ALTA":
        desc += " Desafio complexo que exige arquitetura escalável e boas práticas avançadas."

    return desc

def processar_arquivo():
    print("Lendo arquivo e gerando descrições inteligentes...")
    
    with open(ARQUIVO_ENTRADA, 'r', encoding='utf-8') as f_in, \
         open(ARQUIVO_SAIDA, 'w', encoding='utf-8') as f_out:
        
        for linha in f_in:
            # Verifica se é uma linha de Insert de Projeto
            if line_is_project_insert(linha):
                try:
                    # Extrai os dados usando Regex para garantir precisão
                    # Padrão busca: VALUES ('empresa', 'TITULO', 'descricao_vazia', 'COMPLEXIDADE', 'MODALIDADE'...)
                    match = re.search(r"VALUES \('.*?', '(.*?)', '(.*?)', '(.*?)', '(.*?)',", linha)
                    
                    if match:
                        titulo = match.group(1)
                        # desc_antiga = match.group(2) # Ignora a antiga
                        complexidade = match.group(3)
                        modalidade = match.group(4)
                        
                        nova_desc = gerar_descricao_inteligente(titulo, complexidade, modalidade)
                        
                        # Substitui ' ' pela nova descrição na linha
                        # Atenção: Substitui apenas a primeira ocorrência de ' ' logo após o título
                        nova_linha = linha.replace(f"'{titulo}', ' '", f"'{titulo}', '{nova_desc}'")
                        f_out.write(nova_linha)
                    else:
                        # Se não conseguir dar match no regex, copia a linha original (segurança)
                        f_out.write(linha)
                except Exception as e:
                    print(f"Erro ao processar linha: {e}")
                    f_out.write(linha)
            else:
                # Copia linhas que não são de projeto (inserts de alunos, empresas, etc)
                f_out.write(linha)

    print(f"Sucesso! Novo arquivo gerado: {ARQUIVO_SAIDA}")

def line_is_project_insert(linha):
    return "INSERT INTO Projeto" in linha and "VALUES" in linha

if __name__ == "__main__":
    # Crie um arquivo dummy se não tiver o original para testar
    # Mas no seu caso, apenas rode com o seu arquivo sql na mesma pasta
    processar_arquivo()