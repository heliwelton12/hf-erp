"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  ClipboardList,
  Plus,
  Pencil,
  Search,
  Tags,
  DollarSign,
  Star,
  FileText,
  ArrowLeft,
  Wrench,
} from "lucide-react"

type Servico = {
  id: number
  nome: string
  categoria: string
  preco: number
  descricao?: string
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [carregando, setCarregando] = useState(true)

  async function buscarServicos() {
    const resposta = await fetch("http://127.0.0.1:8000/servicos/", {
      cache: "no-store",
    })

    const dados = await resposta.json()

    setServicos(dados)
    setCarregando(false)
  }

  useEffect(() => {
    buscarServicos()
  }, [])

  const categorias = useMemo(() => {
    const lista = servicos.map((servico) => servico.categoria)
    return ["Todas", ...Array.from(new Set(lista))]
  }, [servicos])

  const servicosFiltrados = useMemo(() => {
    return servicos.filter((servico) => {
      const textoBusca = busca.toLowerCase()

      const combinaBusca =
        servico.nome.toLowerCase().includes(textoBusca) ||
        servico.categoria.toLowerCase().includes(textoBusca) ||
        (servico.descricao || "").toLowerCase().includes(textoBusca)

      const combinaCategoria =
        categoriaFiltro === "Todas" || servico.categoria === categoriaFiltro

      return combinaBusca && combinaCategoria
    })
  }, [servicos, busca, categoriaFiltro])

  const valorMedio =
    servicos.length > 0
      ? servicos.reduce((total, servico) => total + servico.preco, 0) /
        servicos.length
      : 0

  const servicoMaisCaro =
    servicos.length > 0
      ? servicos.reduce((maior, atual) =>
          atual.preco > maior.preco ? atual : maior
        )
      : null

  function limparFiltros() {
    setBusca("")
    setCategoriaFiltro("Todas")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <ClipboardList size={32} />
              Serviços
            </h1>

            <p className="text-gray-600">
              Gerencie serviços de informática, impressão, sublimação e atendimento.
            </p>
          </div>

          <Link
            href="/servicos/novo"
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
          >
            <Plus size={20} />
            Novo Serviço
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <ClipboardList size={18} />
              Total de serviços
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {servicos.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              Valor médio
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(valorMedio)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Tags size={18} />
              Categorias
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {categorias.length - 1}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#374151] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Star size={18} />
              Maior valor
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {servicoMaisCaro ? formatarMoeda(servicoMaisCaro.preco) : "R$ 0,00"}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Search size={18} />
                Buscar serviço
              </label>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Nome, categoria ou descrição..."
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Tags size={18} />
                Filtrar por categoria
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
            Mostrando {servicosFiltrados.length} de {servicos.length} serviço(s).
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <Wrench size={22} />
              Lista de serviços
            </h2>

            <p className="text-gray-500 mt-1">
              Visualize preços, categorias e descrições dos serviços cadastrados.
            </p>
          </div>

          {carregando ? (
            <div className="p-8 text-center text-gray-500">
              Carregando serviços...
            </div>
          ) : servicosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum serviço encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {servicosFiltrados.map((servico) => (
                <div
                  key={servico.id}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Serviço #{servico.id}
                      </p>

                      <h3 className="text-xl font-bold text-[#102A67] mt-1 flex items-center gap-2">
                        <ClipboardList size={20} />
                        {servico.nome}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-[#102A67] px-3 py-1 rounded-full text-sm font-semibold">
                          <Tags size={14} />
                          {servico.categoria}
                        </span>

                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <DollarSign size={14} />
                          {formatarMoeda(servico.preco)}
                        </span>
                      </div>

                      <p className="text-gray-600 mt-4">
                        {servico.descricao || "Sem descrição cadastrada."}
                      </p>
                    </div>

                    <Link
                      href={`/servicos/editar/${servico.id}`}
                      className="bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
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