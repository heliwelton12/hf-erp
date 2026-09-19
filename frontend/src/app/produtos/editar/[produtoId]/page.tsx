"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  Package,
  Tags,
  Barcode,
  DollarSign,
  Boxes,
  AlertTriangle,
  Save,
  ArrowLeft,
  Pencil,
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

type Categoria = {
  id: number
  nome: string
}

export default function EditarProdutoPage() {
  const params = useParams()
  const router = useRouter()

  const produtoId = params.produtoId as string

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [codigoBarras, setCodigoBarras] = useState("")
  const [precoCompra, setPrecoCompra] = useState("")
  const [precoVenda, setPrecoVenda] = useState("")
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("")
  const [estoqueMinimo, setEstoqueMinimo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function buscarDados() {
      const respostaCategorias = await fetch("http://127.0.0.1:8000/categorias/")
      const dadosCategorias = await respostaCategorias.json()
      setCategorias(dadosCategorias)

      const respostaProduto = await fetch(`http://127.0.0.1:8000/produtos/${produtoId}`)
      const produto: Produto = await respostaProduto.json()

      setNome(produto.nome)
      setCategoria(produto.categoria)
      setCodigoBarras(produto.codigo_barras || "")
      setPrecoCompra(String(produto.preco_compra))
      setPrecoVenda(String(produto.preco_venda))
      setQuantidadeEstoque(String(produto.quantidade_estoque))
      setEstoqueMinimo(String(produto.estoque_minimo))
    }

    if (produtoId) {
      buscarDados()
    }
  }, [produtoId])

  async function salvarProduto(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch(`http://127.0.0.1:8000/produtos/${produtoId}`, {
      method: "PUT",
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

    const dados = await resposta.json()

    if (dados.mensagem === "Produto atualizado com sucesso") {
      setMensagem("Produto atualizado com sucesso!")

      setTimeout(() => {
        router.push("/produtos")
      }, 800)
    } else {
      setMensagem(dados.mensagem || "Erro ao atualizar produto.")
    }

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-4xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <Pencil size={32} />
            Editar Produto
          </h1>

          <p className="text-gray-600">
            Atualize informações, preço, estoque e código de barras do produto.
          </p>
        </div>

        <form
          onSubmit={salvarProduto}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Package size={18} />
              Nome do Produto
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
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
                Nenhuma categoria cadastrada.
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
              Preços
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
                />
              </div>

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
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F5F7FA] rounded-2xl border border-gray-200 p-5 space-y-5">
            <h2 className="text-xl font-bold text-[#102A67]">
              Estoque
            </h2>

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
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando || categorias.length === 0}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar Alterações"}
          </button>

          {mensagem && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
              {mensagem}
            </div>
          )}
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