from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo

from app.database.base import Base

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

class CaixaFechamento(Base):
    __tablename__ = "caixa_fechamentos"

    id = Column(Integer, primary_key=True, index=True)

    total_pix = Column(Float, default=0)
    total_dinheiro = Column(Float, default=0)
    total_debito = Column(Float, default=0)
    total_credito = Column(Float, default=0)

    total_vendas = Column(Float, default=0)

    data_fechamento = Column(DateTime, default=agora_bahia)