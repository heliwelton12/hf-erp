from pydantic import BaseModel
from typing import List, Optional

class VendaCriar(BaseModel):
    produto_id: int
    quantidade: int
    forma_pagamento: str

class ItemVendaCriar(BaseModel):
    tipo: str
    item_id: int
    quantidade: int

class VendaCarrinhoCriar(BaseModel):
    itens: List[ItemVendaCriar]
    forma_pagamento: str
    parcelas: Optional[int] = 1
    taxa_percentual: Optional[float] = 0

class VendaCancelar(BaseModel):
    motivo: Optional[str] = "Cancelamento solicitado"