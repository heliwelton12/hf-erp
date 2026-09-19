"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Package,
  Search,
  Tags,
  Plus,
  Pencil,
  AlertTriangle,
  CheckCircle,
  Boxes,
  Barcode,
  DollarSign,
  ShoppingBag,
  ClipboardList,
} from "lucide-react"

type Produto = {
  id: number
  nome: string
  categoria: string
  codigo_barras?: string | null
  preco_compra: number
  preco_venda: number
  quantidade_estoque: number
  estoque_minimo: number
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [carregando, setCarregando] = useState(true)

  async function buscarProdutos() {
    const resposta = await fetch("http://127.0.0.1:8000/produtos/", {
      cache: "no-store",
    })

    const dados = await resposta.json()

    setProdutos(dados)
    setCarregando(false)
  }

  useEffect(() => {
    buscarProdutos()
  }, [])

  const categorias = useMemo(() => {
    const lista = produtos.map((produto) => produto.categoria)
    return ["Todas", ...Array.from(new Set(lista))]
  }, [produtos])

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const textoBusca = busca.toLowerCase()

      const combinaBusca =
        produto.nome.toLowerCase().includes(textoBusca) ||
        produto.categoria.toLowerCase().includes(textoBusca) ||
        (produto.codigo_barras || "").toLowerCase().includes(textoBusca)

      const combinaCategoria =
        categoriaFiltro === "Todas" || produto.categoria === categoriaFiltro

      return combinaBusca && combinaCategoria
    })
  }, [produtos, busca, categoriaFiltro])

  const produtosEstoqueBaixo = produtos.filter(
    (produto) => produto.quantidade_estoque <= produto.estoque_minimo
  ).length

  const valorEmEstoque = produtos.reduce(
    (total, produto) => total + produto.preco_compra * produto.quantidade_estoque,
    0
  )

  function limparFiltros() {
    setBusca("")
    setCategoriaFiltro("Todas")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Package size={32} />
              Produtos
            </h1>

            <p className="text-gray-600">
              Gerencie produtos, preços, estoque e códigos de barras.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/estoque"
              className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
            >
              <Boxes size={20} />
              Movimentar Estoque
            </Link>

            <Link
              href="/inventarios"
              className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
            >
              <ClipboardList size={20} />
              Inventários
            </Link>

            <Link
              href="/categorias"
              className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
            >
              <Tags size={20} />
              Categorias
            </Link>

            <Link
              href="/produtos/novo"
              className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
            >
              <Plus size={20} />
              Novo Produto
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Package size={18} />
              Total de produtos
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {produtos.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <AlertTriangle size={18} />
              Estoque baixo
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {produtosEstoqueBaixo}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              Valor em estoque
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(valorEmEstoque)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#374151] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Tags size={18} />
              Categorias
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {categorias.length - 1}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Search size={18} />
                Buscar produto
              </label>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Nome, categoria ou código de barras..."
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
            Mostrando {produtosFiltrados.length} de {produtos.length} produto(s).
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <Boxes size={22} />
              Lista de produtos
            </h2>

            <p className="text-gray-500 mt-1">
              Visualize estoque, preços e alertas dos produtos cadastrados.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1150px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Código</th>
                  <th className="p-4">Compra</th>
                  <th className="p-4">Venda</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4">Mínimo</th>
                  <th className="p-4">Alerta</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={9}>
                      Carregando produtos...
                    </td>
                  </tr>
                ) : produtosFiltrados.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-600" colSpan={9}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((produto) => {
                    const estoqueBaixo =
                      produto.quantidade_estoque <= produto.estoque_minimo

                    return (
                      <tr
                        key={produto.id}
                        className="border-t hover:bg-blue-50 transition"
                      >
                        <td className="p-4">
                          <div className="font-semibold text-[#102A67]">
                            {produto.nome}
                          </div>

                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <ShoppingBag size={13} />
                            Produto cadastrado
                          </div>
                        </td>

                        <td className="p-4 text-gray-700">
                          {produto.categoria}
                        </td>

                        <td className="p-4 text-gray-700 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Barcode size={16} />
                            {produto.codigo_barras || "-"}
                          </div>
                        </td>

                        <td className="p-4 text-gray-700 whitespace-nowrap">
                          {formatarMoeda(produto.preco_compra)}
                        </td>

                        <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                          {formatarMoeda(produto.preco_venda)}
                        </td>

                        <td
                          className={`p-4 font-semibold ${
                            estoqueBaixo ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          {produto.quantidade_estoque}
                        </td>

                        <td className="p-4 text-gray-700">
                          {produto.estoque_minimo}
                        </td>

                        <td className="p-4">
                          {estoqueBaixo ? (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                              <AlertTriangle size={14} />
                              Estoque baixo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              <CheckCircle size={14} />
                              OK
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <Link
                            href={`/produtos/editar/${produto.id}`}
                            className="inline-flex items-center gap-2 bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition"
                          >
                            <Pencil size={16} />
                            Editar
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
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