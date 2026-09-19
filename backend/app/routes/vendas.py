from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo

from app.schemas.venda import VendaCarrinhoCriar, VendaCancelar
from app.models.venda import Venda
from app.models.produto import Produto
from app.models.servico import Servico
from app.models.venda_principal import VendaPrincipal
from app.models.item_venda import ItemVenda
from app.database.session import get_db

router = APIRouter(
    prefix="/vendas",
    tags=["Vendas"]
)

def agora_bahia():
    return datetime.now(ZoneInfo("America/Bahia")).replace(tzinfo=None)

@router.post("/carrinho")
def criar_venda_carrinho(
    venda: VendaCarrinhoCriar,
    db: Session = Depends(get_db)
):
    total_original = 0

    for item in venda.itens:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()

            if not produto:
                return {"mensagem": f"Produto ID {item.item_id} não encontrado"}

            if produto.quantidade_estoque < item.quantidade:
                return {
                    "mensagem": f"Estoque insuficiente para {produto.nome}",
                    "estoque_atual": produto.quantidade_estoque
                }

        elif item.tipo == "servico":
            servico = db.query(Servico).filter(Servico.id == item.item_id).first()

            if not servico:
                return {"mensagem": f"Serviço ID {item.item_id} não encontrado"}

        else:
            return {"mensagem": "Tipo de item inválido"}

    for item in venda.itens:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()
            total_original += produto.preco_venda * item.quantidade

        if item.tipo == "servico":
            servico = db.query(Servico).filter(Servico.id == item.item_id).first()
            total_original += servico.preco * item.quantidade

    parcelas = venda.parcelas or 1
    taxa_percentual = venda.taxa_percentual or 0

    if taxa_percentual > 0:
        total_com_taxa = total_original / (1 - taxa_percentual / 100)
    else:
        total_com_taxa = total_original

    valor_taxa = total_com_taxa - total_original
    valor_parcela = total_com_taxa / parcelas

    numero_venda = f"VENDA{agora_bahia().strftime('%Y%m%d%H%M%S')}"

    nova_venda_principal = VendaPrincipal(
        numero_venda=numero_venda,
        forma_pagamento=venda.forma_pagamento,
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

    for item in venda.itens:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()
            total_item = produto.preco_venda * item.quantidade

            produto.quantidade_estoque -= item.quantidade

            item_venda = ItemVenda(
                venda_id=nova_venda_principal.id,
                tipo="produto",
                item_id=produto.id,
                nome=produto.nome,
                quantidade=item.quantidade,
                preco_unitario=produto.preco_venda,
                subtotal=total_item
            )

            db.add(item_venda)

            venda_antiga = Venda(
                produto_id=produto.id,
                produto_nome=produto.nome,
                quantidade=item.quantidade,
                preco_unitario=produto.preco_venda,
                total=total_item,
                forma_pagamento=venda.forma_pagamento,
                parcelas=parcelas,
                taxa_percentual=taxa_percentual,
                valor_taxa=valor_taxa,
                total_com_taxa=total_com_taxa,
                valor_parcela=valor_parcela
            )

            db.add(venda_antiga)

        if item.tipo == "servico":
            servico = db.query(Servico).filter(Servico.id == item.item_id).first()
            total_item = servico.preco * item.quantidade

            item_venda = ItemVenda(
                venda_id=nova_venda_principal.id,
                tipo="servico",
                item_id=servico.id,
                nome=servico.nome,
                quantidade=item.quantidade,
                preco_unitario=servico.preco,
                subtotal=total_item
            )

            db.add(item_venda)

            venda_antiga = Venda(
                produto_id=servico.id,
                produto_nome=f"Serviço: {servico.nome}",
                quantidade=item.quantidade,
                preco_unitario=servico.preco,
                total=total_item,
                forma_pagamento=venda.forma_pagamento,
                parcelas=parcelas,
                taxa_percentual=taxa_percentual,
                valor_taxa=valor_taxa,
                total_com_taxa=total_com_taxa,
                valor_parcela=valor_parcela
            )

            db.add(venda_antiga)

    db.commit()
    db.refresh(nova_venda_principal)

    return {
        "mensagem": "Venda do carrinho registrada com sucesso",
        "numero_venda": numero_venda,
        "venda_id": nova_venda_principal.id,
        "total_original": total_original,
        "taxa_percentual": taxa_percentual,
        "valor_taxa": valor_taxa,
        "total_com_taxa": total_com_taxa,
        "parcelas": parcelas,
        "valor_parcela": valor_parcela,
        "forma_pagamento": venda.forma_pagamento,
        "status": nova_venda_principal.status
    }

@router.patch("/{venda_id}/cancelar")
def cancelar_venda(
    venda_id: int,
    dados: VendaCancelar,
    db: Session = Depends(get_db)
):
    venda = db.query(VendaPrincipal).filter(VendaPrincipal.id == venda_id).first()

    if not venda:
        return {
            "mensagem": "Venda não encontrada"
        }

    if venda.status == "Cancelada":
        return {
            "mensagem": "Esta venda já está cancelada",
            "venda": venda
        }

    itens = db.query(ItemVenda).filter(ItemVenda.venda_id == venda.id).all()

    for item in itens:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()

            if produto:
                produto.quantidade_estoque += item.quantidade

    venda.status = "Cancelada"
    venda.motivo_cancelamento = dados.motivo
    venda.data_cancelamento = agora_bahia()

    db.commit()
    db.refresh(venda)

    return {
        "mensagem": "Venda cancelada com sucesso",
        "venda": venda
    }

@router.patch("/{venda_id}/restaurar")
def restaurar_venda(
    venda_id: int,
    db: Session = Depends(get_db)
):
    venda = db.query(VendaPrincipal).filter(VendaPrincipal.id == venda_id).first()

    if not venda:
        return {
            "mensagem": "Venda não encontrada"
        }

    if venda.status != "Cancelada":
        return {
            "mensagem": "Apenas vendas canceladas podem ser restauradas",
            "venda": venda
        }

    itens = db.query(ItemVenda).filter(ItemVenda.venda_id == venda.id).all()

    for item in itens:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()

            if not produto:
                return {
                    "mensagem": f"Produto {item.nome} não encontrado"
                }

            if produto.quantidade_estoque < item.quantidade:
                return {
                    "mensagem": f"Estoque insuficiente para restaurar a venda. Produto: {produto.nome}",
                    "estoque_atual": produto.quantidade_estoque,
                    "quantidade_necessaria": item.quantidade
                }

    for item in itens:
        if item.tipo == "produto":
            produto = db.query(Produto).filter(Produto.id == item.item_id).first()
            produto.quantidade_estoque -= item.quantidade

    venda.status = "Ativa"
    venda.motivo_cancelamento = None
    venda.data_cancelamento = None

    db.commit()
    db.refresh(venda)

    return {
        "mensagem": "Venda restaurada com sucesso",
        "venda": venda
    }

@router.get("/")
def listar_vendas(
    db: Session = Depends(get_db)
):
    vendas = db.query(Venda).all()
    return vendas

@router.get("/principais")
def listar_vendas_principais(
    db: Session = Depends(get_db)
):
    vendas = db.query(VendaPrincipal).order_by(
        VendaPrincipal.data_venda.desc()
    ).all()

    return vendas

@router.get("/{venda_id}/itens")
def listar_itens_venda(
    venda_id: int,
    db: Session = Depends(get_db)
):
    itens = db.query(ItemVenda).filter(ItemVenda.venda_id == venda_id).all()
    return itens

@router.get("/{venda_id}/comprovante")
def gerar_comprovante(
    venda_id: int,
    db: Session = Depends(get_db)
):
    venda = db.query(VendaPrincipal).filter(
        VendaPrincipal.id == venda_id
    ).first()

    if not venda:
        return {
            "mensagem": "Venda não encontrada"
        }

    itens = db.query(ItemVenda).filter(
        ItemVenda.venda_id == venda.id
    ).all()

    return {
        "loja": {
            "nome": "HF ERP",
            "descricao": "Papelaria, informática e serviços",
            "whatsapp": "(71) 99999-9999"
        },
        "venda": {
            "id": venda.id,
            "numero_venda": venda.numero_venda,
            "data_venda": venda.data_venda,
            "forma_pagamento": venda.forma_pagamento,
            "parcelas": venda.parcelas,
            "taxa_percentual": venda.taxa_percentual,
            "total_original": venda.total_original,
            "valor_taxa": venda.valor_taxa,
            "total_final": venda.total_final,
            "valor_parcela": venda.valor_parcela,
            "status": venda.status,
            "motivo_cancelamento": venda.motivo_cancelamento,
            "data_cancelamento": venda.data_cancelamento
        },
        "itens": itens,
        "mensagem_final": "Obrigado pela preferência!"
    }