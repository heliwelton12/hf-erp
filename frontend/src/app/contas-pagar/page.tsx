"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  WalletCards,
  Plus,
  Search,
  Pencil,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  CalendarDays,
  ArrowLeft,
} from "lucide-react"

type ContaPagar = {
  id: number
  fornecedor_id?: number | null
  fornecedor_nome?: string
  descricao: string
  categoria?: string
  valor: number
  data_vencimento: string
  data_pagamento?: string | null
  forma_pagamento?: string | null
  status: string
  observacoes?: string | null
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarData(data?: string | null) {
  if (!data) return "-"

  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR")
}

function corStatus(status: string) {
  if (status === "Pago") return "bg-green-100 text-green-700"
  if (status === "Vencido") return "bg-red-100 text-red-700"
  if (status === "Cancelado") return "bg-gray-200 text-gray-700"

  return "bg-yellow-100 text-yellow-700"
}

export default function ContasPagarPage() {
  const [contas, setContas] = useState<ContaPagar[]>([])
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("Todos")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(true)

  async function buscarContas() {
    const resposta = await fetch("http://127.0.0.1:8000/contas-pagar/", {
      cache: "no-store",
    })

    const dados = await resposta.json()

    setContas(dados)
    setCarregando(false)
  }

  async function marcarComoPaga(contaId: number) {
    const confirmar = confirm("Deseja marcar esta conta como paga?")

    if (!confirmar) return

    const hoje = new Date().toISOString().split("T")[0]

    const resposta = await fetch(
      `http://127.0.0.1:8000/contas-pagar/${contaId}/pagar`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_pagamento: hoje,
          forma_pagamento: "PIX",
        }),
      }
    )

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Conta atualizada.")
    await buscarContas()
  }

  async function cancelarConta(contaId: number) {
    const confirmar = confirm("Deseja cancelar esta conta?")

    if (!confirmar) return

    const resposta = await fetch(
      `http://127.0.0.1:8000/contas-pagar/${contaId}/cancelar`,
      {
        method: "PATCH",
      }
    )

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Conta cancelada.")
    await buscarContas()
  }

  useEffect(() => {
    buscarContas()
  }, [])

  const categorias = useMemo(() => {
    const lista = contas
      .map((conta) => conta.categoria || "Sem categoria")
      .filter(Boolean)

    return ["Todas", ...Array.from(new Set(lista))]
  }, [contas])

  const contasFiltradas = useMemo(() => {
    return contas.filter((conta) => {
      const textoBusca = busca.toLowerCase()

      const combinaBusca =
        conta.descricao.toLowerCase().includes(textoBusca) ||
        (conta.fornecedor_nome || "").toLowerCase().includes(textoBusca) ||
        (conta.categoria || "").toLowerCase().includes(textoBusca)

      const categoriaConta = conta.categoria || "Sem categoria"

      const combinaCategoria =
        categoriaFiltro === "Todas" || categoriaConta === categoriaFiltro

      const combinaStatus =
        statusFiltro === "Todos" || conta.status === statusFiltro

      return combinaBusca && combinaCategoria && combinaStatus
    })
  }, [contas, busca, categoriaFiltro, statusFiltro])

  const totalEmAberto = contas
    .filter((conta) => conta.status === "Em aberto" || conta.status === "Vencido")
    .reduce((total, conta) => total + conta.valor, 0)

  const totalPago = contas
    .filter((conta) => conta.status === "Pago")
    .reduce((total, conta) => total + conta.valor, 0)

  const totalVencido = contas
    .filter((conta) => conta.status === "Vencido")
    .reduce((total, conta) => total + conta.valor, 0)

  const quantidadeEmAberto = contas.filter(
    (conta) => conta.status === "Em aberto" || conta.status === "Vencido"
  ).length

  function limparFiltros() {
    setBusca("")
    setStatusFiltro("Todos")
    setCategoriaFiltro("Todas")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <WalletCards size={32} />
              Contas a Pagar
            </h1>

            <p className="text-gray-600">
              Controle despesas, fornecedores, vencimentos e pagamentos.
            </p>
          </div>

          <Link
            href="/contas-pagar/novo"
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
          >
            <Plus size={20} />
            Nova Conta
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Clock size={18} />
              Em aberto
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {quantidadeEmAberto}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              Total em aberto
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(totalEmAberto)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-red-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <AlertTriangle size={18} />
              Vencido
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(totalVencido)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-green-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CheckCircle size={18} />
              Total pago
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(totalPago)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Search size={18} />
                Buscar conta
              </label>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Descrição, fornecedor ou categoria..."
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium mb-2">
                Categoria
              </label>

              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-700 font-medium mb-2">
                Status
              </label>

              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                <option>Todos</option>
                <option>Em aberto</option>
                <option>Vencido</option>
                <option>Pago</option>
                <option>Cancelado</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={limparFiltros}
                className="w-full bg-gray-200 text-gray-800 rounded-xl p-3 font-semibold hover:bg-gray-300 transition"
              >
                Limpar filtros
              </button>
            </div>
          </div>

          <p className="text-gray-500 mt-4">
            Mostrando {contasFiltradas.length} de {contas.length} conta(s).
          </p>

          {mensagem && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-semibold">
              {mensagem}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67]">
              Lista de contas
            </h2>

            <p className="text-gray-500 mt-1">
              Acompanhe vencimentos, valores, status e fornecedores.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1150px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Fornecedor</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={7}>
                      Carregando contas...
                    </td>
                  </tr>
                ) : contasFiltradas.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={7}>
                      Nenhuma conta encontrada.
                    </td>
                  </tr>
                ) : (
                  contasFiltradas.map((conta) => (
                    <tr
                      key={conta.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-[#102A67]">
                          {conta.descricao}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          Pagamento: {conta.forma_pagamento || "-"}
                        </div>
                      </td>

                      <td className="p-4 text-gray-700">
                        {conta.fornecedor_nome || "-"}
                      </td>

                      <td className="p-4 text-gray-700">
                        {conta.categoria || "Sem categoria"}
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {formatarData(conta.data_vencimento)}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                        {formatarMoeda(conta.valor)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${corStatus(
                            conta.status
                          )}`}
                        >
                          {conta.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/contas-pagar/editar/${conta.id}`}
                            className="inline-flex items-center gap-2 bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition"
                          >
                            <Pencil size={16} />
                            Editar
                          </Link>

                          {conta.status !== "Pago" &&
                            conta.status !== "Cancelado" && (
                              <button
                                type="button"
                                onClick={() => marcarComoPaga(conta.id)}
                                className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
                              >
                                <CheckCircle size={16} />
                                Pagar
                              </button>
                            )}

                          {conta.status !== "Cancelado" &&
                            conta.status !== "Pago" && (
                              <button
                                type="button"
                                onClick={() => cancelarConta(conta.id)}
                                className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                              >
                                <XCircle size={16} />
                                Cancelar
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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