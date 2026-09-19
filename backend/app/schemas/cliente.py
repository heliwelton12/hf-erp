from pydantic import BaseModel
from typing import Optional

class ClienteCriar(BaseModel):
    nome: str
    telefone: str
    email: Optional[str] = None

class ClienteAtualizar(BaseModel):
    nome: str
    telefone: str
    email: Optional[str] = None