from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CaixaMovimentacaoCriar(BaseModel):
    tipo: str
    valor: float
    observacao: Optional[str] = None


class CaixaMovimentacaoResposta(BaseModel):
    id: int
    tipo: str
    valor: float
    observacao: Optional[str] = None
    data_movimentacao: datetime

    class Config:
        from_attributes = True