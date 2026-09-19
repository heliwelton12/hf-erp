from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.base import Base


class ContaReceber(Base):
    __tablename__ = "contas_receber"

    id = Column(Integer, primary_key=True, index=True)

    cliente_id = Column(
        Integer,
        ForeignKey("clientes.id"),
        nullable=True
    )

    descricao = Column(
        String,
        nullable=False
    )

    categoria = Column(String)

    valor = Column(
        Float,
        nullable=False
    )

    data_vencimento = Column(
        Date,
        nullable=False
    )

    data_recebimento = Column(Date)

    forma_recebimento = Column(String)

    status = Column(
        String,
        default="Em aberto"
    )

    observacoes = Column(String)

    data_criacao = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )