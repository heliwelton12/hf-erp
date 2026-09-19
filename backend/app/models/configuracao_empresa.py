from sqlalchemy import Column, Integer, String
from app.database.base import Base

class ConfiguracaoEmpresa(Base):
    __tablename__ = "configuracao_empresa"

    id = Column(Integer, primary_key=True, index=True)

    nome_empresa = Column(String, default="")
    nome_fantasia = Column(String, default="")
    cnpj = Column(String, default="")

    telefone = Column(String, default="")
    whatsapp = Column(String, default="")
    email = Column(String, default="")

    endereco = Column(String, default="")

    mensagem_comprovante = Column(
        String,
        default="Obrigado pela preferência!"
    )