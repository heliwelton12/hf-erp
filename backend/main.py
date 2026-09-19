from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.os import router as os_router
from app.routes.clientes import router as clientes_router
from app.routes.produtos import router as produtos_router
from app.routes.vendas import router as vendas_router
from app.routes.financeiro import router as financeiro_router
from app.routes.servicos import router as servicos_router
from app.routes.caixa import router as caixa_router
from app.routes.dashboard import router as dashboard_router
from app.routes.categorias import router as categorias_router
from app.routes.backup import router as backup_router
from app.routes.configuracoes import router as configuracoes_router
from app.routes import orcamento
from app.routes import estoque
from app.routes import inventario
from app.routes import fornecedor
from app.routes import conta_pagar
from app.routes import conta_receber

app = FastAPI(
    title="HF ERP",
    description="Sistema de gestão para papelaria, informática e ordens de serviço",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(os_router)
app.include_router(clientes_router)
app.include_router(produtos_router)
app.include_router(vendas_router)
app.include_router(financeiro_router)
app.include_router(servicos_router)
app.include_router(caixa_router)
app.include_router(dashboard_router)
app.include_router(categorias_router)
app.include_router(backup_router)
app.include_router(configuracoes_router)
app.include_router(orcamento.router)
app.include_router(estoque.router)
app.include_router(inventario.router)
app.include_router(fornecedor.router)
app.include_router(conta_pagar.router)
app.include_router(conta_receber.router)

@app.get("/")
def home():
    return {
        "message": "HF ERP Online"
    }