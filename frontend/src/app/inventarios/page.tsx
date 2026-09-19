"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  ClipboardList,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  CalendarDays,
  ArrowLeft,
  PackageCheck,
} from "lucide-react"

type Inventario = {
  id: number
  status: string
  observacao?: string
  data_criacao: string
  data_finalizacao?: string
  total_itens: number
  itens_contados: number
}

function formatarData(data?: string) {
  if (!data) return "-"

  return new Date(data).toLocaleString("pt-BR")
}

function corStatus(status: string) {
  if (status === "Finalizado") {
    return "bg-green-100 text-green-700"
  }

  return "bg-yellow-100 text-yellow-700"
}

export default function InventariosPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([])
  const [observacao, setObservacao] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarInventarios() {
    const resposta = await fetch("http://127.0.0.1:8000/inventarios/", {
      cache: "no-store",
    })

    const dados = await resposta.json()
    setInventarios(dados)
  }

  async function criarInventario(event: React.FormEvent) {
    event.preventDefault()

    const confirmar = confirm(
      "Deseja criar um novo inventário com todos os produtos cadastrados?"
    )

    if (!confirmar) return

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch("http://127.0.0.1:8000/inventarios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        observacao: observacao || null,
      }),
    })

    const dados = await resposta.json()

    if (dados.mensagem === "Inventário criado com sucesso") {
      setObservacao("")
      await buscarInventarios()
      setMensagem("Inventário criado com sucesso!")
    } else {
      setMensagem(dados.mensagem || "Erro ao criar inventário.")
    }

    setCarregando(false)
  }

  useEffect(() => {
    buscarInventarios()
  }, [])

  const inventariosAbertos = inventarios.filter(
    (inventario) => inventario.status === "Aberto"
  ).length

  const inventariosFinalizados = inventarios.filter(
    (inventario) => inventario.status === "Finalizado"
  ).length

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <ClipboardList size={32} />
              Inventário de Estoque
            </h1>

            <p className="text-gray-600">
              Confira o estoque físico e corrija diferenças entre sistema e prateleira.
            </p>
          </div>

          <Link
            href="/estoque"
            className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
          >
            <ArrowLeft size={20} />
            Voltar ao Estoque
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <ClipboardList size={18} />
              Total de inventários
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {inventarios.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Clock size={18} />
              Abertos
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {inventariosAbertos}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-green-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CheckCircle size={18} />
              Finalizados
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {inventariosFinalizados}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <form
            onSubmit={criarInventario}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5"
          >
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <Plus size={22} />
              Novo Inventário
            </h2>

            <p className="text-gray-600">
              Ao criar um inventário, o sistema captura o estoque atual de todos
              os produtos cadastrados para você fazer a contagem real.
            </p>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Observação
              </label>

              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: Inventário mensal, conferência de loja, contagem de fechamento..."
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#102A67] text-white rounded-xl p-3 font-bold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {carregando ? "Criando..." : "Criar Inventário"}
            </button>

            {mensagem && (
              <div className="bg-[#F5F7FA] border border-gray-200 text-gray-800 rounded-xl p-4 font-semibold">
                {mensagem}
              </div>
            )}
          </form>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
                <PackageCheck size={22} />
                Histórico de Inventários
              </h2>

              <p className="text-gray-500 mt-1">
                Acompanhe contagens abertas e inventários finalizados.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-[#102A67] text-white">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Criação</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progresso</th>
                    <th className="p-4">Finalização</th>
                    <th className="p-4">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {inventarios.map((inventario) => (
                    <tr
                      key={inventario.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4 font-bold text-[#102A67]">
                        #{inventario.id}
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {formatarData(inventario.data_criacao)}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${corStatus(
                            inventario.status
                          )}`}
                        >
                          {inventario.status}
                        </span>
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        {inventario.itens_contados} / {inventario.total_itens} item(ns)
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        {formatarData(inventario.data_finalizacao)}
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/inventarios/${inventario.id}`}
                          className="inline-flex items-center gap-2 bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition"
                        >
                          <Eye size={16} />
                          Abrir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {inventarios.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum inventário criado.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}