from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.venda_principal import VendaPrincipal

router = APIRouter(
    prefix="/financeiro",
    tags=["Financeiro"]
)

@router.get("/resumo")
def resumo_financeiro(
    db: Session = Depends(get_db)
):
    todas_vendas = db.query(VendaPrincipal).all()

    vendas_ativas = [
        venda for venda in todas_vendas
        if venda.status != "Cancelada"
    ]

    total_original = sum(
        venda.total_original for venda in vendas_ativas
    )

    total_taxas = sum(
        venda.valor_taxa for venda in vendas_ativas
    )

    total_com_taxas = sum(
        venda.total_final for venda in vendas_ativas
    )

    quantidade_vendas = len(vendas_ativas)

    total_pix = sum(
        venda.total_final
        for venda in vendas_ativas
        if venda.forma_pagamento == "PIX"
    )

    total_dinheiro = sum(
        venda.total_final
        for venda in vendas_ativas
        if venda.forma_pagamento == "Dinheiro"
    )

    total_debito = sum(
        venda.total_final
        for venda in vendas_ativas
        if venda.forma_pagamento == "Cartão de Débito"
    )

    total_credito = sum(
        venda.total_final
        for venda in vendas_ativas
        if venda.forma_pagamento == "Cartão de Crédito"
    )

    vendas_recentes = sorted(
        todas_vendas,
        key=lambda x: x.data_venda,
        reverse=True
    )[:20]

    return {
        "total_vendido": total_original,
        "total_taxas": total_taxas,
        "total_com_taxas": total_com_taxas,
        "quantidade_vendas": quantidade_vendas,
        "formas_pagamento": {
            "pix": total_pix,
            "dinheiro": total_dinheiro,
            "cartao_debito": total_debito,
            "cartao_credito": total_credito
        },
        "vendas_recentes": vendas_recentes
    }