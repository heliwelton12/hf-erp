from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo

from app.database.base import Base

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)
    data_cadastro = Column(DateTime, default=agora_bahia)