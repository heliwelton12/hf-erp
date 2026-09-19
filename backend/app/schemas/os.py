from pydantic import BaseModel
from typing import Optional

class OrdemServicoCriar(BaseModel):
    cliente_id: int
    equipamento: str
    marca_modelo: Optional[str] = None
    defeito_relatado: str
    servico_solicitado: str
    status: str = "Recebido"
    valor: Optional[float] = 0
    prazo_entrega: Optional[str] = None
    observacoes: Optional[str] = None

class OrdemServicoAtualizarStatus(BaseModel):
    status: str

class OrdemServicoAtualizar(BaseModel):
    cliente_id: int
    equipamento: str
    marca_modelo: Optional[str] = None
    defeito_relatado: str
    servico_solicitado: str
    status: str
    valor: Optional[float] = 0
    prazo_entrega: Optional[str] = None
    observacoes: Optional[str] = None