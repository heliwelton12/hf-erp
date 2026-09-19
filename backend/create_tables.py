from app.database.connection import engine
from app.database.base import Base

from app.models.cliente import Cliente
from app.models.ordem_servico import OrdemServico
from app.models.produto import Produto
from app.models.venda import Venda
from app.models.servico import Servico
from app.models.venda_principal import VendaPrincipal
from app.models.item_venda import ItemVenda
from app.models.caixa_fechamento import CaixaFechamento
from app.models.categoria import Categoria
from app.models.configuracao_empresa import ConfiguracaoEmpresa
from app.models.caixa_movimentacao import CaixaMovimentacao
from app.models.orcamento import Orcamento, OrcamentoItem
from app.models.estoque_movimentacao import EstoqueMovimentacao
from app.models.inventario import Inventario, InventarioItem
from app.models.fornecedor import Fornecedor
from app.models.conta_pagar import ContaPagar
from app.models.conta_receber import ContaReceber

Base.metadata.create_all(bind=engine)

print("Tabelas criadas com sucesso!")