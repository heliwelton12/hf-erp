from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo
from app.database.base import Base

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

class Servico(Base):
    __tablename__ = "servicos"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=False)

    custo_materiais = Column(Float, default=0)
    custo_mao_obra = Column(Float, default=0)
    custo_indireto = Column(Float, default=0)
    lucro_percentual = Column(Float, default=0)
    custo_total = Column(Float, default=0)

    preco = Column(Float, nullable=False)

    descricao = Column(String, nullable=True)
    data_cadastro = Column(DateTime, default=agora_bahia)