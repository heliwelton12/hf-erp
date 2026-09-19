from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EstoqueMovimentacaoCriar(BaseModel):
    produto_id: int
    tipo: str
    quantidade: int
    motivo: str
    observacao: Optional[str] = None


class EstoqueMovimentacaoResposta(BaseModel):
    id: int
    produto_id: int
    tipo: str
    quantidade: int
    motivo: str
    observacao: Optional[str] = None
    estoque_antes: int
    estoque_depois: int
    data_movimentacao: datetime

    class Config:
        from_attributes = True