import sys
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.llm_service import LLMService
from fastapi.responses import JSONResponse  # Importando JSONResponse para manipulação de respostas
from datetime import datetime  # Importando datetime para manipulação de datas e horas
# Instanciando o FastAPI e o serviço LLM
app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    lang: str  # Agora esperamos que o parâmetro 'lang' seja passado também.

# Rota inicial que retorna uma mensagem JSON
@app.get("/", response_class=JSONResponse)
async def root():
    """
    Rota inicial que fornece informações sobre o status da API.
    Utiliza recursos do FastAPI como a documentação automática e validação de dados.
    """
    # Adicionando informações detalhadas para tornar a resposta mais interativa
    return {
        "message": "API is running",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "documentation": "Acesse a documentação interativa da API em /docs",
        "author": "ÁRISSON fernandes",
        "version": "1.0.0",
        "description": "Esta API está pronta para processar requisições de  resumo de textos."
    }

@app.post("/summarize")
async def summarize(data: TextData):
    text = data.text
    lang = data.lang

    # Verificar se o idioma é suportado
    if lang not in ["pt", "en", "es"]:
        raise HTTPException(status_code=400, detail="Language not supported")

    # Chamar o serviço LLM para gerar o resumo
    try:
        summary = llm_service.summarize_text(text, lang)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

