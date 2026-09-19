from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from zoneinfo import ZoneInfo
from app.database.base import Base

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

class OrdemServico(Base):
    __tablename__ = "ordens_servico"

    id = Column(Integer, primary_key=True, index=True)
    numero_os = Column(String, unique=True, index=True, nullable=False)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    equipamento = Column(String, nullable=False)
    marca_modelo = Column(String, nullable=True)
    defeito_relatado = Column(String, nullable=False)
    servico_solicitado = Column(String, nullable=False)
    status = Column(String, default="Recebido")
    valor = Column(Float, default=0)
    prazo_entrega = Column(String, nullable=True)
    observacoes = Column(String, nullable=True)
    data_abertura = Column(DateTime, default=agora_bahia)
    data_atualizacao = Column(DateTime, default=agora_bahia)