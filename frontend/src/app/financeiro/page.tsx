import Link from "next/link"
import MenuLateral from "@/components/MenuLateral"
import {
  Wallet,
  Receipt,
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,
  WalletCards,
  HandCoins,
} from "lucide-react"

type VendaPrincipal = {
  id: number
  numero_venda: string
  forma_pagamento: string
  parcelas: number
  total_original: number
  taxa_percentual: number
  valor_taxa: number
  total_final: number
  valor_parcela: number
  data_venda: string
  status?: string
}

type ResumoFinanceiro = {
  total_vendido: number
  total_taxas: number
  total_com_taxas: number
  quantidade_vendas: number
  formas_pagamento: {
    pix: number
    dinheiro: number
    cartao_debito: number
    cartao_credito: number
  }
  vendas_recentes: VendaPrincipal[]
}

async function buscarResumo(): Promise<ResumoFinanceiro> {
  const resposta = await fetch("http://127.0.0.1:8000/financeiro/resumo", {
    cache: "no-store",
  })

  return resposta.json()
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarData(data: string) {
  return new Date(data).toLocaleString("pt-BR")
}

export default async function FinanceiroPage() {
  const resumo = await buscarResumo()

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#102A67] mb-2">
              Financeiro
            </h1>

            <p className="text-gray-600">
              Resumo financeiro das vendas registradas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <Link
              href="/contas-pagar"
              className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
            >
              <WalletCards size={20} />
              Contas a Pagar
            </Link>

            <Link
              href="/contas-receber"
              className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
            >
              <HandCoins size={20} />
              Contas a Receber
            </Link>

            <Link
              href="/comprovantes"
              className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0b1f4f] transition flex items-center gap-2"
            >
              <Receipt size={20} />
              Histórico de Comprovantes
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Wallet size={18} />
              Receita líquida
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_vendido)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <TrendingUp size={18} />
              Juros repassados
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_taxas)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              Total pago pelos clientes
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_com_taxas)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#374151] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Receipt size={18} />
              Quantidade de vendas
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {resumo.quantidade_vendas}
            </h2>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#102A67]">
            Formas de pagamento
          </h2>

          <p className="text-gray-500">
            Totais recebidos por tipo de pagamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              PIX
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.formas_pagamento.pix)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Banknote size={18} />
              Dinheiro
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.formas_pagamento.dinheiro)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CreditCard size={18} />
              Débito
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.formas_pagamento.cartao_debito)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CreditCard size={18} />
              Crédito
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.formas_pagamento.cartao_credito)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67]">
              Vendas recentes
            </h2>

            <p className="text-gray-500 mt-1">
              Acompanhe vendas ativas, canceladas e valores recebidos.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Venda</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Você recebe</th>
                  <th className="p-4">Cliente pagou</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {resumo.vendas_recentes.map((venda) => {
                  const status = venda.status || "Ativa"
                  const cancelada = status === "Cancelada"

                  return (
                    <tr
                      key={venda.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-[#102A67] whitespace-nowrap">
                          {venda.numero_venda}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {venda.parcelas > 1
                            ? `${venda.parcelas}x de ${formatarMoeda(
                                venda.valor_parcela
                              )}`
                            : "Pagamento à vista"}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                            cancelada
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                        {formatarMoeda(venda.total_original)}
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        <div>{formatarMoeda(venda.total_final)}</div>

                        {venda.taxa_percentual > 0 && (
                          <div className="text-xs text-orange-600 mt-1">
                            Juros: {venda.taxa_percentual}% /{" "}
                            {formatarMoeda(venda.valor_taxa)}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        {venda.forma_pagamento}
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        {formatarData(venda.data_venda)}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/comprovante/${venda.id}`}
                            className="bg-[#102A67] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#0B1F4F] transition whitespace-nowrap"
                          >
                            Ver
                          </Link>

                          {cancelada ? (
                            <Link
                              href={`/vendas/restaurar/${venda.id}`}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition whitespace-nowrap"
                            >
                              Restaurar
                            </Link>
                          ) : (
                            <Link
                              href={`/vendas/cancelar/${venda.id}`}
                              className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition whitespace-nowrap"
                            >
                              Cancelar
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-[#102A67] font-medium hover:underline"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  )
}