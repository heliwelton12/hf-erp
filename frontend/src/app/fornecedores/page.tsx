"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Truck,
  Plus,
  Search,
  Pencil,
  Phone,
  Mail,
  Tags,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"

type Fornecedor = {
  id: number
  nome: string
  nome_fantasia?: string
  cnpj?: string
  telefone?: string
  whatsapp?: string
  email?: string
  endereco?: string
  categoria?: string
  observacoes?: string
  status: string
  data_cadastro: string
  data_atualizacao: string
}

function corStatus(status: string) {
  if (status === "Ativo") return "bg-green-100 text-green-700"

  return "bg-red-100 text-red-700"
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [statusFiltro, setStatusFiltro] = useState("Todos")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(true)

  async function buscarFornecedores() {
    const resposta = await fetch("http://127.0.0.1:8000/fornecedores/", {
      cache: "no-store",
    })

    const dados = await resposta.json()

    setFornecedores(dados)
    setCarregando(false)
  }

  async function alterarStatusFornecedor(id: number) {
    const confirmar = confirm("Deseja alterar o status deste fornecedor?")

    if (!confirmar) return

    const resposta = await fetch(
      `http://127.0.0.1:8000/fornecedores/${id}/status`,
      {
        method: "PATCH",
      }
    )

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Status alterado.")
    await buscarFornecedores()
  }

  useEffect(() => {
    buscarFornecedores()
  }, [])

  const categorias = useMemo(() => {
    const lista = fornecedores
      .map((fornecedor) => fornecedor.categoria || "Sem categoria")
      .filter(Boolean)

    return ["Todas", ...Array.from(new Set(lista))]
  }, [fornecedores])

  const fornecedoresFiltrados = useMemo(() => {
    return fornecedores.filter((fornecedor) => {
      const textoBusca = busca.toLowerCase()

      const combinaBusca =
        fornecedor.nome.toLowerCase().includes(textoBusca) ||
        (fornecedor.nome_fantasia || "").toLowerCase().includes(textoBusca) ||
        (fornecedor.cnpj || "").toLowerCase().includes(textoBusca) ||
        (fornecedor.telefone || "").toLowerCase().includes(textoBusca) ||
        (fornecedor.whatsapp || "").toLowerCase().includes(textoBusca) ||
        (fornecedor.email || "").toLowerCase().includes(textoBusca)

      const categoriaFornecedor = fornecedor.categoria || "Sem categoria"

      const combinaCategoria =
        categoriaFiltro === "Todas" || categoriaFornecedor === categoriaFiltro

      const combinaStatus =
        statusFiltro === "Todos" || fornecedor.status === statusFiltro

      return combinaBusca && combinaCategoria && combinaStatus
    })
  }, [fornecedores, busca, categoriaFiltro, statusFiltro])

  const fornecedoresAtivos = fornecedores.filter(
    (fornecedor) => fornecedor.status === "Ativo"
  ).length

  const fornecedoresInativos = fornecedores.filter(
    (fornecedor) => fornecedor.status === "Inativo"
  ).length

  function limparFiltros() {
    setBusca("")
    setCategoriaFiltro("Todas")
    setStatusFiltro("Todos")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Truck size={32} />
              Fornecedores
            </h1>

            <p className="text-gray-600">
              Cadastre e acompanhe fornecedores de produtos, serviços e materiais.
            </p>
          </div>

          <Link
            href="/fornecedores/novo"
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
          >
            <Plus size={20} />
            Novo Fornecedor
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Truck size={18} />
              Total de fornecedores
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {fornecedores.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-green-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CheckCircle size={18} />
              Ativos
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {fornecedoresAtivos}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-red-500 p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <XCircle size={18} />
              Inativos
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {fornecedoresInativos}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Search size={18} />
                Buscar fornecedor
              </label>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Nome, CNPJ, telefone ou e-mail..."
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Tags size={18} />
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
                <option>Ativo</option>
                <option>Inativo</option>
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
            Mostrando {fornecedoresFiltrados.length} de {fornecedores.length} fornecedor(es).
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
              Lista de fornecedores
            </h2>

            <p className="text-gray-500 mt-1">
              Visualize dados de contato, categoria e situação dos fornecedores.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Fornecedor</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={6}>
                      Carregando fornecedores...
                    </td>
                  </tr>
                ) : fornecedoresFiltrados.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={6}>
                      Nenhum fornecedor encontrado.
                    </td>
                  </tr>
                ) : (
                  fornecedoresFiltrados.map((fornecedor) => (
                    <tr
                      key={fornecedor.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-[#102A67]">
                          {fornecedor.nome}
                        </div>

                        <div className="text-sm text-gray-500">
                          {fornecedor.nome_fantasia || "Sem nome fantasia"}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          CNPJ: {fornecedor.cnpj || "-"}
                        </div>
                      </td>

                      <td className="p-4 text-gray-700">
                        {fornecedor.categoria || "Sem categoria"}
                      </td>

                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          {fornecedor.whatsapp || fornecedor.telefone || "-"}
                        </div>
                      </td>

                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          {fornecedor.email || "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => alterarStatusFornecedor(fornecedor.id)}
                          className={`px-3 py-1 rounded-full text-sm font-bold ${corStatus(
                            fornecedor.status
                          )}`}
                        >
                          {fornecedor.status}
                        </button>
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/fornecedores/editar/${fornecedor.id}`}
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