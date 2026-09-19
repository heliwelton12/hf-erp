from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.produto import ProdutoCriar, ProdutoAtualizar
from app.models.produto import Produto
from app.database.session import get_db

router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"]
)

@router.post("/")
def criar_produto(
    produto: ProdutoCriar,
    db: Session = Depends(get_db)
):
    if produto.codigo_barras:
        codigo_existente = db.query(Produto).filter(
            Produto.codigo_barras == produto.codigo_barras
        ).first()

        if codigo_existente:
            return {
                "mensagem": "Já existe um produto cadastrado com este código de barras",
                "produto": codigo_existente
            }

    novo_produto = Produto(
        nome=produto.nome,
        categoria=produto.categoria,
        codigo_barras=produto.codigo_barras,
        preco_compra=produto.preco_compra,
        preco_venda=produto.preco_venda,
        quantidade_estoque=produto.quantidade_estoque,
        estoque_minimo=produto.estoque_minimo
    )

    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)

    return {
        "mensagem": "Produto cadastrado com sucesso",
        "produto": novo_produto
    }

@router.get("/")
def listar_produtos(
    db: Session = Depends(get_db)
):
    produtos = db.query(Produto).all()
    return produtos

@router.get("/codigo-barras/{codigo_barras}")
def buscar_produto_por_codigo_barras(
    codigo_barras: str,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(
        Produto.codigo_barras == codigo_barras
    ).first()

    if not produto:
        return {
            "mensagem": "Produto não encontrado"
        }

    return produto

@router.get("/{produto_id}")
def buscar_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()

    if not produto:
        return {
            "mensagem": "Produto não encontrado"
        }

    return produto

@router.put("/{produto_id}")
def atualizar_produto(
    produto_id: int,
    dados: ProdutoAtualizar,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()

    if not produto:
        return {
            "mensagem": "Produto não encontrado"
        }

    if dados.codigo_barras:
        codigo_existente = db.query(Produto).filter(
            Produto.codigo_barras == dados.codigo_barras,
            Produto.id != produto_id
        ).first()

        if codigo_existente:
            return {
                "mensagem": "Já existe outro produto com este código de barras",
                "produto": codigo_existente
            }

    produto.nome = dados.nome
    produto.categoria = dados.categoria
    produto.codigo_barras = dados.codigo_barras
    produto.preco_compra = dados.preco_compra
    produto.preco_venda = dados.preco_venda
    produto.quantidade_estoque = dados.quantidade_estoque
    produto.estoque_minimo = dados.estoque_minimo

    db.commit()
    db.refresh(produto)

    return {
        "mensagem": "Produto atualizado com sucesso",
        "produto": produto
    }