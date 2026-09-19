"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  BarChart3,
  CalendarDays,
  ShoppingCart,
  DollarSign,
  Banknote,
  CreditCard,
  Wallet,
  CheckCircle,
  Lock,
  History,
  ArrowLeft,
  PlusCircle,
  MinusCircle,
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
  fechamento_id?: number
}

type Fechamento = {
  id: number
  total_pix: number
  total_dinheiro: number
  total_debito: number
  total_credito: number
  total_vendas: number
  data_fechamento: string
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

export default function FechamentoCaixaPage() {
  const [resumo, setResumo] = useState<ResumoCaixa | null>(null)
  const [fechamentos, setFechamentos] = useState<Fechamento[]>([])
  const [movimentacoes, setMovimentacoes] = useState<CaixaMovimentacao[]>([])
  const [tipoMovimentacao, setTipoMovimentacao] = useState("Sangria")
  const [valorMovimentacao, setValorMovimentacao] = useState("")
  const [observacaoMovimentacao, setObservacaoMovimentacao] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [registrandoMovimentacao, setRegistrandoMovimentacao] = useState(false)

  async function buscarResumo() {
    const resposta = await fetch("http://127.0.0.1:8000/caixa/resumo-dia")
    const dados = await resposta.json()
    setResumo(dados)
  }

  async function buscarFechamentos() {
    const resposta = await fetch("http://127.0.0.1:8000/caixa/fechamentos")
    const dados = await resposta.json()
    setFechamentos(dados)
  }

  async function buscarMovimentacoes() {
    const resposta = await fetch("http://127.0.0.1:8000/caixa/movimentacoes")
    const dados = await resposta.json()
    setMovimentacoes(dados)
  }

  async function registrarMovimentacao(event: React.FormEvent) {
    event.preventDefault()

    if (!valorMovimentacao || Number(valorMovimentacao) <= 0) {
      setMensagem("Informe um valor válido para a movimentação.")
      return
    }

    setRegistrandoMovimentacao(true)
    setMensagem("")

    const resposta = await fetch("http://127.0.0.1:8000/caixa/movimentacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: tipoMovimentacao,
        valor: Number(valorMovimentacao),
        observacao: observacaoMovimentacao || null,
      }),
    })

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Movimentação registrada.")

    setValorMovimentacao("")
    setObservacaoMovimentacao("")

    await buscarMovimentacoes()

    setRegistrandoMovimentacao(false)
  }

  async function fecharCaixa() {
    const confirmar = confirm("Tem certeza que deseja fechar o caixa de hoje?")

    if (!confirmar) return

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch("http://127.0.0.1:8000/caixa/fechar", {
      method: "POST",
    })

    const dados = await resposta.json()

    if (dados.mensagem) {
      setMensagem(dados.mensagem)
    }

    await buscarResumo()
    await buscarFechamentos()
    await buscarMovimentacoes()

    setCarregando(false)
  }

  useEffect(() => {
    buscarResumo()
    buscarFechamentos()
    buscarMovimentacoes()
  }, [])

  if (!resumo) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <MenuLateral />

        <div className="max-w-7xl mx-auto pl-24">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-gray-600">
            Carregando fechamento...
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
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <BarChart3 size={32} />
              Fechamento de Caixa
            </h1>

            <p className="text-gray-600">
              Resumo das vendas do dia, sangrias, suprimentos e histórico de fechamentos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/relatorio-diario"
              className="bg-[#FFD22E] text-[#102A67] px-5 py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center gap-2"
            >
              <BarChart3 size={20} />
              Relatório Diário
            </Link>

            <span
              className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${
                resumo.caixa_fechado
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {resumo.caixa_fechado ? (
                <>
                  <CheckCircle size={20} />
                  Caixa fechado
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Caixa aberto
                </>
              )}
            </span>
          </div>
        </div>

        {resumo.caixa_fechado && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-8 font-semibold flex items-center gap-2">
            <CheckCircle size={20} />
            O caixa de hoje já foi fechado.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CalendarDays size={18} />
              Data
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {new Date(resumo.data).toLocaleDateString("pt-BR")}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <ShoppingCart size={18} />
              Vendas do dia
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {resumo.quantidade_vendas}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              Total vendido
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_vendas)}
            </h2>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#102A67]">
            Formas de pagamento
          </h2>

          <p className="text-gray-500">
            Valores vendidos hoje por tipo de pagamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              PIX
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_pix)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Banknote size={18} />
              Dinheiro
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_dinheiro)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CreditCard size={18} />
              Débito
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_debito)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CreditCard size={18} />
              Crédito
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(resumo.total_credito)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <Wallet size={22} />
              Conferência do caixa
            </h2>

            <div className="space-y-3 mb-6">
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-4 flex justify-between">
                <span className="text-gray-600">Dinheiro vendido</span>
                <strong className="text-[#102A67]">
                  {formatarMoeda(resumo.total_dinheiro)}
                </strong>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex justify-between">
                <span className="text-green-700">Suprimentos</span>
                <strong className="text-green-700">
                  + {formatarMoeda(totalSuprimentos)}
                </strong>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex justify-between">
                <span className="text-red-700">Sangrias</span>
                <strong className="text-red-700">
                  - {formatarMoeda(totalSangrias)}
                </strong>
              </div>

              <div className="bg-[#102A67] text-white rounded-2xl p-5">
                <p className="text-blue-100">
                  Dinheiro esperado no caixa
                </p>

                <p className="text-4xl font-bold mt-1">
                  {formatarMoeda(dinheiroEsperado)}
                </p>
              </div>
            </div>

            <button
              onClick={fecharCaixa}
              disabled={carregando || resumo.caixa_fechado}
              className={`w-full px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                resumo.caixa_fechado
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#102A67] text-white hover:bg-[#0B1F4F]"
              }`}
            >
              <Lock size={20} />
              {resumo.caixa_fechado
                ? "Caixa já fechado"
                : carregando
                  ? "Fechando..."
                  : "Fechar Caixa"}
            </button>

            {mensagem && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-semibold">
                {mensagem}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <ClipboardList size={22} />
              Sangria / Suprimento
            </h2>

            <form onSubmit={registrarMovimentacao} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoMovimentacao("Sangria")}
                  className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                    tipoMovimentacao === "Sangria"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <MinusCircle size={20} />
                  Sangria
                </button>

                <button
                  type="button"
                  onClick={() => setTipoMovimentacao("Suprimento")}
                  className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                    tipoMovimentacao === "Suprimento"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <PlusCircle size={20} />
                  Suprimento
                </button>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Valor
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={valorMovimentacao}
                  onChange={(e) => setValorMovimentacao(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Observação
                </label>

                <textarea
                  value={observacaoMovimentacao}
                  onChange={(e) => setObservacaoMovimentacao(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: Retirada para depósito, troco inicial..."
                />
              </div>

              <button
                type="submit"
                disabled={registrandoMovimentacao || resumo.caixa_fechado}
                className="w-full bg-[#FFD22E] text-[#102A67] rounded-xl p-3 font-bold hover:opacity-90 transition disabled:bg-gray-300 disabled:text-gray-600"
              >
                {registrandoMovimentacao
                  ? "Registrando..."
                  : "Registrar Movimentação"}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <ClipboardList size={22} />
              Movimentações do Caixa
            </h2>

            <p className="text-gray-500 mt-1">
              Histórico de sangrias e suprimentos registrados.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Data</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Observação</th>
                </tr>
              </thead>

              <tbody>
                {movimentacoes.map((movimentacao) => (
                  <tr
                    key={movimentacao.id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {formatarData(movimentacao.data_movimentacao)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          movimentacao.tipo === "Sangria"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {movimentacao.tipo}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                      {formatarMoeda(movimentacao.valor)}
                    </td>

                    <td className="p-4 text-gray-700">
                      {movimentacao.observacao || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {movimentacoes.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhuma movimentação registrada.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <History size={22} />
              Histórico de Fechamentos
            </h2>

            <p className="text-gray-500 mt-1">
              Consulte os caixas fechados anteriormente.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Data</th>
                  <th className="p-4">PIX</th>
                  <th className="p-4">Dinheiro</th>
                  <th className="p-4">Débito</th>
                  <th className="p-4">Crédito</th>
                  <th className="p-4">Total</th>
                </tr>
              </thead>

              <tbody>
                {fechamentos.map((fechamento) => (
                  <tr
                    key={fechamento.id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {formatarData(fechamento.data_fechamento)}
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {formatarMoeda(fechamento.total_pix)}
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {formatarMoeda(fechamento.total_dinheiro)}
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {formatarMoeda(fechamento.total_debito)}
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {formatarMoeda(fechamento.total_credito)}
                    </td>

                    <td className="p-4 text-[#102A67] font-bold whitespace-nowrap">
                      {formatarMoeda(fechamento.total_vendas)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {fechamentos.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum fechamento registrado.
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  )
}