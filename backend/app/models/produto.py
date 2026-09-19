from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo
from app.database.base import Base

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    codigo_barras = Column(String, nullable=True, unique=True, index=True)
    preco_compra = Column(Float, nullable=False)
    preco_venda = Column(Float, nullable=False)
    quantidade_estoque = Column(Integer, default=0)
    estoque_minimo = Column(Integer, default=0)
    data_cadastro = Column(DateTime, default=agora_bahia)