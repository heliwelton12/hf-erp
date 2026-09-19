from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.servico import ServicoCriar, ServicoAtualizar
from app.models.servico import Servico
from app.database.session import get_db

router = APIRouter(
    prefix="/servicos",
    tags=["Serviços"]
)

def calcular_custo_total(servico):
    return (
        (servico.custo_materiais or 0)
        + (servico.custo_mao_obra or 0)
        + (servico.custo_indireto or 0)
    )

@router.post("/")
def criar_servico(
    servico: ServicoCriar,
    db: Session = Depends(get_db)
):
    custo_total = calcular_custo_total(servico)

    novo_servico = Servico(
        nome=servico.nome,
        categoria=servico.categoria,
        custo_materiais=servico.custo_materiais or 0,
        custo_mao_obra=servico.custo_mao_obra or 0,
        custo_indireto=servico.custo_indireto or 0,
        lucro_percentual=servico.lucro_percentual or 0,
        custo_total=custo_total,
        preco=servico.preco,
        descricao=servico.descricao
    )

    db.add(novo_servico)
    db.commit()
    db.refresh(novo_servico)

    return {
        "mensagem": "Serviço cadastrado com sucesso",
        "servico": novo_servico
    }

@router.get("/")
def listar_servicos(
    db: Session = Depends(get_db)
):
    servicos = db.query(Servico).all()
    return servicos

@router.get("/{servico_id}")
def buscar_servico(
    servico_id: int,
    db: Session = Depends(get_db)
):
    servico = db.query(Servico).filter(Servico.id == servico_id).first()

    if not servico:
        return {
            "mensagem": "Serviço não encontrado"
        }

    return servico

@router.put("/{servico_id}")
def atualizar_servico(
    servico_id: int,
    dados: ServicoAtualizar,
    db: Session = Depends(get_db)
):
    servico = db.query(Servico).filter(Servico.id == servico_id).first()

    if not servico:
        return {
            "mensagem": "Serviço não encontrado"
        }

    custo_total = calcular_custo_total(dados)

    servico.nome = dados.nome
    servico.categoria = dados.categoria
    servico.custo_materiais = dados.custo_materiais or 0
    servico.custo_mao_obra = dados.custo_mao_obra or 0
    servico.custo_indireto = dados.custo_indireto or 0
    servico.lucro_percentual = dados.lucro_percentual or 0
    servico.custo_total = custo_total
    servico.preco = dados.preco
    servico.descricao = dados.descricao

    db.commit()
    db.refresh(servico)

    return {
        "mensagem": "Serviço atualizado com sucesso",
        "servico": servico
    }