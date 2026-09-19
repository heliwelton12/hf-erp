from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class Orcamento(Base):
    __tablename__ = "orcamentos"

    id = Column(Integer, primary_key=True, index=True)

    numero_orcamento = Column(String, unique=True, index=True, nullable=False)

    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)

    status = Column(String, default="Aberto")
    # Aberto, Aprovado, Recusado, Convertido

    observacoes = Column(String, nullable=True)

    total = Column(Float, default=0)

    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow)

    cliente = relationship("Cliente")


class OrcamentoItem(Base):
    __tablename__ = "orcamento_itens"

    id = Column(Integer, primary_key=True, index=True)

    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=False)

    tipo = Column(String, nullable=False)
    # produto ou servico

    item_id = Column(Integer, nullable=False)

    nome = Column(String, nullable=False)

    quantidade = Column(Integer, nullable=False)

    preco_unitario = Column(Float, nullable=False)

    subtotal = Column(Float, nullable=False)

    orcamento = relationship("Orcamento")