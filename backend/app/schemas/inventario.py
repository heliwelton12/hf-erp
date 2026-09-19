from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class InventarioCriar(BaseModel):
    observacao: Optional[str] = None


class InventarioItemAtualizar(BaseModel):
    estoque_contado: int


class InventarioItemResposta(BaseModel):
    id: int
    inventario_id: int
    produto_id: int
    produto_nome: str
    estoque_sistema: int
    estoque_contado: Optional[int] = None
    diferenca: int

    class Config:
        from_attributes = True


class InventarioResposta(BaseModel):
    id: int
    status: str
    observacao: Optional[str] = None
    data_criacao: datetime
    data_finalizacao: Optional[datetime] = None
    itens: List[InventarioItemResposta] = []

    class Config:
        from_attributes = True