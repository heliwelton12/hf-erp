from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo
from app.database.base import Base

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

class VendaPrincipal(Base):
    __tablename__ = "vendas_principais"

    id = Column(Integer, primary_key=True, index=True)
    numero_venda = Column(String, unique=True, index=True, nullable=False)

    forma_pagamento = Column(String, nullable=False)
    parcelas = Column(Integer, default=1)

    total_original = Column(Float, nullable=False)
    taxa_percentual = Column(Float, default=0)
    valor_taxa = Column(Float, default=0)
    total_final = Column(Float, nullable=False)
    valor_parcela = Column(Float, default=0)

    status = Column(String, default="Ativa")
    motivo_cancelamento = Column(String, nullable=True)
    data_cancelamento = Column(DateTime, nullable=True)

    data_venda = Column(DateTime, default=agora_bahia)