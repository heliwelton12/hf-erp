"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  Wrench,
  Tags,
  DollarSign,
  Calculator,
  Save,
  ArrowLeft,
  Package,
  HandCoins,
  Zap,
  Percent,
  FileText,
} from "lucide-react"

type Categoria = {
  id: number
  nome: string
}

export default function NovoServicoPage() {
  const router = useRouter()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")

  const [custoMateriais, setCustoMateriais] = useState("")
  const [custoMaoObra, setCustoMaoObra] = useState("")
  const [custoIndireto, setCustoIndireto] = useState("")
  const [lucroPercentual, setLucroPercentual] = useState("")

  const [preco, setPreco] = useState("")
  const [descricao, setDescricao] = useState("")
  const [carregando, setCarregando] = useState(false)

  const custoTotal =
    Number(custoMateriais || 0) +
    Number(custoMaoObra || 0) +
    Number(custoIndireto || 0)

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  function calcularPrecoSugerido() {
    const custo = custoTotal
    const lucro = Number(lucroPercentual || 0)

    if (custo <= 0) return

    const precoSugerido = custo + (custo * lucro / 100)
    setPreco(precoSugerido.toFixed(2))
  }

  async function buscarCategorias() {
    const resposta = await fetch("http://127.0.0.1:8000/categorias/")
    const dados = await resposta.json()
    setCategorias(dados)
  }

  useEffect(() => {
    buscarCategorias()
  }, [])

  async function salvarServico(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)

    await fetch("http://127.0.0.1:8000/servicos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        categoria,
        custo_materiais: Number(custoMateriais || 0),
        custo_mao_obra: Number(custoMaoObra || 0),
        custo_indireto: Number(custoIndireto || 0),
        lucro_percentual: Number(lucroPercentual || 0),
        preco: Number(preco),
        descricao,
      }),
    })

    setCarregando(false)
    router.push("/servicos")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-4xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <Wrench size={32} />
            Novo Serviço
          </h1>

          <p className="text-gray-600">
            Cadastre serviços e calcule o preço com base em custos, mão de obra e lucro.
          </p>
        </div>

        <form
          onSubmit={salvarServico}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Wrench size={18} />
              Nome do Serviço
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Caneca Personalizada"
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
                Nenhuma categoria cadastrada. Cadastre uma categoria antes de salvar serviços.
              </p>
            )}
          </div>

          <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5 space-y-5">
            <h2 className="text-xl font-bold text-[#102A67]">
              Cálculo do Serviço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Package size={18} />
                  Custo dos Materiais
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={custoMateriais}
                  onChange={(e) => setCustoMateriais(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 10"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <HandCoins size={18} />
                  Mão de Obra
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={custoMaoObra}
                  onChange={(e) => setCustoMaoObra(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 5"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Zap size={18} />
                  Custo Indireto
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={custoIndireto}
                  onChange={(e) => setCustoIndireto(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Energia, desgaste..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Percent size={18} />
                  Lucro Desejado (%)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={lucroPercentual}
                  onChange={(e) => setLucroPercentual(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 150"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-gray-500">
                  Custo Total
                </p>

                <h3 className="text-2xl font-bold text-[#102A67]">
                  {formatarMoeda(custoTotal)}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={calcularPrecoSugerido}
              className="w-full bg-[#FFD22E] text-[#102A67] rounded-xl p-3 font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Calculator size={20} />
              Calcular Preço Sugerido
            </button>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <DollarSign size={18} />
              Preço Final do Serviço
            </label>

            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: 42.50"
            />

            <p className="text-sm text-gray-500 mt-2">
              Você pode usar o preço sugerido ou ajustar manualmente.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FileText size={18} />
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Descrição do serviço..."
            />
          </div>

          <button
            type="submit"
            disabled={carregando || categorias.length === 0}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar Serviço"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/servicos"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Serviços
          </Link>
        </div>
      </div>
    </main>
  )
}