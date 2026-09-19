from pydantic import BaseModel

class ConfiguracaoEmpresaSalvar(BaseModel):
    nome_empresa: str
    nome_fantasia: str
    cnpj: str

    telefone: str
    whatsapp: str
    email: str

    endereco: str

    mensagem_comprovante: str