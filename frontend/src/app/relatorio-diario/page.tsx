"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  ArrowLeft,
  Printer,
  BarChart3,
  CalendarDays,
  ShoppingCart,
  DollarSign,
  Banknote,
  CreditCard,
  PlusCircle,
  MinusCircle,
  Wallet,
  Clock,
  ClipboardList,
} from "lucide-react"

type ResumoCaixa = {
  data: string
  total_pix: number
  total_dinheiro: number
  total_debito: number
  total_credito: number
  total_vendas: number
  quantidade_vendas: number
  caixa_fechado: boolean
}

type CaixaMovimentacao = {
  id: number
  tipo: string
  valor: number
  observacao?: string
  data_movimentacao: string
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

export default function RelatorioDiarioPage() {
  const [resumo, setResumo] = useState<ResumoCaixa | null>(null)
  const [movimentacoes, setMovimentacoes] = useState<CaixaMovimentacao[]>([])
  const [dataGeracao, setDataGeracao] = useState("")

  async function buscarDados() {
    const respostaResumo = await fetch("http://127.0.0.1:8000/caixa/resumo-dia")
    const dadosResumo = await respostaResumo.json()
    setResumo(dadosResumo)

    const respostaMovimentacoes = await fetch("http://127.0.0.1:8000/caixa/movimentacoes")
    const dadosMovimentacoes = await respostaMovimentacoes.json()
    setMovimentacoes(dadosMovimentacoes)

    setDataGeracao(new Date().toLocaleString("pt-BR"))
  }

  useEffect(() => {
    buscarDados()
  }, [])

  if (!resumo) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <MenuLateral />

        <div className="max-w-5xl mx-auto pl-24">
          <div className="bg-white rounded-2xl shadow p-6 text-gray-600">
            Carregando relatório...
          </div>
        </div>
      </main>
    )
  }

  const totalSangrias = movimentacoes
    .filter((mov) => mov.tipo === "Sangria")
    .reduce((total, mov) => total + mov.valor, 0)

  const totalSuprimentos = movimentacoes
    .filter((mov) => mov.tipo === "Suprimento")
    .reduce((total, mov) => total + mov.valor, 0)

  const dinheiroEsperado =
    resumo.total_dinheiro + totalSuprimentos - totalSangrias

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8 print:bg-white print:p-0">
      <div className="print:hidden">
        <MenuLateral />
      </div>

      <div className="max-w-5xl mx-auto pl-24 print:pl-0">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/caixa-fechamento"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar ao Fechamento
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2"
          >
            <Printer size={20} />
            Imprimir Relatório
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 print:shadow-none print:border-none print:rounded-none">
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-[#102A67] flex items-center justify-center gap-3">
              <BarChart3 size={32} />
              Relatório Diário
            </h1>

            <p className="text-gray-600 mt-2">
              HF Papelaria & Informática
            </p>

            <p className="text-gray-500 mt-1">
              {new Date(resumo.data).toLocaleDateString("pt-BR")}
            </p>

            <p className="text-gray-500 mt-1 flex items-center justify-center gap-2">
              <Clock size={16} />
              Gerado em: {dataGeracao}
            </p>

            <p
              className={`inline-block mt-3 px-4 py-2 rounded-full font-bold ${
                resumo.caixa_fechado
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {resumo.caixa_fechado ? "Caixa fechado" : "Caixa aberto"}
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#102A67] mb-4">
              Resumo do dia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F5F7FA] rounded-2xl p-5 border border-gray-200">
                <p className="text-gray-500 flex items-center gap-2">
                  <CalendarDays size={18} />
                  Data
                </p>

                <h2 className="text-xl font-bold text-[#102A67]">
                  {new Date(resumo.data).toLocaleDateString("pt-BR")}
                </h2>
              </div>

              <div className="bg-[#F5F7FA] rounded-2xl p-5 border border-gray-200">
                <p className="text-gray-500 flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Vendas
                </p>

                <h2 className="text-xl font-bold text-[#102A67]">
                  {resumo.quantidade_vendas}
                </h2>
              </div>

              <div className="bg-[#F5F7FA] rounded-2xl p-5 border border-gray-200">
                <p className="text-gray-500 flex items-center gap-2">
                  <DollarSign size={18} />
                  Total vendido
                </p>

                <h2 className="text-xl font-bold text-[#102A67]">
                  {formatarMoeda(resumo.total_vendas)}
                </h2>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#102A67] mb-4">
              Formas de pagamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-gray-500">PIX</p>
                <strong className="text-[#102A67]">
                  {formatarMoeda(resumo.total_pix)}
                </strong>
              </div>

              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-gray-500 flex items-center gap-2">
                  <Banknote size={16} />
                  Dinheiro
                </p>

                <strong className="text-[#102A67]">
                  {formatarMoeda(resumo.total_dinheiro)}
                </strong>
              </div>

              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-gray-500 flex items-center gap-2">
                  <CreditCard size={16} />
                  Débito
                </p>

                <strong className="text-[#102A67]">
                  {formatarMoeda(resumo.total_debito)}
                </strong>
              </div>

              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-gray-500 flex items-center gap-2">
                  <CreditCard size={16} />
                  Crédito
                </p>

                <strong className="text-[#102A67]">
                  {formatarMoeda(resumo.total_credito)}
                </strong>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#102A67] mb-4">
              Conferência do dinheiro
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between border border-gray-200 rounded-xl p-4">
                <span>Dinheiro vendido</span>
                <strong>{formatarMoeda(resumo.total_dinheiro)}</strong>
              </div>

              <div className="flex justify-between border border-green-200 bg-green-50 rounded-xl p-4 text-green-700">
                <span className="flex items-center gap-2">
                  <PlusCircle size={18} />
                  Suprimentos
                </span>

                <strong>+ {formatarMoeda(totalSuprimentos)}</strong>
              </div>

              <div className="flex justify-between border border-red-200 bg-red-50 rounded-xl p-4 text-red-700">
                <span className="flex items-center gap-2">
                  <MinusCircle size={18} />
                  Sangrias
                </span>

                <strong>- {formatarMoeda(totalSangrias)}</strong>
              </div>

              <div className="flex justify-between bg-[#102A67] text-white rounded-xl p-5">
                <span className="flex items-center gap-2">
                  <Wallet size={20} />
                  Dinheiro esperado
                </span>

                <strong>{formatarMoeda(dinheiroEsperado)}</strong>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <ClipboardList size={22} />
              Movimentações do caixa
            </h2>

            {movimentacoes.length === 0 ? (
              <p className="text-gray-500">
                Nenhuma sangria ou suprimento registrado.
              </p>
            ) : (
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#102A67] text-white">
                    <tr>
                      <th className="p-3">Data</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Observação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {movimentacoes.map((mov) => (
                      <tr key={mov.id} className="border-t">
                        <td className="p-3">
                          {formatarData(mov.data_movimentacao)}
                        </td>

                        <td className="p-3">
                          {mov.tipo}
                        </td>

                        <td className="p-3">
                          {formatarMoeda(mov.valor)}
                        </td>

                        <td className="p-3">
                          {mov.observacao || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-gray-500">
            Relatório gerado pelo HF ERP.
          </div>
        </div>
      </div>
    </main>
  )
}