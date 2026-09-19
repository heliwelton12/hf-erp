from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date

from app.database.session import get_db
from app.models.conta_pagar import ContaPagar
from app.models.fornecedor import Fornecedor
from app.schemas.conta_pagar import (
    ContaPagarCriar,
    ContaPagarAtualizar,
    ContaPagarPagar,
)

router = APIRouter(
    prefix="/contas-pagar",
    tags=["Contas a Pagar"]
)


@router.post("/")
def criar_conta_pagar(
    dados: ContaPagarCriar,
    db: Session = Depends(get_db)
):
    if dados.fornecedor_id:
        fornecedor = (
            db.query(Fornecedor)
            .filter(Fornecedor.id == dados.fornecedor_id)
            .first()
        )

        if not fornecedor:
            return {
                "mensagem": "Fornecedor não encontrado"
            }

    if dados.valor <= 0:
        return {
            "mensagem": "Informe um valor válido"
        }

    nova_conta = ContaPagar(
        fornecedor_id=dados.fornecedor_id,
        descricao=dados.descricao,
        categoria=dados.categoria,
        valor=dados.valor,
        data_vencimento=dados.data_vencimento,
        data_pagamento=dados.data_pagamento,
        forma_pagamento=dados.forma_pagamento,
        status=dados.status or "Em aberto",
        observacoes=dados.observacoes,
    )

    db.add(nova_conta)
    db.commit()
    db.refresh(nova_conta)

    return {
        "mensagem": "Conta a pagar cadastrada com sucesso",
        "conta": nova_conta
    }


@router.get("/")
def listar_contas_pagar(
    db: Session = Depends(get_db)
):
    contas = (
        db.query(ContaPagar)
        .order_by(ContaPagar.data_vencimento.asc())
        .all()
    )

    resultado = []

    hoje = date.today()

    for conta in contas:
        fornecedor = None

        if conta.fornecedor_id:
            fornecedor = (
                db.query(Fornecedor)
                .filter(Fornecedor.id == conta.fornecedor_id)
                .first()
            )

        status_calculado = conta.status

        if conta.status == "Em aberto" and conta.data_vencimento < hoje:
            status_calculado = "Vencido"

        resultado.append({
            "id": conta.id,
            "fornecedor_id": conta.fornecedor_id,
            "fornecedor_nome": fornecedor.nome if fornecedor else "",
            "descricao": conta.descricao,
            "categoria": conta.categoria,
            "valor": conta.valor,
            "data_vencimento": conta.data_vencimento,
            "data_pagamento": conta.data_pagamento,
            "forma_pagamento": conta.forma_pagamento,
            "status": status_calculado,
            "observacoes": conta.observacoes,
            "data_cadastro": conta.data_cadastro,
            "data_atualizacao": conta.data_atualizacao
        })

    return resultado


@router.get("/{conta_id}")
def buscar_conta_pagar(
    conta_id: int,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaPagar)
        .filter(ContaPagar.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a pagar não encontrada"
        }

    fornecedor_nome = ""

    if conta.fornecedor_id:
        fornecedor = (
            db.query(Fornecedor)
            .filter(Fornecedor.id == conta.fornecedor_id)
            .first()
        )

        if fornecedor:
            fornecedor_nome = fornecedor.nome

    return {
        "id": conta.id,
        "fornecedor_id": conta.fornecedor_id,
        "fornecedor_nome": fornecedor_nome,
        "descricao": conta.descricao,
        "categoria": conta.categoria,
        "valor": conta.valor,
        "data_vencimento": conta.data_vencimento,
        "data_pagamento": conta.data_pagamento,
        "forma_pagamento": conta.forma_pagamento,
        "status": conta.status,
        "observacoes": conta.observacoes,
        "data_cadastro": conta.data_cadastro,
        "data_atualizacao": conta.data_atualizacao
    }


@router.put("/{conta_id}")
def atualizar_conta_pagar(
    conta_id: int,
    dados: ContaPagarAtualizar,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaPagar)
        .filter(ContaPagar.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a pagar não encontrada"
        }

    if dados.fornecedor_id:
        fornecedor = (
            db.query(Fornecedor)
            .filter(Fornecedor.id == dados.fornecedor_id)
            .first()
        )

        if not fornecedor:
            return {
                "mensagem": "Fornecedor não encontrado"
            }

    if dados.valor <= 0:
        return {
            "mensagem": "Informe um valor válido"
        }

    conta.fornecedor_id = dados.fornecedor_id
    conta.descricao = dados.descricao
    conta.categoria = dados.categoria
    conta.valor = dados.valor
    conta.data_vencimento = dados.data_vencimento
    conta.data_pagamento = dados.data_pagamento
    conta.forma_pagamento = dados.forma_pagamento
    conta.status = dados.status or conta.status
    conta.observacoes = dados.observacoes
    conta.data_atualizacao = datetime.utcnow()

    db.commit()
    db.refresh(conta)

    return {
        "mensagem": "Conta a pagar atualizada com sucesso",
        "conta": conta
    }


@router.patch("/{conta_id}/pagar")
def pagar_conta(
    conta_id: int,
    dados: ContaPagarPagar,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaPagar)
        .filter(ContaPagar.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a pagar não encontrada"
        }

    if conta.status == "Pago":
        return {
            "mensagem": "Esta conta já está paga",
            "conta": conta
        }

    conta.status = "Pago"
    conta.data_pagamento = dados.data_pagamento
    conta.forma_pagamento = dados.forma_pagamento
    conta.data_atualizacao = datetime.utcnow()

    db.commit()
    db.refresh(conta)

    return {
        "mensagem": "Conta marcada como paga com sucesso",
        "conta": conta
    }


@router.patch("/{conta_id}/cancelar")
def cancelar_conta(
    conta_id: int,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaPagar)
        .filter(ContaPagar.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a pagar não encontrada"
        }

    if conta.status == "Cancelado":
        return {
            "mensagem": "Esta conta já está cancelada",
            "conta": conta
        }

    conta.status = "Cancelado"
    conta.data_atualizacao = datetime.utcnow()

    db.commit()
    db.refresh(conta)

    return {
        "mensagem": "Conta cancelada com sucesso",
        "conta": conta
    }


@router.delete("/{conta_id}")
def excluir_conta_pagar(
    conta_id: int,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaPagar)
        .filter(ContaPagar.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a pagar não encontrada"
        }

    db.delete(conta)
    db.commit()

    return {
        "mensagem": "Conta a pagar excluída com sucesso"
    }