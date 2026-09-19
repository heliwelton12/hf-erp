from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.models.produto import Produto
from app.models.inventario import Inventario, InventarioItem
from app.models.estoque_movimentacao import EstoqueMovimentacao
from app.schemas.inventario import InventarioCriar, InventarioItemAtualizar

router = APIRouter(
    prefix="/inventarios",
    tags=["Inventários"]
)


@router.post("/")
def criar_inventario(
    dados: InventarioCriar,
    db: Session = Depends(get_db)
):
    produtos = db.query(Produto).order_by(Produto.nome.asc()).all()

    if len(produtos) == 0:
        return {
            "mensagem": "Nenhum produto cadastrado para inventariar"
        }

    novo_inventario = Inventario(
        status="Aberto",
        observacao=dados.observacao
    )

    db.add(novo_inventario)
    db.commit()
    db.refresh(novo_inventario)

    for produto in produtos:
        item = InventarioItem(
            inventario_id=novo_inventario.id,
            produto_id=produto.id,
            produto_nome=produto.nome,
            estoque_sistema=produto.quantidade_estoque,
            estoque_contado=None,
            diferenca=0
        )

        db.add(item)

    db.commit()

    return {
        "mensagem": "Inventário criado com sucesso",
        "inventario_id": novo_inventario.id
    }


@router.get("/")
def listar_inventarios(
    db: Session = Depends(get_db)
):
    inventarios = (
        db.query(Inventario)
        .order_by(Inventario.data_criacao.desc())
        .all()
    )

    resultado = []

    for inventario in inventarios:
        itens = (
            db.query(InventarioItem)
            .filter(InventarioItem.inventario_id == inventario.id)
            .all()
        )

        total_itens = len(itens)
        itens_contados = len([
            item for item in itens
            if item.estoque_contado is not None
        ])

        resultado.append({
            "id": inventario.id,
            "status": inventario.status,
            "observacao": inventario.observacao,
            "data_criacao": inventario.data_criacao,
            "data_finalizacao": inventario.data_finalizacao,
            "total_itens": total_itens,
            "itens_contados": itens_contados
        })

    return resultado


@router.get("/{inventario_id}")
def buscar_inventario(
    inventario_id: int,
    db: Session = Depends(get_db)
):
    inventario = (
        db.query(Inventario)
        .filter(Inventario.id == inventario_id)
        .first()
    )

    if not inventario:
        return {
            "mensagem": "Inventário não encontrado"
        }

    itens = (
        db.query(InventarioItem)
        .filter(InventarioItem.inventario_id == inventario.id)
        .order_by(InventarioItem.produto_nome.asc())
        .all()
    )

    return {
        "id": inventario.id,
        "status": inventario.status,
        "observacao": inventario.observacao,
        "data_criacao": inventario.data_criacao,
        "data_finalizacao": inventario.data_finalizacao,
        "itens": itens
    }


@router.patch("/{inventario_id}/itens/{item_id}")
def atualizar_item_inventario(
    inventario_id: int,
    item_id: int,
    dados: InventarioItemAtualizar,
    db: Session = Depends(get_db)
):
    inventario = (
        db.query(Inventario)
        .filter(Inventario.id == inventario_id)
        .first()
    )

    if not inventario:
        return {
            "mensagem": "Inventário não encontrado"
        }

    if inventario.status == "Finalizado":
        return {
            "mensagem": "Inventário já está finalizado"
        }

    item = (
        db.query(InventarioItem)
        .filter(
            InventarioItem.id == item_id,
            InventarioItem.inventario_id == inventario_id
        )
        .first()
    )

    if not item:
        return {
            "mensagem": "Item do inventário não encontrado"
        }

    if dados.estoque_contado < 0:
        return {
            "mensagem": "Estoque contado não pode ser negativo"
        }

    item.estoque_contado = dados.estoque_contado
    item.diferenca = dados.estoque_contado - item.estoque_sistema

    db.commit()
    db.refresh(item)

    return {
        "mensagem": "Item do inventário atualizado com sucesso",
        "item": item
    }


@router.post("/{inventario_id}/finalizar")
def finalizar_inventario(
    inventario_id: int,
    db: Session = Depends(get_db)
):
    inventario = (
        db.query(Inventario)
        .filter(Inventario.id == inventario_id)
        .first()
    )

    if not inventario:
        return {
            "mensagem": "Inventário não encontrado"
        }

    if inventario.status == "Finalizado":
        return {
            "mensagem": "Inventário já está finalizado"
        }

    itens = (
        db.query(InventarioItem)
        .filter(InventarioItem.inventario_id == inventario.id)
        .all()
    )

    itens_sem_contagem = [
        item for item in itens
        if item.estoque_contado is None
    ]

    if len(itens_sem_contagem) > 0:
        return {
            "mensagem": "Existem produtos sem contagem. Preencha todos antes de finalizar.",
            "itens_pendentes": len(itens_sem_contagem)
        }

    for item in itens:
        produto = db.query(Produto).filter(Produto.id == item.produto_id).first()

        if produto:
            estoque_antes = produto.quantidade_estoque
            estoque_depois = item.estoque_contado

            produto.quantidade_estoque = estoque_depois

            if item.diferenca != 0:
                movimentacao = EstoqueMovimentacao(
                    produto_id=produto.id,
                    tipo="Ajuste",
                    quantidade=estoque_depois,
                    motivo="Inventário de estoque",
                    observacao=f"Inventário #{inventario.id} - ajuste automático",
                    estoque_antes=estoque_antes,
                    estoque_depois=estoque_depois
                )

                db.add(movimentacao)

    inventario.status = "Finalizado"
    inventario.data_finalizacao = datetime.utcnow()

    db.commit()
    db.refresh(inventario)

    return {
        "mensagem": "Inventário finalizado com sucesso",
        "inventario_id": inventario.id
    }