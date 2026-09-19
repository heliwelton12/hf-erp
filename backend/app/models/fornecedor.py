from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.base import Base


class Fornecedor(Base):
    __tablename__ = "fornecedores"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)
    nome_fantasia = Column(String, nullable=True)

    cnpj = Column(String, nullable=True)
    telefone = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    email = Column(String, nullable=True)

    endereco = Column(String, nullable=True)
    categoria = Column(String, nullable=True)
    observacoes = Column(String, nullable=True)

    status = Column(String, default="Ativo")

    data_cadastro = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow)