from pydantic import BaseModel
from typing import Optional

class ProdutoCriar(BaseModel):
    nome: str
    categoria: str
    codigo_barras: Optional[str] = None
    preco_compra: float
    preco_venda: float
    quantidade_estoque: int
    estoque_minimo: Optional[int] = 0

class ProdutoAtualizar(BaseModel):
    nome: str
    categoria: str
    codigo_barras: Optional[str] = None
    preco_compra: float
    preco_venda: float
    quantidade_estoque: int
    estoque_minimo: Optional[int] = 0