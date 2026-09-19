from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, time

from app.database.session import get_db
from app.models.venda_principal import VendaPrincipal
from app.models.produto import Produto
from app.models.ordem_servico import OrdemServico

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/resumo")
def resumo_dashboard(
    db: Session = Depends(get_db)
):
    inicio_dia = datetime.combine(date.today(), time.min)
    fim_dia = datetime.combine(date.today(), time.max)

    vendas_hoje = db.query(VendaPrincipal).filter(
        VendaPrincipal.data_venda >= inicio_dia,
        VendaPrincipal.data_venda <= fim_dia,
        VendaPrincipal.status != "Cancelada"
    ).all()

    faturamento_hoje = sum(
        venda.total_final for venda in vendas_hoje
    )

    produtos_estoque_baixo = db.query(Produto).filter(
        Produto.quantidade_estoque <= Produto.estoque_minimo
    ).all()

    os_abertas = db.query(OrdemServico).filter(
        OrdemServico.status != "Entregue",
        OrdemServico.status != "Cancelado",
        OrdemServico.status != "Concluído"
    ).all()

    ultimas_vendas = db.query(VendaPrincipal).filter(
        VendaPrincipal.status != "Cancelada"
    ).order_by(
        VendaPrincipal.data_venda.desc()
    ).limit(5).all()

    return {
        "vendas_hoje": len(vendas_hoje),
        "faturamento_hoje": faturamento_hoje,
        "produtos_estoque_baixo": len(produtos_estoque_baixo),
        "os_abertas": len(os_abertas),
        "ultimas_vendas": ultimas_vendas
    }