from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.models.fornecedor import Fornecedor
from app.schemas.fornecedor import FornecedorCriar, FornecedorAtualizar

router = APIRouter(
    prefix="/fornecedores",
    tags=["Fornecedores"]
)


@router.post("/")
def criar_fornecedor(
    dados: FornecedorCriar,
    db: Session = Depends(get_db)
):
    fornecedor_existente = (
        db.query(Fornecedor)
        .filter(Fornecedor.nome == dados.nome)
        .first()
    )

    if fornecedor_existente:
        return {
            "mensagem": "Já existe um fornecedor com esse nome"
        }

    novo_fornecedor = Fornecedor(
        nome=dados.nome,
        nome_fantasia=dados.nome_fantasia,
        cnpj=dados.cnpj,
        telefone=dados.telefone,
        whatsapp=dados.whatsapp,
        email=dados.email,
        endereco=dados.endereco,
        categoria=dados.categoria,
        observacoes=dados.observacoes,
        status=dados.status or "Ativo"
    )

    db.add(novo_fornecedor)
    db.commit()
    db.refresh(novo_fornecedor)

    return {
        "mensagem": "Fornecedor cadastrado com sucesso",
        "fornecedor": novo_fornecedor
    }


@router.get("/")
def listar_fornecedores(
    db: Session = Depends(get_db)
):
    fornecedores = (
        db.query(Fornecedor)
        .order_by(Fornecedor.nome.asc())
        .all()
    )

    return fornecedores


@router.get("/{fornecedor_id}")
def buscar_fornecedor(
    fornecedor_id: int,
    db: Session = Depends(get_db)
):
    fornecedor = (
        db.query(Fornecedor)
        .filter(Fornecedor.id == fornecedor_id)
        .first()
    )

    if not fornecedor:
        return {
            "mensagem": "Fornecedor não encontrado"
        }

    return fornecedor


@router.put("/{fornecedor_id}")
def atualizar_fornecedor(
    fornecedor_id: int,
    dados: FornecedorAtualizar,
    db: Session = Depends(get_db)
):
    fornecedor = (
        db.query(Fornecedor)
        .filter(Fornecedor.id == fornecedor_id)
        .first()
    )

    if not fornecedor:
        return {
            "mensagem": "Fornecedor não encontrado"
        }

    fornecedor.nome = dados.nome
    fornecedor.nome_fantasia = dados.nome_fantasia
    fornecedor.cnpj = dados.cnpj
    fornecedor.telefone = dados.telefone
    fornecedor.whatsapp = dados.whatsapp
    fornecedor.email = dados.email
    fornecedor.endereco = dados.endereco
    fornecedor.categoria = dados.categoria
    fornecedor.observacoes = dados.observacoes
    fornecedor.status = dados.status or fornecedor.status
    fornecedor.data_atualizacao = datetime.utcnow()

    db.commit()
    db.refresh(fornecedor)

    return {
        "mensagem": "Fornecedor atualizado com sucesso",
        "fornecedor": fornecedor
    }


@router.patch("/{fornecedor_id}/status")
def alterar_status_fornecedor(
    fornecedor_id: int,
    db: Session = Depends(get_db)
):
    fornecedor = (
        db.query(Fornecedor)
        .filter(Fornecedor.id == fornecedor_id)
        .first()
    )

    if not fornecedor:
        return {
            "mensagem": "Fornecedor não encontrado"
        }

    fornecedor.status = "Inativo" if fornecedor.status == "Ativo" else "Ativo"
    fornecedor.data_atualizacao = datetime.utcnow()

    db.commit()
    db.refresh(fornecedor)

    return {
        "mensagem": "Status do fornecedor alterado com sucesso",
        "fornecedor": fornecedor
    }


@router.delete("/{fornecedor_id}")
def excluir_fornecedor(
    fornecedor_id: int,
    db: Session = Depends(get_db)
):
    fornecedor = (
        db.query(Fornecedor)
        .filter(Fornecedor.id == fornecedor_id)
        .first()
    )

    if not fornecedor:
        return {
            "mensagem": "Fornecedor não encontrado"
        }

    db.delete(fornecedor)
    db.commit()

    return {
        "mensagem": "Fornecedor excluído com sucesso"
    }