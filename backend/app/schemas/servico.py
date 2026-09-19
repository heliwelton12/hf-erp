from pydantic import BaseModel
from typing import Optional

class ServicoCriar(BaseModel):
    nome: str
    categoria: str

    custo_materiais: Optional[float] = 0
    custo_mao_obra: Optional[float] = 0
    custo_indireto: Optional[float] = 0
    lucro_percentual: Optional[float] = 0

    preco: float
    descricao: Optional[str] = None

class ServicoAtualizar(BaseModel):
    nome: str
    categoria: str

    custo_materiais: Optional[float] = 0
    custo_mao_obra: Optional[float] = 0
    custo_indireto: Optional[float] = 0
    lucro_percentual: Optional[float] = 0

    preco: float
    descricao: Optional[str] = None