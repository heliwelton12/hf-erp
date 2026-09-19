"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  ArrowLeft,
  ClipboardList,
  Save,
  CheckCircle,
  AlertTriangle,
  Package,
  CalendarDays,
  Lock,
  Search,
  RefreshCcw,
} from "lucide-react"

type InventarioItem = {
  id: number
  inventario_id: number
  produto_id: number
  produto_nome: string
  estoque_sistema: number
  estoque_contado?: number | null
  diferenca: number
}

type Inventario = {
  id: number
  status: string
  observacao?: string
  data_criacao: string
  data_finalizacao?: string | null
  itens: InventarioItem[]
}

function formatarData(data?: string | null) {
  if (!data) return "-"

  return new Date(data).toLocaleString("pt-BR")
}

function corDiferenca(diferenca: number) {
  if (diferenca > 0) return "text-green-700"
  if (diferenca < 0) return "text-red-700"

  return "text-gray-700"
}

export default function InventarioDetalhePage() {
  const params = useParams()
  const inventarioId = params.inventarioId as string

  const [inventario, setInventario] = useState<Inventario | null>(null)
  const [contagens, setContagens] = useState<Record<number, string>>({})
  const [busca, setBusca] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [salvandoItem, setSalvandoItem] = useState<number | null>(null)
  const [finalizando, setFinalizando] = useState(false)

  async function buscarInventario() {
    const resposta = await fetch(
      `http://127.0.0.1:8000/inventarios/${inventarioId}`
    )

    const dados = await resposta.json()

    if (dados.mensagem) {
      setMensagem(dados.mensagem)
      setInventario(null)
      return
    }

    setInventario(dados)

    const novasContagens: Record<number, string> = {}

    dados.itens.forEach((item: InventarioItem) => {
      novasContagens[item.id] =
        item.estoque_contado !== null && item.estoque_contado !== undefined
          ? String(item.estoque_contado)
          : ""
    })

    setContagens(novasContagens)
  }

  useEffect(() => {
    if (inventarioId) {
      buscarInventario()
    }
  }, [inventarioId])

  const itensFiltrados = useMemo(() => {
    if (!inventario) return []

    const textoBusca = busca.toLowerCase()

    return inventario.itens.filter((item) =>
      item.produto_nome.toLowerCase().includes(textoBusca)
    )
  }, [inventario, busca])

  async function salvarContagem(item: InventarioItem) {
    const valor = contagens[item.id]

    if (valor === "" || Number(valor) < 0) {
      setMensagem("Informe uma contagem válida.")
      return
    }

    setSalvandoItem(item.id)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/inventarios/${inventarioId}/itens/${item.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estoque_contado: Number(valor),
        }),
      }
    )

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Contagem salva.")
    await buscarInventario()

    setSalvandoItem(null)
  }

  async function finalizarInventario() {
    const confirmar = confirm(
      "Deseja finalizar este inventário? O sistema atualizará o estoque dos produtos conforme a contagem informada."
    )

    if (!confirmar) return

    setFinalizando(true)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/inventarios/${inventarioId}/finalizar`,
      {
        method: "POST",
      }
    )

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Inventário finalizado.")
    await buscarInventario()

    setFinalizando(false)
  }

  if (mensagem && !inventario) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <MenuLateral />

        <div className="max-w-5xl mx-auto pl-24">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-[#102A67]">
              Inventário não encontrado
            </h1>

            <p className="text-gray-600 mt-2">
              {mensagem}
            </p>

            <Link
              href="/inventarios"
              className="inline-block mt-6 bg-[#102A67] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition"
            >
              Voltar para Inventários
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!inventario) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <MenuLateral />

        <div className="max-w-5xl mx-auto pl-24">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-gray-600">
            Carregando inventário...
          </div>
        </div>
      </main>
    )
  }

  const inventarioFinalizado = inventario.status === "Finalizado"

  const totalItens = inventario.itens.length

  const itensContados = inventario.itens.filter(
    (item) => item.estoque_contado !== null && item.estoque_contado !== undefined
  ).length

  const itensComDiferenca = inventario.itens.filter(
    (item) => item.diferenca !== 0
  ).length

  const progresso =
    totalItens > 0 ? Math.round((itensContados / totalItens) * 100) : 0

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <ClipboardList size={32} />
              Inventário #{inventario.id}
            </h1>

            <p className="text-gray-600">
              Confira a contagem física dos produtos e finalize para ajustar o estoque.
            </p>
          </div>

          <Link
            href="/inventarios"
            className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Package size={18} />
              Produtos
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {totalItens}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CheckCircle size={18} />
              Contados
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {itensContados}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-red-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <AlertTriangle size={18} />
              Com diferença
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {itensComDiferenca}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-green-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CalendarDays size={18} />
              Status
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {inventario.status}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold text-[#102A67] mb-2">
                Progresso da contagem
              </h2>

              <p className="text-gray-600">
                Criado em {formatarData(inventario.data_criacao)}
              </p>

              {inventario.data_finalizacao && (
                <p className="text-gray-600">
                  Finalizado em {formatarData(inventario.data_finalizacao)}
                </p>
              )}

              {inventario.observacao && (
                <p className="text-gray-600 mt-2">
                  <strong>Observação:</strong> {inventario.observacao}
                </p>
              )}
            </div>

            <div className="w-full lg:w-96">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{itensContados} de {totalItens} itens</span>
                <span>{progresso}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-[#102A67] h-4 rounded-full transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 pl-10 text-gray-800"
                placeholder="Buscar produto no inventário..."
              />
            </div>

            <button
              type="button"
              onClick={buscarInventario}
              className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Atualizar
            </button>

            <button
              type="button"
              onClick={finalizarInventario}
              disabled={finalizando || inventarioFinalizado}
              className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {inventarioFinalizado
                ? "Inventário finalizado"
                : finalizando
                  ? "Finalizando..."
                  : "Finalizar Inventário"}
            </button>
          </div>

          {mensagem && (
            <div className="mt-5 bg-[#F5F7FA] border border-gray-200 text-gray-800 rounded-xl p-4 font-semibold">
              {mensagem}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67]">
              Produtos do inventário
            </h2>

            <p className="text-gray-500 mt-1">
              Informe a quantidade real encontrada fisicamente.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Sistema</th>
                  <th className="p-4">Contado</th>
                  <th className="p-4">Diferença</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {itensFiltrados.map((item) => {
                  const valorDigitado = contagens[item.id] || ""
                  const diferencaVisual =
                    valorDigitado === ""
                      ? item.diferenca
                      : Number(valorDigitado) - item.estoque_sistema

                  return (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4 font-semibold text-[#102A67]">
                        {item.produto_nome}
                      </td>

                      <td className="p-4 text-gray-700">
                        {item.estoque_sistema}
                      </td>

                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          value={valorDigitado}
                          onChange={(e) =>
                            setContagens({
                              ...contagens,
                              [item.id]: e.target.value,
                            })
                          }
                          disabled={inventarioFinalizado}
                          className="w-32 border border-gray-300 rounded-xl p-3 text-gray-800"
                          placeholder="0"
                        />
                      </td>

                      <td className={`p-4 font-bold ${corDiferenca(diferencaVisual)}`}>
                        {diferencaVisual > 0 ? `+${diferencaVisual}` : diferencaVisual}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => salvarContagem(item)}
                          disabled={salvandoItem === item.id || inventarioFinalizado}
                          className="bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center gap-2"
                        >
                          <Save size={16} />
                          {salvandoItem === item.id ? "Salvando..." : "Salvar"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {itensFiltrados.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum produto encontrado no inventário.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}