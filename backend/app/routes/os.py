from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo

from app.schemas.os import (
    OrdemServicoCriar,
    OrdemServicoAtualizarStatus,
    OrdemServicoAtualizar
)
from app.models.ordem_servico import OrdemServico
from app.models.cliente import Cliente
from app.database.session import get_db

router = APIRouter(
    prefix="/os",
    tags=["Ordens de Serviço"]
)

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

def montar_os_com_cliente(ordem, cliente):
    return {
        "id": ordem.id,
        "numero_os": ordem.numero_os,
        "cliente_id": ordem.cliente_id,
        "cliente_nome": cliente.nome if cliente else "Cliente não encontrado",
        "equipamento": ordem.equipamento,
        "marca_modelo": ordem.marca_modelo,
        "defeito_relatado": ordem.defeito_relatado,
        "servico_solicitado": ordem.servico_solicitado,
        "status": ordem.status,
        "valor": ordem.valor,
        "prazo_entrega": ordem.prazo_entrega,
        "observacoes": ordem.observacoes,
        "data_abertura": ordem.data_abertura,
        "data_atualizacao": ordem.data_atualizacao
    }

@router.post("/")
def criar_os(
    os: OrdemServicoCriar,
    db: Session = Depends(get_db)
):
    total_os = db.query(OrdemServico).count()
    numero_os = f"OS{total_os + 1:04d}"

    nova_os = OrdemServico(
        numero_os=numero_os,
        cliente_id=os.cliente_id,
        equipamento=os.equipamento,
        marca_modelo=os.marca_modelo,
        defeito_relatado=os.defeito_relatado,
        servico_solicitado=os.servico_solicitado,
        status=os.status,
        valor=os.valor,
        prazo_entrega=os.prazo_entrega,
        observacoes=os.observacoes
    )

    db.add(nova_os)
    db.commit()
    db.refresh(nova_os)

    cliente = db.query(Cliente).filter(Cliente.id == nova_os.cliente_id).first()

    return {
        "mensagem": "Ordem de serviço criada com sucesso",
        "ordem_servico": montar_os_com_cliente(nova_os, cliente)
    }

@router.get("/")
def listar_os(
    db: Session = Depends(get_db)
):
    ordens = db.query(OrdemServico).all()
    resultado = []

    for ordem in ordens:
        cliente = db.query(Cliente).filter(Cliente.id == ordem.cliente_id).first()
        resultado.append(montar_os_com_cliente(ordem, cliente))

    return resultado

@router.get("/{numero_os}")
def consultar_os(
    numero_os: str,
    db: Session = Depends(get_db)
):
    ordem = db.query(OrdemServico).filter(
        OrdemServico.numero_os == numero_os
    ).first()

    if not ordem:
        return {
            "mensagem": "Ordem de serviço não encontrada"
        }

    cliente = db.query(Cliente).filter(Cliente.id == ordem.cliente_id).first()

    return montar_os_com_cliente(ordem, cliente)

@router.put("/{numero_os}")
def atualizar_os(
    numero_os: str,
    dados: OrdemServicoAtualizar,
    db: Session = Depends(get_db)
):
    ordem = db.query(OrdemServico).filter(
        OrdemServico.numero_os == numero_os
    ).first()

    if not ordem:
        return {
            "mensagem": "Ordem de serviço não encontrada"
        }

    ordem.cliente_id = dados.cliente_id
    ordem.equipamento = dados.equipamento
    ordem.marca_modelo = dados.marca_modelo
    ordem.defeito_relatado = dados.defeito_relatado
    ordem.servico_solicitado = dados.servico_solicitado
    ordem.status = dados.status
    ordem.valor = dados.valor
    ordem.prazo_entrega = dados.prazo_entrega
    ordem.observacoes = dados.observacoes
    ordem.data_atualizacao = agora_bahia()

    db.commit()
    db.refresh(ordem)

    cliente = db.query(Cliente).filter(Cliente.id == ordem.cliente_id).first()

    return {
        "mensagem": "Ordem de serviço atualizada com sucesso",
        "ordem_servico": montar_os_com_cliente(ordem, cliente)
    }

@router.patch("/{numero_os}/status")
def atualizar_status_os(
    numero_os: str,
    dados: OrdemServicoAtualizarStatus,
    db: Session = Depends(get_db)
):
    ordem = db.query(OrdemServico).filter(
        OrdemServico.numero_os == numero_os
    ).first()

    if not ordem:
        return {
            "mensagem": "Ordem de serviço não encontrada"
        }

    ordem.status = dados.status
    ordem.data_atualizacao = agora_bahia()

    db.commit()
    db.refresh(ordem)

    cliente = db.query(Cliente).filter(Cliente.id == ordem.cliente_id).first()

    return {
        "mensagem": "Status atualizado com sucesso",
        "ordem_servico": montar_os_com_cliente(ordem, cliente)
    }