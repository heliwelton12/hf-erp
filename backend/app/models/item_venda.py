from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base

class ItemVenda(Base):
    __tablename__ = "itens_venda"

    id = Column(Integer, primary_key=True, index=True)
    venda_id = Column(Integer, nullable=False)

    tipo = Column(String, nullable=False)
    item_id = Column(Integer, nullable=False)
    nome = Column(String, nullable=False)

    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)