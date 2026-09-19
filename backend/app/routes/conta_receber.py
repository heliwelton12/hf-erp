from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date

from app.database.session import get_db
from app.models.conta_receber import ContaReceber
from app.models.cliente import Cliente
from app.schemas.conta_receber import (
    ContaReceberCriar,
    ContaReceberAtualizar,
    ContaReceberReceber,
)

router = APIRouter(
    prefix="/contas-receber",
    tags=["Contas a Receber"]
)


@router.post("/")
def criar_conta_receber(
    dados: ContaReceberCriar,
    db: Session = Depends(get_db)
):
    if dados.cliente_id:
        cliente = (
            db.query(Cliente)
            .filter(Cliente.id == dados.cliente_id)
            .first()
        )

        if not cliente:
            return {
                "mensagem": "Cliente não encontrado"
            }

    if dados.valor <= 0:
        return {
            "mensagem": "Informe um valor válido"
        }

    nova_conta = ContaReceber(
        cliente_id=dados.cliente_id,
        descricao=dados.descricao,
        categoria=dados.categoria,
        valor=dados.valor,
        data_vencimento=dados.data_vencimento,
        data_recebimento=dados.data_recebimento,
        forma_recebimento=dados.forma_recebimento,
        status=dados.status or "Em aberto",
        observacoes=dados.observacoes,
    )

    db.add(nova_conta)
    db.commit()
    db.refresh(nova_conta)

    return {
        "mensagem": "Conta a receber cadastrada com sucesso",
        "conta": nova_conta
    }


@router.get("/")
def listar_contas_receber(
    db: Session = Depends(get_db)
):
    contas = (
        db.query(ContaReceber)
        .order_by(ContaReceber.data_vencimento.asc())
        .all()
    )

    resultado = []

    hoje = date.today()

    for conta in contas:
        cliente = None

        if conta.cliente_id:
            cliente = (
                db.query(Cliente)
                .filter(Cliente.id == conta.cliente_id)
                .first()
            )

        status_calculado = conta.status

        if conta.status == "Em aberto" and conta.data_vencimento < hoje:
            status_calculado = "Atrasado"

        resultado.append({
            "id": conta.id,
            "cliente_id": conta.cliente_id,
            "cliente_nome": cliente.nome if cliente else "",
            "descricao": conta.descricao,
            "categoria": conta.categoria,
            "valor": conta.valor,
            "data_vencimento": conta.data_vencimento,
            "data_recebimento": conta.data_recebimento,
            "forma_recebimento": conta.forma_recebimento,
            "status": status_calculado,
            "observacoes": conta.observacoes,
            "data_criacao": conta.data_criacao
        })

    return resultado


@router.get("/{conta_id}")
def buscar_conta_receber(
    conta_id: int,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaReceber)
        .filter(ContaReceber.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a receber não encontrada"
        }

    cliente_nome = ""

    if conta.cliente_id:
        cliente = (
            db.query(Cliente)
            .filter(Cliente.id == conta.cliente_id)
            .first()
        )

        if cliente:
            cliente_nome = cliente.nome

    return {
        "id": conta.id,
        "cliente_id": conta.cliente_id,
        "cliente_nome": cliente_nome,
        "descricao": conta.descricao,
        "categoria": conta.categoria,
        "valor": conta.valor,
        "data_vencimento": conta.data_vencimento,
        "data_recebimento": conta.data_recebimento,
        "forma_recebimento": conta.forma_recebimento,
        "status": conta.status,
        "observacoes": conta.observacoes,
        "data_criacao": conta.data_criacao
    }


@router.put("/{conta_id}")
def atualizar_conta_receber(
    conta_id: int,
    dados: ContaReceberAtualizar,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaReceber)
        .filter(ContaReceber.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a receber não encontrada"
        }

    if dados.cliente_id:
        cliente = (
            db.query(Cliente)
            .filter(Cliente.id == dados.cliente_id)
            .first()
        )

        if not cliente:
            return {
                "mensagem": "Cliente não encontrado"
            }

    if dados.valor <= 0:
        return {
            "mensagem": "Informe um valor válido"
        }

    conta.cliente_id = dados.cliente_id
    conta.descricao = dados.descricao
    conta.categoria = dados.categoria
    conta.valor = dados.valor
    conta.data_vencimento = dados.data_vencimento
    conta.data_recebimento = dados.data_recebimento
    conta.forma_recebimento = dados.forma_recebimento
    conta.status = dados.status or conta.status
    conta.observacoes = dados.observacoes

    db.commit()
    db.refresh(conta)

    return {
        "mensagem": "Conta a receber atualizada com sucesso",
        "conta": conta
    }


@router.patch("/{conta_id}/receber")
def receber_conta(
    conta_id: int,
    dados: ContaReceberReceber,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaReceber)
        .filter(ContaReceber.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a receber não encontrada"
        }

    if conta.status == "Recebido":
        return {
            "mensagem": "Esta conta já está recebida",
            "conta": conta
        }

    conta.status = "Recebido"
    conta.data_recebimento = dados.data_recebimento
    conta.forma_recebimento = dados.forma_recebimento

    db.commit()
    db.refresh(conta)

    return {
        "mensagem": "Conta marcada como recebida com sucesso",
        "conta": conta
    }


@router.patch("/{conta_id}/cancelar")
def cancelar_conta(
    conta_id: int,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaReceber)
        .filter(ContaReceber.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a receber não encontrada"
        }

    if conta.status == "Cancelado":
        return {
            "mensagem": "Esta conta já está cancelada",
            "conta": conta
        }

    conta.status = "Cancelado"

    db.commit()
    db.refresh(conta)

    return {
        "mensagem": "Conta cancelada com sucesso",
        "conta": conta
    }


@router.delete("/{conta_id}")
def excluir_conta_receber(
    conta_id: int,
    db: Session = Depends(get_db)
):
    conta = (
        db.query(ContaReceber)
        .filter(ContaReceber.id == conta_id)
        .first()
    )

    if not conta:
        return {
            "mensagem": "Conta a receber não encontrada"
        }

    db.delete(conta)
    db.commit()

    return {
        "mensagem": "Conta a receber excluída com sucesso"
    }