from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.cliente import ClienteCriar, ClienteAtualizar
from app.models.cliente import Cliente
from app.database.session import get_db

router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

@router.post("/")
def criar_cliente(
    cliente: ClienteCriar,
    db: Session = Depends(get_db)
):
    novo_cliente = Cliente(
        nome=cliente.nome,
        telefone=cliente.telefone,
        email=cliente.email
    )

    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)

    return {
        "mensagem": "Cliente cadastrado com sucesso",
        "cliente": {
            "id": novo_cliente.id,
            "nome": novo_cliente.nome,
            "telefone": novo_cliente.telefone,
            "email": novo_cliente.email
        }
    }

@router.get("/")
def listar_clientes(
    db: Session = Depends(get_db)
):
    clientes = db.query(Cliente).all()
    return clientes

@router.get("/{cliente_id}")
def buscar_cliente(
    cliente_id: int,
    db: Session = Depends(get_db)
):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        return {
            "mensagem": "Cliente não encontrado"
        }

    return cliente

@router.put("/{cliente_id}")
def atualizar_cliente(
    cliente_id: int,
    dados: ClienteAtualizar,
    db: Session = Depends(get_db)
):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        return {
            "mensagem": "Cliente não encontrado"
        }

    cliente.nome = dados.nome
    cliente.telefone = dados.telefone
    cliente.email = dados.email

    db.commit()
    db.refresh(cliente)

    return {
        "mensagem": "Cliente atualizado com sucesso",
        "cliente": cliente
    }