import os
import requests
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env
load_dotenv()

class LLMService:
    def __init__(self):
        # Carregar token da variável de ambiente
        self.api_key = os.getenv('HF_TOKEN')  # Certifique-se de ter o token no .env
        if not self.api_key:
            raise ValueError("Token da Hugging Face não encontrado.")

        # Necessario remover da url o /v1/ para funcionar
        self.url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct"

    def summarize_text(self, text: str, lang: str) -> str:
        prompt = self._get_prompt_for_language(text, lang)
        
        # Enviar a requisição POST para o Hugging Face API
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt
        }

        response = requests.post(self.url, headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Erro ao se comunicar com a Hugging Face API: {response.text}")

    def _get_prompt_for_language(self, text: str, lang: str) -> str:
        # Baseado no idioma, modificamos o prompt
        if lang == "pt":
            return f"Resuma o seguinte texto em português: {text}"
        elif lang == "en":
            return f"Summarize the following text in English: {text}"
        elif lang == "es":
            return f"Resume el siguiente texto en español: {text}"
        else:
            raise ValueError("Idioma não suportado")

