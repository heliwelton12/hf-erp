from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OrcamentoItemCriar(BaseModel):
    tipo: str
    item_id: int
    nome: str
    quantidade: int
    preco_unitario: float


class OrcamentoCriar(BaseModel):
    cliente_id: int
    observacoes: Optional[str] = None
    itens: List[OrcamentoItemCriar]


class OrcamentoStatusAtualizar(BaseModel):
    status: str


class OrcamentoItemResposta(BaseModel):
    id: int
    tipo: str
    item_id: int
    nome: str
    quantidade: int
    preco_unitario: float
    subtotal: float

    class Config:
        from_attributes = True


class OrcamentoResposta(BaseModel):
    id: int
    numero_orcamento: str
    cliente_id: int
    status: str
    observacoes: Optional[str] = None
    total: float
    data_criacao: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True