from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FornecedorBase(BaseModel):
    nome: str
    nome_fantasia: Optional[str] = None
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    endereco: Optional[str] = None
    categoria: Optional[str] = None
    observacoes: Optional[str] = None
    status: Optional[str] = "Ativo"


class FornecedorCriar(FornecedorBase):
    pass


class FornecedorAtualizar(FornecedorBase):
    pass


class FornecedorResposta(FornecedorBase):
    id: int
    data_cadastro: datetime
    data_atualizacao: datetime

    class Config:
        from_attributes = True