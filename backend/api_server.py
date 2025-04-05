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

# Adicionar o diretório IA ao path do Python para importar main.py
sys.path.append(os.path.join(os.path.dirname(__file__), 'IA'))

# Importar funções do arquivo main.py
from ia.main import (
    analyze_text, 
    get_language_tool_corrections,
    process_file, 
    sanitize_directory_name
)

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

@app.route('/')
def index():
    return jsonify({"message": "API de Correção de Redações"})

@app.route('/api/analyze/text', methods=['POST'])
def analyze_text_api():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "Texto não fornecido"}), 400
        
        text = data['text']
        
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
        
        # Calcular pontuação baseada nos erros e análises
        # Estas pontuações são calculadas com base nos erros e na análise do texto
        error_count = grammar_errors_count + spelling_errors_count
        
        # Base score de 10, descontamos com base nos erros
        grammar_score = max(1, 10 - (grammar_errors_count * 0.5))
        spelling_score = max(1, 10 - (spelling_errors_count * 0.3))
        
        # Pontuação de coerência baseada na estrutura do texto
        coherence_score = min(10, 5 + (analysis['num_paragraphs'] * 0.8))
        
        # Pontuação de coesão baseada em conjunções
        cohesion_score = min(10, 5 + (len(analysis['conjunctions']) * 0.5))
        
        # Outras pontuações (simuladas)
        adherence_score = 8.5
        argument_quality = 7.8
        
        # Pontuação total (média ponderada)
        total_score = (grammar_score * 0.25 + 
                      spelling_score * 0.15 + 
                      coherence_score * 0.2 + 
                      cohesion_score * 0.2 + 
                      adherence_score * 0.1 + 
                      argument_quality * 0.1)
        
        # Arredondar as pontuações para uma casa decimal
        grammar_score = round(grammar_score, 1)
        coherence_score = round(coherence_score, 1)
        cohesion_score = round(cohesion_score, 1)
        total_score = round(total_score, 1)
        
        # Gerar feedback personalizado
        if error_count > 10:
            feedback = "A redação apresenta muitos erros ortográficos e gramaticais. Recomenda-se uma revisão cuidadosa."
        elif error_count > 5:
            feedback = "A redação apresenta alguns erros ortográficos e gramaticais. Recomenda-se revisão."
        elif error_count > 0:
            feedback = "A redação apresenta poucos erros. No geral, está bem escrita, mas poderia melhorar em alguns aspectos."
        else:
            feedback = "A redação está muito bem escrita, com excelente estrutura gramatical e ortografia."
        
        # Adicionar feedback sobre parágrafos e estrutura
        if analysis['num_paragraphs'] < 3:
            feedback += " Recomenda-se dividir o texto em mais parágrafos para melhor estruturação das ideias."
        elif analysis['num_paragraphs'] > 7:
            feedback += " O texto possui muitos parágrafos, o que pode fragmentar as ideias. Considere unificar alguns deles."
        
        # Adicionar feedback sobre períodos
        if analysis['num_periods'] < 5:
            feedback += " O texto possui poucos períodos, o que pode indicar frases muito longas. Considere dividir as frases para melhor clareza."
        
        # Formatar resposta de acordo com a interface TypeScript do frontend
        result = {
            "text": text,
            "corrections": corrections,
            "score": {
                "total": total_score,
                "categories": {
                    "grammar": grammar_score,
                    "coherence": coherence_score,
                    "cohesion": cohesion_score,
                    "adherenceToTheme": adherence_score,
                    "argumentQuality": argument_quality
                }
            },
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
            'json': {'text': extracted_text}
        })
        
        # Chamar a função de análise de texto que já implementamos
        with app.test_request_context('/api/analyze/text', 
                                      data=json.dumps({'text': extracted_text}), 
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
    try:
        data = request.json
        
        # Extrair informações necessárias para salvar os resultados
        student_name = data['studentInfo']['name']
        class_name = data['studentInfo']['class']
        essay_topic = "Tema Padrão"  # Este campo deveria vir do frontend
        
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
