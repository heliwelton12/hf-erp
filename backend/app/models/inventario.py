from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class Inventario(Base):
    __tablename__ = "inventarios"

    id = Column(Integer, primary_key=True, index=True)

    status = Column(String, default="Aberto")
    # Aberto, Finalizado

    observacao = Column(String, nullable=True)

    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_finalizacao = Column(DateTime, nullable=True)

    itens = relationship("InventarioItem", back_populates="inventario")


class InventarioItem(Base):
    __tablename__ = "inventario_itens"

    id = Column(Integer, primary_key=True, index=True)

    inventario_id = Column(Integer, ForeignKey("inventarios.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)

    produto_nome = Column(String, nullable=False)

    estoque_sistema = Column(Integer, nullable=False)
    estoque_contado = Column(Integer, nullable=True)

    diferenca = Column(Integer, default=0)

    inventario = relationship("Inventario", back_populates="itens")