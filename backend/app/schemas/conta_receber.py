from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class ContaReceberBase(BaseModel):
    cliente_id: Optional[int] = None
    descricao: str
    categoria: Optional[str] = None
    valor: float
    data_vencimento: date
    data_recebimento: Optional[date] = None
    forma_recebimento: Optional[str] = None
    status: Optional[str] = "Em aberto"
    observacoes: Optional[str] = None


class ContaReceberCriar(ContaReceberBase):
    pass


class ContaReceberAtualizar(ContaReceberBase):
    pass


class ContaReceberReceber(BaseModel):
    data_recebimento: date
    forma_recebimento: str


class ContaReceberResposta(ContaReceberBase):
    id: int
    data_criacao: datetime

    class Config:
        from_attributes = True