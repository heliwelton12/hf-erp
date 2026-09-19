"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Wrench,
  Plus,
  Pencil,
  Search,
  UserRound,
  Laptop,
  CalendarDays,
  DollarSign,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"

type OrdemServico = {
  id: number
  numero_os: string
  cliente_id: number
  cliente_nome: string
  equipamento: string
  servico_solicitado: string
  status: string
  valor?: number
  prazo_entrega?: string
}

const statusOpcoes = [
  "Recebido",
  "Em análise",
  "Em andamento",
  "Aguardando cliente",
  "Aguardando peça",
  "Concluído",
  "Entregue",
  "Cancelado",
]

function formatarMoeda(valor?: number) {
  return (valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarData(data?: string) {
  if (!data) return "-"

  const partes = data.split("-")

  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  return data
}

function corStatus(status: string) {
  if (status === "Concluído" || status === "Entregue") {
    return "bg-green-100 text-green-700"
  }

  if (status === "Cancelado") {
    return "bg-red-100 text-red-700"
  }

  if (status === "Aguardando cliente" || status === "Aguardando peça") {
    return "bg-yellow-100 text-yellow-700"
  }

  if (status === "Em análise" || status === "Em andamento") {
    return "bg-blue-100 text-blue-700"
  }

  return "bg-gray-100 text-gray-700"
}

export default function OrdensServicoPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("Todos")
  const [carregando, setCarregando] = useState(true)

  async function buscarOrdens() {
    const resposta = await fetch("http://127.0.0.1:8000/os/")
    const dados = await resposta.json()

    setOrdens(dados)
    setCarregando(false)
  }

  async function atualizarStatus(numeroOs: string, novoStatus: string) {
    await fetch(`http://127.0.0.1:8000/os/${numeroOs}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: novoStatus,
      }),
    })

    buscarOrdens()
  }

  useEffect(() => {
    buscarOrdens()
  }, [])

  const ordensFiltradas = useMemo(() => {
    return ordens.filter((ordem) => {
      const textoBusca = busca.toLowerCase()

      const combinaBusca =
        ordem.numero_os.toLowerCase().includes(textoBusca) ||
        ordem.cliente_nome.toLowerCase().includes(textoBusca) ||
        ordem.equipamento.toLowerCase().includes(textoBusca) ||
        ordem.servico_solicitado.toLowerCase().includes(textoBusca)

      const combinaStatus =
        statusFiltro === "Todos" || ordem.status === statusFiltro

      return combinaBusca && combinaStatus
    })
  }, [ordens, busca, statusFiltro])

  const osAbertas = ordens.filter(
    (ordem) =>
      ordem.status !== "Concluído" &&
      ordem.status !== "Entregue" &&
      ordem.status !== "Cancelado"
  ).length

  const osConcluidas = ordens.filter(
    (ordem) => ordem.status === "Concluído" || ordem.status === "Entregue"
  ).length

  const osAguardando = ordens.filter(
    (ordem) =>
      ordem.status === "Aguardando cliente" ||
      ordem.status === "Aguardando peça"
  ).length

  const valorTotal = ordens.reduce(
    (total, ordem) => total + (ordem.valor || 0),
    0
  )

  function limparFiltros() {
    setBusca("")
    setStatusFiltro("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Wrench size={32} />
              Ordens de Serviço
            </h1>

            <p className="text-gray-600">
              Acompanhe serviços, clientes, status, prazos e valores.
            </p>
          </div>

          <Link
            href="/os/novo"
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
          >
            <Plus size={20} />
            Nova OS
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <ClipboardList size={18} />
              Total de OS
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {ordens.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Clock size={18} />
              OS abertas
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {osAbertas}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <AlertCircle size={18} />
              Aguardando
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {osAguardando}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-green-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CheckCircle size={18} />
              Concluídas
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {osConcluidas}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Search size={18} />
                Buscar OS
              </label>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="OS, cliente, equipamento ou serviço..."
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <ClipboardList size={18} />
                Filtrar por status
              </label>

              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                <option value="Todos">Todos</option>

                {statusOpcoes.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
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
            Mostrando {ordensFiltradas.length} de {ordens.length} ordem(ns).
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <ClipboardList size={22} />
              Lista de ordens de serviço
            </h2>

            <p className="text-gray-500 mt-1">
              Valor total em OS cadastradas: {formatarMoeda(valorTotal)}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">OS</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Equipamento</th>
                  <th className="p-4">Serviço</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Prazo</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={8}>
                      Carregando ordens de serviço...
                    </td>
                  </tr>
                ) : ordensFiltradas.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={8}>
                      Nenhuma ordem de serviço encontrada.
                    </td>
                  </tr>
                ) : (
                  ordensFiltradas.map((ordem) => (
                    <tr key={ordem.id} className="border-t hover:bg-blue-50 transition">
                      <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                        {ordem.numero_os}
                      </td>

                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <UserRound size={16} />
                          {ordem.cliente_nome}
                        </div>
                      </td>

                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Laptop size={16} />
                          {ordem.equipamento}
                        </div>
                      </td>

                      <td className="p-4 text-gray-700">
                        {ordem.servico_solicitado}
                      </td>

                      <td className="p-4">
                        <select
                          value={ordem.status}
                          onChange={(e) =>
                            atualizarStatus(ordem.numero_os, e.target.value)
                          }
                          className={`border border-gray-300 rounded-lg p-2 font-semibold ${corStatus(
                            ordem.status
                          )}`}
                        >
                          {statusOpcoes.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {formatarData(ordem.prazo_entrega)}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          {formatarMoeda(ordem.valor)}
                        </div>
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/os/editar/${ordem.numero_os}`}
                          className="inline-flex items-center gap-2 bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition"
                        >
                          <Pencil size={16} />
                          Editar
                        </Link>
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