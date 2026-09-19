"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  FileText,
  UserRound,
  Package,
  Wrench,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  DollarSign,
} from "lucide-react"

type Cliente = {
  id: number
  nome: string
  telefone: string
}

type Produto = {
  id: number
  nome: string
  categoria: string
  preco_venda: number
  quantidade_estoque: number
}

type Servico = {
  id: number
  nome: string
  categoria: string
  preco: number
}

type ItemOrcamento = {
  tipo: "produto" | "servico"
  item_id: number
  nome: string
  quantidade: number
  preco_unitario: number
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function NovoOrcamentoPage() {
  const router = useRouter()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])

  const [clienteId, setClienteId] = useState("")
  const [tipoItem, setTipoItem] = useState<"produto" | "servico">("produto")
  const [itemId, setItemId] = useState("")
  const [busca, setBusca] = useState("")
  const [quantidade, setQuantidade] = useState("1")
  const [observacoes, setObservacoes] = useState("")
  const [itens, setItens] = useState<ItemOrcamento[]>([])
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarDados() {
    const respostaClientes = await fetch("http://127.0.0.1:8000/clientes/")
    const dadosClientes = await respostaClientes.json()
    setClientes(dadosClientes)

    const respostaProdutos = await fetch("http://127.0.0.1:8000/produtos/")
    const dadosProdutos = await respostaProdutos.json()
    setProdutos(dadosProdutos)

    const respostaServicos = await fetch("http://127.0.0.1:8000/servicos/")
    const dadosServicos = await respostaServicos.json()
    setServicos(dadosServicos)
  }

  useEffect(() => {
    buscarDados()
  }, [])

  const listaAtual = tipoItem === "produto" ? produtos : servicos

  const itensFiltrados = useMemo(() => {
    return listaAtual.filter((item) => {
      const textoBusca = busca.toLowerCase()

      return (
        item.nome.toLowerCase().includes(textoBusca) ||
        item.categoria.toLowerCase().includes(textoBusca)
      )
    })
  }, [listaAtual, busca])

  const itemSelecionado =
    tipoItem === "produto"
      ? produtos.find((produto) => produto.id === Number(itemId))
      : servicos.find((servico) => servico.id === Number(itemId))

  const total = itens.reduce(
    (soma, item) => soma + item.preco_unitario * item.quantidade,
    0
  )

  function adicionarItem() {
    setMensagem("")

    if (!itemSelecionado) {
      setMensagem("Selecione um item.")
      return
    }

    const qtd = Number(quantidade)

    if (qtd <= 0) {
      setMensagem("Informe uma quantidade válida.")
      return
    }

    if (tipoItem === "produto") {
      const produto = itemSelecionado as Produto

      setItens([
        ...itens,
        {
          tipo: "produto",
          item_id: produto.id,
          nome: produto.nome,
          quantidade: qtd,
          preco_unitario: produto.preco_venda,
        },
      ])
    }

    if (tipoItem === "servico") {
      const servico = itemSelecionado as Servico

      setItens([
        ...itens,
        {
          tipo: "servico",
          item_id: servico.id,
          nome: servico.nome,
          quantidade: qtd,
          preco_unitario: servico.preco,
        },
      ])
    }

    setItemId("")
    setQuantidade("1")
    setBusca("")
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index))
  }

  async function salvarOrcamento(event: React.FormEvent) {
    event.preventDefault()
    setMensagem("")

    if (!clienteId) {
      setMensagem("Selecione um cliente.")
      return
    }

    if (itens.length === 0) {
      setMensagem("Adicione pelo menos um item ao orçamento.")
      return
    }

    setCarregando(true)

    const resposta = await fetch("http://127.0.0.1:8000/orcamentos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente_id: Number(clienteId),
        observacoes,
        itens,
      }),
    })

    const dados = await resposta.json()

    if (dados.mensagem === "Orçamento criado com sucesso") {
      router.push(`/orcamentos/${dados.numero_orcamento}`)
      return
    }

    setMensagem(dados.mensagem || "Erro ao criar orçamento.")
    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <FileText size={32} />
            Novo Orçamento
          </h1>

          <p className="text-gray-600">
            Monte um orçamento para o cliente antes de virar venda ou OS.
          </p>
        </div>

        <form onSubmit={salvarOrcamento} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
                <UserRound size={22} />
                Cliente
              </h2>

              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                required
              >
                <option value="">Selecione um cliente</option>

                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} — {cliente.telefone}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
                <Plus size={22} />
                Adicionar item
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTipoItem("produto")
                    setItemId("")
                    setBusca("")
                  }}
                  className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                    tipoItem === "produto"
                      ? "bg-[#102A67] text-white border-[#102A67]"
                      : "bg-white text-[#102A67] border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Package size={20} />
                  Produto
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTipoItem("servico")
                    setItemId("")
                    setBusca("")
                  }}
                  className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                    tipoItem === "servico"
                      ? "bg-[#102A67] text-white border-[#102A67]"
                      : "bg-white text-[#102A67] border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Wrench size={20} />
                  Serviço
                </button>
              </div>

              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  setItemId("")
                }}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder={
                  tipoItem === "produto"
                    ? "Buscar produto..."
                    : "Buscar serviço..."
                }
              />

              <select
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                <option value="">Selecione um item</option>

                {tipoItem === "produto" &&
                  itensFiltrados.map((item) => {
                    const produto = item as Produto

                    return (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} — {produto.categoria} — {formatarMoeda(produto.preco_venda)} — Estoque: {produto.quantidade_estoque}
                      </option>
                    )
                  })}

                {tipoItem === "servico" &&
                  itensFiltrados.map((item) => {
                    const servico = item as Servico

                    return (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} — {servico.categoria} — {formatarMoeda(servico.preco)}
                      </option>
                    )
                  })}
              </select>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quantidade
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  />
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={adicionarItem}
                    className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Adicionar ao orçamento
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Mostrando {itensFiltrados.length} item(ns).
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <label className="block text-gray-700 font-medium mb-2">
                Observações
              </label>

              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: Validade do orçamento, prazo de entrega, detalhes do serviço..."
              />
            </div>

            {mensagem && (
              <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 shadow">
                {mensagem}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5 h-fit sticky top-8">
            <h2 className="text-xl font-bold text-[#102A67]">
              Resumo do Orçamento
            </h2>

            {itens.length === 0 ? (
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                Nenhum item adicionado.
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {itens.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#102A67]">
                          {item.nome}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.tipo === "produto" ? "Produto" : "Serviço"}
                        </p>

                        <p className="text-gray-700 mt-2">
                          {item.quantidade} x {formatarMoeda(item.preco_unitario)}
                        </p>

                        <p className="font-bold text-gray-800">
                          {formatarMoeda(item.quantidade * item.preco_unitario)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="text-red-600 font-semibold hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-[#102A67] text-white rounded-2xl p-5">
              <p className="text-blue-100 flex items-center gap-2">
                <DollarSign size={18} />
                Total do orçamento
              </p>

              <p className="text-4xl font-bold mt-1">
                {formatarMoeda(total)}
              </p>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#FFD22E] text-[#102A67] rounded-xl p-4 font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-600"
            >
              <Save size={22} />
              {carregando ? "Salvando..." : "Salvar Orçamento"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <Link
            href="/orcamentos"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Orçamentos
          </Link>
        </div>
      </div>
    </main>
  )
}