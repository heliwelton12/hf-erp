from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.models.orcamento import Orcamento, OrcamentoItem
from app.models.cliente import Cliente
from app.schemas.orcamento import OrcamentoCriar, OrcamentoStatusAtualizar
from app.models.produto import Produto
from app.models.servico import Servico
from app.models.venda import Venda
from app.models.venda_principal import VendaPrincipal
from app.models.item_venda import ItemVenda
from pydantic import BaseModel
from zoneinfo import ZoneInfo

router = APIRouter(
    prefix="/orcamentos",
    tags=["Orçamentos"]
)
class OrcamentoConverterVenda(BaseModel):
    forma_pagamento: str
    parcelas: int = 1
    taxa_percentual: float = 0


def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

def gerar_numero_orcamento(db: Session):
    ultimo_orcamento = (
        db.query(Orcamento)
        .order_by(Orcamento.id.desc())
        .first()
    )

    if not ultimo_orcamento:
        return "ORC0001"

    proximo_id = ultimo_orcamento.id + 1
    return f"ORC{proximo_id:04d}"


@router.post("/")
def criar_orcamento(
    dados: OrcamentoCriar,
    db: Session = Depends(get_db)
):
    cliente = db.query(Cliente).filter(Cliente.id == dados.cliente_id).first()

    if not cliente:
        return {
            "mensagem": "Cliente não encontrado"
        }

    if len(dados.itens) == 0:
        return {
            "mensagem": "Adicione pelo menos um item ao orçamento"
        }

    numero_orcamento = gerar_numero_orcamento(db)

    total = sum(
        item.quantidade * item.preco_unitario
        for item in dados.itens
    )

    novo_orcamento = Orcamento(
        numero_orcamento=numero_orcamento,
        cliente_id=dados.cliente_id,
        observacoes=dados.observacoes,
        total=total,
        status="Aberto"
    )

    db.add(novo_orcamento)
    db.commit()
    db.refresh(novo_orcamento)

    for item in dados.itens:
        subtotal = item.quantidade * item.preco_unitario

        novo_item = OrcamentoItem(
            orcamento_id=novo_orcamento.id,
            tipo=item.tipo,
            item_id=item.item_id,
            nome=item.nome,
            quantidade=item.quantidade,
            preco_unitario=item.preco_unitario,
            subtotal=subtotal
        )

        db.add(novo_item)

    db.commit()

    return {
        "mensagem": "Orçamento criado com sucesso",
        "numero_orcamento": novo_orcamento.numero_orcamento,
        "orcamento_id": novo_orcamento.id
    }


@router.get("/")
def listar_orcamentos(
    db: Session = Depends(get_db)
):
    orcamentos = (
        db.query(Orcamento)
        .order_by(Orcamento.data_criacao.desc())
        .all()
    )

    resultado = []

    for orcamento in orcamentos:
        resultado.append({
            "id": orcamento.id,
            "numero_orcamento": orcamento.numero_orcamento,
            "cliente_id": orcamento.cliente_id,
            "cliente_nome": orcamento.cliente.nome if orcamento.cliente else "",
            "status": orcamento.status,
            "observacoes": orcamento.observacoes,
            "total": orcamento.total,
            "data_criacao": orcamento.data_criacao,
            "data_atualizacao": orcamento.data_atualizacao
        })

    return resultado


@router.get("/{numero_orcamento}")
def buscar_orcamento(
    numero_orcamento: str,
    db: Session = Depends(get_db)
):
    orcamento = (
        db.query(Orcamento)
        .filter(Orcamento.numero_orcamento == numero_orcamento)
        .first()
    )

    if not orcamento:
        return {
            "mensagem": "Orçamento não encontrado"
        }

    itens = (
        db.query(OrcamentoItem)
        .filter(OrcamentoItem.orcamento_id == orcamento.id)
        .all()
    )

    return {
        "id": orcamento.id,
        "numero_orcamento": orcamento.numero_orcamento,
        "cliente_id": orcamento.cliente_id,
        "cliente_nome": orcamento.cliente.nome if orcamento.cliente else "",
        "cliente_telefone": orcamento.cliente.telefone if orcamento.cliente else "",
        "status": orcamento.status,
        "observacoes": orcamento.observacoes,
        "total": orcamento.total,
        "data_criacao": orcamento.data_criacao,
        "data_atualizacao": orcamento.data_atualizacao,
        "itens": itens
    }


@router.patch("/{numero_orcamento}/status")
def atualizar_status_orcamento(
    numero_orcamento: str,
    dados: OrcamentoStatusAtualizar,
    db: Session = Depends(get_db)
):
    orcamento = (
        db.query(Orcamento)
        .filter(Orcamento.numero_orcamento == numero_orcamento)
        .first()
    )

    if not orcamento:
        return {
            "mensagem": "Orçamento não encontrado"
        }

    orcamento.status = dados.status
    orcamento.data_atualizacao = datetime.utcnow()

    db.commit()
    db.refresh(orcamento)

    return {
        "mensagem": "Status do orçamento atualizado com sucesso",
        "orcamento": orcamento
    }
@router.post("/{numero_orcamento}/converter-venda")
def converter_orcamento_em_venda(
    numero_orcamento: str,
    dados: OrcamentoConverterVenda,
    db: Session = Depends(get_db)
):
    orcamento = (
        db.query(Orcamento)
        .filter(Orcamento.numero_orcamento == numero_orcamento)
        .first()
    )

    if not orcamento:
        return {"mensagem": "Orçamento não encontrado"}

    if orcamento.status == "Convertido":
        return {"mensagem": "Este orçamento já foi convertido"}

    itens_orcamento = (
        db.query(OrcamentoItem)
        .filter(OrcamentoItem.orcamento_id == orcamento.id)
        .all()
    )

    if len(itens_orcamento) == 0:
        return {"mensagem": "Este orçamento não possui itens"}

    for item in itens_orcamento:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()

            if not produto:
                return {"mensagem": f"Produto {item.nome} não encontrado"}

            if produto.quantidade_estoque < item.quantidade:
                return {
                    "mensagem": f"Estoque insuficiente para {produto.nome}",
                    "estoque_atual": produto.quantidade_estoque,
                    "quantidade_necessaria": item.quantidade
                }

        elif item.tipo == "servico":
            servico = db.query(Servico).filter(Servico.id == item.item_id).first()

            if not servico:
                return {"mensagem": f"Serviço {item.nome} não encontrado"}

        else:
            return {"mensagem": "Tipo de item inválido"}

    total_original = sum(item.subtotal for item in itens_orcamento)

    parcelas = dados.parcelas or 1
    taxa_percentual = dados.taxa_percentual or 0

    if taxa_percentual > 0:
        total_com_taxa = total_original / (1 - taxa_percentual / 100)
    else:
        total_com_taxa = total_original

    valor_taxa = total_com_taxa - total_original
    valor_parcela = total_com_taxa / parcelas

    numero_venda = f"VENDA{agora_bahia().strftime('%Y%m%d%H%M%S')}"

    nova_venda_principal = VendaPrincipal(
        numero_venda=numero_venda,
        forma_pagamento=dados.forma_pagamento,
        parcelas=parcelas,
        total_original=total_original,
        taxa_percentual=taxa_percentual,
        valor_taxa=valor_taxa,
        total_final=total_com_taxa,
        valor_parcela=valor_parcela,
        status="Ativa"
    )

    db.add(nova_venda_principal)
    db.flush()

    for item in itens_orcamento:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()

            produto.quantidade_estoque -= item.quantidade

            item_venda = ItemVenda(
                venda_id=nova_venda_principal.id,
                tipo="produto",
                item_id=produto.id,
                nome=produto.nome,
                quantidade=item.quantidade,
                preco_unitario=item.preco_unitario,
                subtotal=item.subtotal
            )

            db.add(item_venda)

            venda_antiga = Venda(
                produto_id=produto.id,
                produto_nome=produto.nome,
                quantidade=item.quantidade,
                preco_unitario=item.preco_unitario,
                total=item.subtotal,
                forma_pagamento=dados.forma_pagamento,
                parcelas=parcelas,
                taxa_percentual=taxa_percentual,
                valor_taxa=valor_taxa,
                total_com_taxa=total_com_taxa,
                valor_parcela=valor_parcela
            )

            db.add(venda_antiga)

        if item.tipo == "servico":
            servico = db.query(Servico).filter(Servico.id == item.item_id).first()

            item_venda = ItemVenda(
                venda_id=nova_venda_principal.id,
                tipo="servico",
                item_id=servico.id,
                nome=servico.nome,
                quantidade=item.quantidade,
                preco_unitario=item.preco_unitario,
                subtotal=item.subtotal
            )

            db.add(item_venda)

            venda_antiga = Venda(
                produto_id=servico.id,
                produto_nome=f"Serviço: {servico.nome}",
                quantidade=item.quantidade,
                preco_unitario=item.preco_unitario,
                total=item.subtotal,
                forma_pagamento=dados.forma_pagamento,
                parcelas=parcelas,
                taxa_percentual=taxa_percentual,
                valor_taxa=valor_taxa,
                total_com_taxa=total_com_taxa,
                valor_parcela=valor_parcela
            )

            db.add(venda_antiga)

    orcamento.status = "Convertido"
    orcamento.data_atualizacao = agora_bahia()

    db.commit()
    db.refresh(nova_venda_principal)

    return {
        "mensagem": "Orçamento convertido em venda com sucesso",
        "numero_orcamento": orcamento.numero_orcamento,
        "numero_venda": nova_venda_principal.numero_venda,
        "venda_id": nova_venda_principal.id,
        "total_original": total_original,
        "total_final": total_com_taxa,
        "forma_pagamento": dados.forma_pagamento,
        "parcelas": parcelas
    }