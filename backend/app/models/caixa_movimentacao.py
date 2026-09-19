from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database.base import Base


class CaixaMovimentacao(Base):
    __tablename__ = "caixa_movimentacoes"

    id = Column(Integer, primary_key=True, index=True)

    tipo = Column(String, nullable=False)
    # "Sangria" ou "Suprimento"

    valor = Column(Float, nullable=False)

    observacao = Column(String, nullable=True)

    data_movimentacao = Column(DateTime, default=datetime.utcnow)