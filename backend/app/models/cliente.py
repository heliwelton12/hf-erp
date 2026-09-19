from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database.base import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    data_cadastro = Column(DateTime, default=datetime.utcnow)