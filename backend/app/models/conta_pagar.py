from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from datetime import datetime

from app.database.base import Base


class ContaPagar(Base):
    __tablename__ = "contas_pagar"

    id = Column(Integer, primary_key=True, index=True)

    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"), nullable=True)

    descricao = Column(String, nullable=False)
    categoria = Column(String, nullable=True)

    valor = Column(Float, nullable=False)
    data_vencimento = Column(Date, nullable=False)
    data_pagamento = Column(Date, nullable=True)

    forma_pagamento = Column(String, nullable=True)
    status = Column(String, default="Em aberto")
    # Em aberto, Pago, Cancelado

    observacoes = Column(String, nullable=True)

    data_cadastro = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow)