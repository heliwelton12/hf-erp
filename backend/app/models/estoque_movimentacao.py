from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.database.base import Base


class EstoqueMovimentacao(Base):
    __tablename__ = "estoque_movimentacoes"

    id = Column(Integer, primary_key=True, index=True)

    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)

    tipo = Column(String, nullable=False)
    # Entrada, Saida, Ajuste

    quantidade = Column(Integer, nullable=False)

    motivo = Column(String, nullable=False)
    # Compra, Devolucao, Perda, Ajuste manual, Brinde, Uso interno...

    observacao = Column(String, nullable=True)

    estoque_antes = Column(Integer, nullable=False)
    estoque_depois = Column(Integer, nullable=False)

    data_movimentacao = Column(DateTime, default=datetime.utcnow)