from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database.base import Base

class Venda(Base):
    __tablename__ = "vendas"

    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, nullable=False)
    produto_nome = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    forma_pagamento = Column(String, nullable=False)

    parcelas = Column(Integer, default=1)
    taxa_percentual = Column(Float, default=0)
    valor_taxa = Column(Float, default=0)
    total_com_taxa = Column(Float, default=0)
    valor_parcela = Column(Float, default=0)

    data_venda = Column(DateTime, default=datetime.utcnow)