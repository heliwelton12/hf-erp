from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.produto import Produto
from app.models.estoque_movimentacao import EstoqueMovimentacao
from app.schemas.estoque_movimentacao import EstoqueMovimentacaoCriar

router = APIRouter(
    prefix="/estoque",
    tags=["Estoque"]
)


@router.post("/movimentacoes")
def registrar_movimentacao_estoque(
    dados: EstoqueMovimentacaoCriar,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(Produto.id == dados.produto_id).first()

    if not produto:
        return {
            "mensagem": "Produto não encontrado"
        }

    if dados.quantidade <= 0:
        return {
            "mensagem": "Informe uma quantidade válida"
        }

    estoque_antes = produto.quantidade_estoque

    if dados.tipo == "Entrada":
        produto.quantidade_estoque += dados.quantidade

    elif dados.tipo == "Saida":
        if produto.quantidade_estoque < dados.quantidade:
            return {
                "mensagem": "Estoque insuficiente para saída",
                "estoque_atual": produto.quantidade_estoque
            }

        produto.quantidade_estoque -= dados.quantidade

    elif dados.tipo == "Ajuste":
        produto.quantidade_estoque = dados.quantidade

    else:
        return {
            "mensagem": "Tipo de movimentação inválido"
        }

    estoque_depois = produto.quantidade_estoque

    nova_movimentacao = EstoqueMovimentacao(
        produto_id=produto.id,
        tipo=dados.tipo,
        quantidade=dados.quantidade,
        motivo=dados.motivo,
        observacao=dados.observacao,
        estoque_antes=estoque_antes,
        estoque_depois=estoque_depois
    )

    db.add(nova_movimentacao)
    db.commit()
    db.refresh(nova_movimentacao)

    return {
        "mensagem": "Movimentação de estoque registrada com sucesso",
        "produto": produto.nome,
        "estoque_antes": estoque_antes,
        "estoque_depois": estoque_depois,
        "movimentacao": nova_movimentacao
    }


@router.get("/movimentacoes")
def listar_movimentacoes_estoque(
    db: Session = Depends(get_db)
):
    movimentacoes = (
        db.query(EstoqueMovimentacao)
        .order_by(EstoqueMovimentacao.data_movimentacao.desc())
        .all()
    )

    resultado = []

    for mov in movimentacoes:
        produto = db.query(Produto).filter(Produto.id == mov.produto_id).first()

        resultado.append({
            "id": mov.id,
            "produto_id": mov.produto_id,
            "produto_nome": produto.nome if produto else "",
            "tipo": mov.tipo,
            "quantidade": mov.quantidade,
            "motivo": mov.motivo,
            "observacao": mov.observacao,
            "estoque_antes": mov.estoque_antes,
            "estoque_depois": mov.estoque_depois,
            "data_movimentacao": mov.data_movimentacao
        })

    return resultado