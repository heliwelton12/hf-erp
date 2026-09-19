from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, time

from app.database.session import get_db
from app.models.venda_principal import VendaPrincipal
from app.models.caixa_fechamento import CaixaFechamento
from app.models.caixa_movimentacao import CaixaMovimentacao
from app.schemas.caixa_movimentacao import CaixaMovimentacaoCriar

router = APIRouter(
    prefix="/caixa",
    tags=["Caixa"]
)

def intervalo_do_dia():
    inicio_dia = datetime.combine(date.today(), time.min)
    fim_dia = datetime.combine(date.today(), time.max)

    return inicio_dia, fim_dia

def calcular_resumo_do_dia(db: Session):
    inicio_dia, fim_dia = intervalo_do_dia()

    vendas = db.query(VendaPrincipal).filter(
        VendaPrincipal.data_venda >= inicio_dia,
        VendaPrincipal.data_venda <= fim_dia,
        VendaPrincipal.status != "Cancelada"
    ).all()

    total_pix = sum(v.total_final for v in vendas if v.forma_pagamento == "PIX")
    total_dinheiro = sum(v.total_final for v in vendas if v.forma_pagamento == "Dinheiro")
    total_debito = sum(v.total_final for v in vendas if v.forma_pagamento == "Cartão de Débito")
    total_credito = sum(v.total_final for v in vendas if v.forma_pagamento == "Cartão de Crédito")

    total_vendas = total_pix + total_dinheiro + total_debito + total_credito

    return {
        "data": date.today(),
        "total_pix": total_pix,
        "total_dinheiro": total_dinheiro,
        "total_debito": total_debito,
        "total_credito": total_credito,
        "total_vendas": total_vendas,
        "quantidade_vendas": len(vendas)
    }

def caixa_ja_fechado_hoje(db: Session):
    inicio_dia, fim_dia = intervalo_do_dia()

    fechamento = db.query(CaixaFechamento).filter(
        CaixaFechamento.data_fechamento >= inicio_dia,
        CaixaFechamento.data_fechamento <= fim_dia
    ).first()

    return fechamento

@router.get("/resumo-dia")
def resumo_caixa_dia(
    db: Session = Depends(get_db)
):
    resumo = calcular_resumo_do_dia(db)
    fechamento = caixa_ja_fechado_hoje(db)

    resumo["caixa_fechado"] = fechamento is not None
    resumo["fechamento_id"] = fechamento.id if fechamento else None

    return resumo

@router.post("/fechar")
def fechar_caixa(
    db: Session = Depends(get_db)
):
    fechamento_existente = caixa_ja_fechado_hoje(db)

    if fechamento_existente:
        return {
            "mensagem": "O caixa de hoje já foi fechado.",
            "fechamento": fechamento_existente
        }

    resumo = calcular_resumo_do_dia(db)

    fechamento = CaixaFechamento(
        total_pix=resumo["total_pix"],
        total_dinheiro=resumo["total_dinheiro"],
        total_debito=resumo["total_debito"],
        total_credito=resumo["total_credito"],
        total_vendas=resumo["total_vendas"]
    )

    db.add(fechamento)
    db.commit()
    db.refresh(fechamento)

    return {
        "mensagem": "Caixa fechado com sucesso",
        "fechamento": fechamento
    }

@router.get("/fechamentos")
def listar_fechamentos(
    db: Session = Depends(get_db)
):
    fechamentos = db.query(CaixaFechamento).order_by(
        CaixaFechamento.data_fechamento.desc()
    ).all()

    return fechamentos

@router.post("/movimentacoes")
def registrar_movimentacao_caixa(
    movimentacao: CaixaMovimentacaoCriar,
    db: Session = Depends(get_db)
):
    nova_movimentacao = CaixaMovimentacao(
        tipo=movimentacao.tipo,
        valor=movimentacao.valor,
        observacao=movimentacao.observacao
    )

    db.add(nova_movimentacao)
    db.commit()
    db.refresh(nova_movimentacao)

    return {
        "mensagem": "Movimentação registrada com sucesso",
        "movimentacao": nova_movimentacao
    }

@router.get("/movimentacoes")
def listar_movimentacoes_caixa(
    db: Session = Depends(get_db)
):
    movimentacoes = (
        db.query(CaixaMovimentacao)
        .order_by(CaixaMovimentacao.data_movimentacao.desc())
        .all()
    )

    return movimentacoes