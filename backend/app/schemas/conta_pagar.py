from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class ContaPagarBase(BaseModel):
    fornecedor_id: Optional[int] = None
    descricao: str
    categoria: Optional[str] = None
    valor: float
    data_vencimento: date
    data_pagamento: Optional[date] = None
    forma_pagamento: Optional[str] = None
    status: Optional[str] = "Em aberto"
    observacoes: Optional[str] = None


class ContaPagarCriar(ContaPagarBase):
    pass


class ContaPagarAtualizar(ContaPagarBase):
    pass


class ContaPagarPagar(BaseModel):
    data_pagamento: date
    forma_pagamento: str


class ContaPagarResposta(ContaPagarBase):
    id: int
    data_cadastro: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True