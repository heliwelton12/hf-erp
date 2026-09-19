from pydantic import BaseModel

class CategoriaCriar(BaseModel):
    nome: str

class CategoriaAtualizar(BaseModel):
    nome: str