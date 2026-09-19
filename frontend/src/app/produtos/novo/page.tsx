"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MenuLateral from "@/components/MenuLateral"
import {
  PackagePlus,
  Tags,
  Barcode,
  DollarSign,
  Percent,
  Calculator,
  Boxes,
  AlertTriangle,
  Save,
  ArrowLeft,
} from "lucide-react"

type Categoria = {
  id: number
  nome: string
}

export default function NovoProdutoPage() {
  const router = useRouter()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [codigoBarras, setCodigoBarras] = useState("")
  const [precoCompra, setPrecoCompra] = useState("")
  const [lucroDesejado, setLucroDesejado] = useState("")
  const [precoVenda, setPrecoVenda] = useState("")
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("")
  const [estoqueMinimo, setEstoqueMinimo] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarCategorias() {
    const resposta = await fetch("http://127.0.0.1:8000/categorias/")
    const dados = await resposta.json()
    setCategorias(dados)
  }

  useEffect(() => {
    buscarCategorias()
  }, [])

  function calcularPrecoVenda() {
    const compra = Number(precoCompra)
    const lucro = Number(lucroDesejado)

    if (!compra || !lucro) return

    const venda = compra + (compra * lucro / 100)
    setPrecoVenda(venda.toFixed(2))
  }

  async function salvarProduto(event: React.FormEvent) {
    event.preventDefault()
    setCarregando(true)

    await fetch("http://127.0.0.1:8000/produtos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        categoria,
        codigo_barras: codigoBarras || null,
        preco_compra: Number(precoCompra),
        preco_venda: Number(precoVenda),
        quantidade_estoque: Number(quantidadeEstoque),
        estoque_minimo: Number(estoqueMinimo || 0),
      }),
    })

    setCarregando(false)
    router.push("/produtos")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-4xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <PackagePlus size={32} />
            Novo Produto
          </h1>

          <p className="text-gray-600">
            Cadastre produtos, código de barras, estoque e preço de venda.
          </p>
        </div>

        <form
          onSubmit={salvarProduto}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <PackagePlus size={18} />
              Nome do Produto
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Capa iPhone 13"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Tags size={18} />
              Categoria
            </label>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
            >
              <option value="">Selecione uma categoria</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nome}>
                  {categoria.nome}
                </option>
              ))}
            </select>

            {categorias.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Nenhuma categoria cadastrada. Cadastre uma categoria antes de salvar produtos.
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Barcode size={18} />
              Código de Barras
            </label>

            <input
              type="text"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Bipe o código ou digite manualmente"
            />

            <p className="text-sm text-gray-500 mt-2">
              Opcional. Use esse campo para produtos com código de barras.
            </p>
          </div>

          <div className="bg-[#F5F7FA] rounded-2xl border border-gray-200 p-5 space-y-5">
            <h2 className="text-xl font-bold text-[#102A67]">
              Cálculo de Preço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <DollarSign size={18} />
                  Preço de Compra
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={precoCompra}
                  onChange={(e) => setPrecoCompra(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 8"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Percent size={18} />
                  Lucro Desejado (%)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={lucroDesejado}
                  onChange={(e) => setLucroDesejado(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 150"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={calcularPrecoVenda}
              className="w-full bg-[#FFD22E] text-[#102A67] rounded-xl p-3 font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Calculator size={20} />
              Calcular Preço de Venda
            </button>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <DollarSign size={18} />
                Preço de Venda
              </label>

              <input
                type="number"
                step="0.01"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: 20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Boxes size={18} />
                Quantidade em Estoque
              </label>

              <input
                type="number"
                value={quantidadeEstoque}
                onChange={(e) => setQuantidadeEstoque(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: 10"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <AlertTriangle size={18} />
                Estoque Mínimo
              </label>

              <input
                type="number"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Opcional. Ex: 2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando || categorias.length === 0}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar Produto"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/produtos"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Produtos
          </Link>
        </div>
      </div>
    </main>
  )
}