from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCriar, CategoriaAtualizar

router = APIRouter(
    prefix="/categorias",
    tags=["Categorias"]
)

@router.post("/")
def criar_categoria(
    categoria: CategoriaCriar,
    db: Session = Depends(get_db)
):
    categoria_existente = db.query(Categoria).filter(
        Categoria.nome == categoria.nome
    ).first()

    if categoria_existente:
        return {
            "mensagem": "Categoria já cadastrada",
            "categoria": categoria_existente
        }

    nova_categoria = Categoria(
        nome=categoria.nome
    )

    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)

    return {
        "mensagem": "Categoria cadastrada com sucesso",
        "categoria": nova_categoria
    }

@router.get("/")
def listar_categorias(
    db: Session = Depends(get_db)
):
    categorias = db.query(Categoria).order_by(
        Categoria.nome.asc()
    ).all()

    return categorias

@router.get("/{categoria_id}")
def buscar_categoria(
    categoria_id: int,
    db: Session = Depends(get_db)
):
    categoria = db.query(Categoria).filter(
        Categoria.id == categoria_id
    ).first()

    if not categoria:
        return {
            "mensagem": "Categoria não encontrada"
        }

    return categoria

@router.put("/{categoria_id}")
def atualizar_categoria(
    categoria_id: int,
    dados: CategoriaAtualizar,
    db: Session = Depends(get_db)
):
    categoria = db.query(Categoria).filter(
        Categoria.id == categoria_id
    ).first()

    if not categoria:
        return {
            "mensagem": "Categoria não encontrada"
        }

    categoria.nome = dados.nome

    db.commit()
    db.refresh(categoria)

    return {
        "mensagem": "Categoria atualizada com sucesso",
        "categoria": categoria
    }

@router.delete("/{categoria_id}")
def excluir_categoria(
    categoria_id: int,
    db: Session = Depends(get_db)
):
    categoria = db.query(Categoria).filter(
        Categoria.id == categoria_id
    ).first()

    if not categoria:
        return {
            "mensagem": "Categoria não encontrada"
        }

    db.delete(categoria)
    db.commit()

    return {
        "mensagem": "Categoria excluída com sucesso"
    }