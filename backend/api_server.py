from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import json
import base64
from io import BytesIO
from PIL import Image
import tempfile
import time
import re

# Adicionar o diretório IA ao path do Python para importar main.py
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'IA'))

# Importar funções do arquivo main.py
try:
    from main import (
        analyze_text, 
        get_language_tool_corrections,
        process_file, 
        sanitize_directory_name
    )
except ImportError as e:
    print(f"Erro ao importar módulos do main.py: {e}")
    # Definir funções dummy caso a importação falhe
    def analyze_text(text):
        return {"num_paragraphs": 5, "entities": [], "conjunctions": []}
    
    def get_language_tool_corrections(text):
        return {"matches": []}
    
    def process_file(file_path, class_name, student_name, essay_topic, save_dir):
        pass
    
    def sanitize_directory_name(name):
        return name.replace(" ", "_").lower()

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

# Lista de conectivos comuns em português para detectar no texto
CONNECTIVES = [
    # Aditivos
    'além disso', 'ademais', 'também', 'e', 'não só... mas também', 'tanto... quanto', 'não apenas... como também',
    # Adversativos
    'mas', 'porém', 'todavia', 'contudo', 'entretanto', 'no entanto', 'apesar de', 'embora', 'ainda que',
    # Causais
    'porque', 'pois', 'já que', 'uma vez que', 'visto que', 'devido a', 'por causa de', 'como', 'sendo assim',
    # Conclusivos
    'portanto', 'logo', 'por conseguinte', 'por isso', 'assim', 'dessa forma', 'desse modo', 'então', 'em conclusão',
    # Explicativos
    'ou seja', 'isto é', 'a saber', 'em outras palavras', 'quer dizer', 'por exemplo',
    # Temporais
    'quando', 'enquanto', 'antes que', 'depois que', 'logo que', 'desde que', 'até que', 'sempre que',
    # Conformativos
    'conforme', 'segundo', 'consoante', 'de acordo com', 'como',
    # Comparativos
    'mais que', 'menos que', 'como', 'assim como', 'tal qual', 'tanto quanto',
    # Concessivos
    'embora', 'apesar de', 'mesmo que', 'ainda que', 'se bem que', 'posto que',
    # Finais
    'para que', 'a fim de que', 'com o intuito de', 'com o propósito de', 'para', 'a fim de'
]

def count_connectives(text):
    """Conta o número de conectivos no texto"""
    count = 0
    lower_text = text.lower()
    
    for connective in CONNECTIVES:
        # Criar um regex que busca pelo conectivo como palavra completa
        pattern = r'\b' + re.escape(connective) + r'\b'
        matches = re.findall(pattern, lower_text)
        count += len(matches)
    
    return count

@app.route('/')
def index():
    return jsonify({"message": "API de Correção de Redações baseada no ENEM"})

@app.route('/api/analyze/text', methods=['POST'])
def analyze_text_api():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "Texto não fornecido"}), 400
        
        text = data['text']
        theme = data.get('theme', 'Tema não especificado')
        title = data.get('title', '')
        
        # Obter correções da API Language Tool
        corrections_data = get_language_tool_corrections(text)
        
        # Analisar o texto usando spaCy
        analysis = analyze_text(text)
        
        # Processar correções para o formato esperado pelo frontend
        corrections = []
        grammar_errors_count = 0
        spelling_errors_count = 0
        
        if 'matches' in corrections_data:
            for match in corrections_data['matches']:
                error_type = "grammar" if match['rule']['issueType'] == 'grammar' else "spelling"
                
                if error_type == "grammar":
                    grammar_errors_count += 1
                else:
                    spelling_errors_count += 1
                
                corrections.append({
                    'original': match['context']['text'][match['context']['offset']:match['context']['offset']+match['context']['length']],
                    'suggested': match['replacements'][0]['value'] if match['replacements'] else "",
                    'type': error_type,
                    'position': {
                        'start': match['offset'],
                        'end': match['offset'] + match['length']
                    }
                })
        
        # Contar parágrafos
        paragraphs = text.split('\n\n')
        num_paragraphs = len(paragraphs)
        
        # Contar palavras
        words = text.split()
        num_words = len(words)
        
        # Contar conectivos
        num_connectives = count_connectives(text)
        
        # Calcular pontuações para as 5 competências do ENEM (0-200)
        # Arredondar para incrementos de 40 pontos conforme ENEM (0, 40, 80, 120, 160, 200)
        
        def round_to_enem_scale(score):
            return round(score / 40) * 40
        
        # Competência 1: Domínio da norma culta (erros gramaticais e ortográficos impactam negativamente)
        error_penalty = min(grammar_errors_count * 15 + spelling_errors_count * 10, 160)
        comp1_score_raw = max(0, 200 - error_penalty)
        comp1_score = round_to_enem_scale(comp1_score_raw)
        
        # Competência 2: Compreensão da proposta (número de parágrafos e comprimento do texto são indicadores)
        comp2_base = 120
        comp2_bonus = min(80, num_paragraphs * 20)
        comp2_score_raw = comp2_base + comp2_bonus
        comp2_score = round_to_enem_scale(comp2_score_raw)
        
        # Competência 3: Selecionar, relacionar e organizar informações (analisando entidades e estrutura)
        comp3_base = 120
        entity_bonus = min(80, len(analysis.get('entities', [])) * 5)
        comp3_score_raw = comp3_base + entity_bonus
        comp3_score = round_to_enem_scale(comp3_score_raw)
        
        # Competência 4: Mecanismos linguísticos (conectivos são cruciais)
        comp4_base = 80
        connective_bonus = min(120, num_connectives * 10)
        comp4_score_raw = comp4_base + connective_bonus
        comp4_score = round_to_enem_scale(comp4_score_raw)
        
        # Competência 5: Proposta de intervenção (mais difícil de detectar automaticamente)
        # Simplificação: verifica presença de parágrafos finais e palavras-chave de proposta
        has_last_paragraph = len(paragraphs) > 2
        proposal_keywords = ['proposta', 'solução', 'medida', 'resolver', 'implementar', 'desenvolver', 'criar', 'estabelecer']
        
        has_proposal_keywords = False
        if has_last_paragraph:
            last_paragraph = paragraphs[-1].lower()
            for keyword in proposal_keywords:
                if keyword in last_paragraph:
                    has_proposal_keywords = True
                    break
        
        comp5_score_raw = 120  # Base
        if has_last_paragraph:
            comp5_score_raw += 40
        if has_proposal_keywords:
            comp5_score_raw += 40
        
        comp5_score = round_to_enem_scale(comp5_score_raw)
        
        # Calcular nota total (soma das 5 competências)
        total_score = comp1_score + comp2_score + comp3_score + comp4_score + comp5_score
        
        # Gerar feedback personalizado em formato melhorado
        feedback = "# ANÁLISE DA REDAÇÃO - CRITÉRIOS ENEM\n\n"
        
        # Feedback Competência 1
        feedback += "## Competência 1 - Demonstrar domínio da norma padrão da língua escrita\n"
        feedback += f"Nota: {comp1_score}/200 pontos\n\n"
        
        if comp1_score < 80:
            feedback += "Demonstra domínio precário da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais e de convenções da escrita.\n\n"
        elif comp1_score < 120:
            feedback += "Demonstra domínio mediano da modalidade escrita formal da língua portuguesa, com alguns desvios gramaticais e de convenções da escrita.\n\n"
        elif comp1_score < 160:
            feedback += "Demonstra bom domínio da modalidade escrita formal da língua portuguesa, com poucos desvios gramaticais e de convenções da escrita.\n\n"
        else:
            feedback += "Demonstra excelente domínio da modalidade escrita formal da língua portuguesa, com pouquíssimos desvios gramaticais e de convenções da escrita.\n\n"
        
        # Feedback Competência 2
        feedback += "## Competência 2 - Compreender a proposta e aplicar conceitos das várias áreas de conhecimento\n"
        feedback += f"Nota: {comp2_score}/200 pontos\n\n"
        
        if comp2_score < 80:
            feedback += "Desenvolve o tema recorrendo à cópia de trechos dos textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo.\n\n"
        elif comp2_score < 120:
            feedback += "Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo.\n\n"
        elif comp2_score < 160:
            feedback += "Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo.\n\n"
        else:
            feedback += "Desenvolve o tema por meio de argumentação consistente e apresenta excelente domínio do texto dissertativo-argumentativo.\n\n"
        
        # Feedback Competência 3
        feedback += "## Competência 3 - Selecionar, relacionar, organizar e interpretar informações\n"
        feedback += f"Nota: {comp3_score}/200 pontos\n\n"
        
        if comp3_score < 80:
            feedback += "Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios.\n\n"
        elif comp3_score < 120:
            feedback += "Apresenta informações, fatos e opiniões relacionados ao tema, mas limitados aos argumentos dos textos motivadores.\n\n"
        elif comp3_score < 160:
            feedback += "Apresenta informações, fatos e opiniões relacionados ao tema, de forma organizada, com indícios de autoria.\n\n"
        else:
            feedback += "Apresenta informações, fatos e opiniões relacionados ao tema propostos, de forma consistente e organizada, configurando autoria.\n\n"
        
        # Feedback Competência 4
        feedback += "## Competência 4 - Demonstrar conhecimento dos mecanismos linguísticos\n"
        feedback += f"Nota: {comp4_score}/200 pontos\n\n"
        
        if comp4_score < 80:
            feedback += "Articula as partes do texto de forma precária, com muitas inadequações, e apresenta repertório limitado de recursos coesivos.\n\n"
        elif comp4_score < 120:
            feedback += "Articula as partes do texto com algumas inadequações e apresenta repertório pouco diversificado de recursos coesivos.\n\n"
        elif comp4_score < 160:
            feedback += "Articula as partes do texto, com poucas inadequações, e apresenta repertório diversificado de recursos coesivos.\n\n"
        else:
            feedback += "Articula as partes do texto de maneira coesa e apresenta repertório diversificado de recursos coesivos.\n\n"
        
        # Feedback Competência 5
        feedback += "## Competência 5 - Elaborar proposta de intervenção para o problema\n"
        feedback += f"Nota: {comp5_score}/200 pontos\n\n"
        
        if comp5_score < 80:
            feedback += "Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao tema.\n\n"
        elif comp5_score < 120:
            feedback += "Apresenta proposta de intervenção relacionada ao tema, mas pouco articulada com a discussão desenvolvida no texto.\n\n"
        elif comp5_score < 160:
            feedback += "Apresenta proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.\n\n"
        else:
            feedback += "Apresenta proposta de intervenção relacionada ao tema, bem articulada com a discussão desenvolvida no texto e bem detalhada.\n\n"
        
        # Feedback geral
        feedback += f"# Nota Final: {total_score}/1000 pontos\n\n"
        feedback += "## Avaliação Geral\n"
        
        if total_score < 500:
            feedback += "Sua redação apresenta diversos pontos a melhorar. Recomenda-se revisar aspectos gramaticais, estrutura argumentativa e proposta de intervenção."
        elif total_score < 700:
            feedback += "Sua redação está na média, mas ainda pode melhorar em aspectos específicos. Trabalhe na coesão, na qualidade dos argumentos e na proposta de intervenção."
        elif total_score < 900:
            feedback += "Sua redação está bem desenvolvida, com boa estrutura argumentativa. Para alcançar a nota máxima, aperfeiçoe a proposta de intervenção e reduza pequenos desvios gramaticais."
        else:
            feedback += "Sua redação está excelente, demonstrando competência em todos os critérios avaliados pelo ENEM. Parabéns!"
        
        # Formatar resposta de acordo com a interface do frontend
        result = {
            "text": text,
            "corrections": corrections,
            "score": {
                "total": total_score,
                "categories": {
                    "competencia1": comp1_score,
                    "competencia2": comp2_score,
                    "competencia3": comp3_score,
                    "competencia4": comp4_score,
                    "competencia5": comp5_score
                }
            },
            "statistics": {
                "connectivesCount": num_connectives,
                "paragraphsCount": num_paragraphs,
                "wordsCount": num_words,
                "charactersCount": len(text)
            },
            "theme": theme,
            "title": title,
            "feedback": feedback
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Erro ao analisar texto: {str(e)}")
        return jsonify({"error": f"Erro ao analisar texto: {str(e)}"}), 500

@app.route('/api/analyze/image', methods=['POST'])
def analyze_image_api():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "Imagem não fornecida"}), 400
        
        image_file = request.files['image']
        theme = request.form.get('theme', 'Tema não especificado')
        title = request.form.get('title', '')
        
        # Criar um arquivo temporário para salvar a imagem
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            image_file.save(temp_file.name)
            temp_file_path = temp_file.name
        
        # Processar a imagem para extrair texto (usando OCR)
        # Aqui você incluiria o código para OCR, mas estamos simulando por enquanto
        # Em um projeto real, você usaria algo como pytesseract ou outra biblioteca OCR
        
        # Por enquanto, vamos simular um texto extraído da imagem
        extracted_text = """A importancia da educacao no Brasil. 
A educacao é fundamental para o desenvolvimiento do pais. 
Sem ela, não podemos avançar como sociedade e nem como individuos."""
        
        # Analisar o texto extraído (reutilizando a lógica do endpoint de texto)
        temp_request = type('obj', (object,), {
            'json': {'text': extracted_text, 'theme': theme, 'title': title}
        })
        
        # Chamar a função de análise de texto que já implementamos
        with app.test_request_context('/api/analyze/text', 
                                      data=json.dumps({'text': extracted_text, 'theme': theme, 'title': title}), 
                                      content_type='application/json'):
            result = analyze_text_api()
            
            # Converter resposta Flask para dicionário
            if isinstance(result, tuple):
                response_data = json.loads(result[0].get_data(as_text=True))
            else:
                response_data = json.loads(result.get_data(as_text=True))
        
        # Remover o arquivo temporário
        os.unlink(temp_file_path)
        
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Erro ao analisar imagem: {str(e)}")
        return jsonify({"error": f"Erro ao analisar imagem: {str(e)}"}), 500

@app.route('/api/save-results', methods=['POST'])
def save_results_api():
    # ... keep existing code (for saving results)
    try:
        data = request.json
        
        # Extrair informações necessárias para salvar os resultados
        student_name = data['studentInfo']['name']
        class_name = data['studentInfo']['class']
        essay_topic = data.get('theme', "Tema não especificado")
        essay_title = data.get('title', "")
        
        # Extrair o texto original
        if data['inputType'] == 'text':
            original_text = data['essayAnalysis']['text']
        else:
            # Se for imagem, usamos o texto extraído pela IA
            original_text = data['essayAnalysis']['text']
        
        # Formatar as correções para o formato esperado pela função process_file
        corrections = []
        for corr in data['essayAnalysis']['corrections']:
            corrections.append({
                'message': f"Erro de {corr['type'] == 'spelling' and 'ortografia' or 'gramática'}: {corr['original']}",
                'context': {'text': original_text[max(0, corr['position']['start']-10):min(len(original_text), corr['position']['end']+10)]},
                'replacements': [corr['suggested']]
            })
        
        # Definir diretório de salvamento
        save_dir = os.path.join(os.path.dirname(__file__), 'resultados')
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        
        # Criar arquivo temporário para salvar o texto
        with tempfile.NamedTemporaryFile(delete=False, suffix='.txt', mode='w', encoding='utf-8') as temp_file:
            temp_file.write(original_text)
            temp_file_path = temp_file.name
        
        # Chamar a função para processar o arquivo e salvar resultados
        analysis = analyze_text(original_text)
        
        # Verificar se existe um diretório para este estudante
        class_dir = sanitize_directory_name(class_name)
        base_dir = os.path.join(save_dir, class_dir)
        
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
        
        topic_dir = sanitize_directory_name(essay_topic)
        theme_dir = os.path.join(base_dir, topic_dir)
        
        if not os.path.exists(theme_dir):
            os.makedirs(theme_dir)
        
        student_dir = sanitize_directory_name(student_name)
        student_dir_path = os.path.join(theme_dir, student_dir)
        
        if not os.path.exists(student_dir_path):
            os.makedirs(student_dir_path)
        
        # Simular o salvamento (em um projeto real, você chamaria process_file)
        # process_file(temp_file_path, class_name, student_name, essay_topic, save_dir)
        
        # Salvar os detalhes da análise em JSON
        analysis_details = {
            "student": student_name,
            "class": class_name,
            "theme": essay_topic,
            "title": essay_title,
            "date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_score": data['essayAnalysis']['score']['total'],
            "competencias": data['essayAnalysis']['score']['categories'],
            "statistics": data['essayAnalysis'].get('statistics', {}),
            "corrections_count": len(corrections),
            "text_length": len(original_text),
            "teacher_grade": data['teacherInput']['grade'] or str(data['essayAnalysis']['score']['total'] / 10),
            "teacher_comments": data['teacherInput']['comments']
        }
        
        analysis_json_path = os.path.join(student_dir_path, "analysis.json")
        with open(analysis_json_path, 'w', encoding='utf-8') as json_file:
            json.dump(analysis_details, json_file, ensure_ascii=False, indent=2)
        
        # Salvar o texto original
        text_file_path = os.path.join(student_dir_path, "redacao.txt")
        with open(text_file_path, 'w', encoding='utf-8') as text_file:
            text_file.write(original_text)
        
        # Salvar o feedback
        feedback_file_path = os.path.join(student_dir_path, "feedback.txt")
        with open(feedback_file_path, 'w', encoding='utf-8') as feedback_file:
            feedback_file.write(data['essayAnalysis']['feedback'])
            if data['teacherInput']['comments']:
                feedback_file.write("\n\nComentários do professor:\n")
                feedback_file.write(data['teacherInput']['comments'])
        
        # Responder com sucesso
        return jsonify({
            "success": True,
            "message": "Resultados salvos com sucesso",
            "path": student_dir_path
        })
    
    except Exception as e:
        print(f"Erro ao salvar resultados: {str(e)}")
        return jsonify({"error": f"Erro ao salvar resultados: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)