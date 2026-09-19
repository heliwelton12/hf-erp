"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  ShoppingCart,
  Barcode,
  Search,
  Package,
  Wrench,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  DollarSign,
  Receipt,
  Keyboard,
  ArrowLeft,
} from "lucide-react"

type Produto = {
  id: number
  nome: string
  categoria: string
  codigo_barras?: string | null
  preco_venda: number
  quantidade_estoque: number
}

type Servico = {
  id: number
  nome: string
  categoria: string
  preco: number
}

type ItemCarrinho = {
  tipo: "produto" | "servico"
  item_id: number
  nome: string
  preco: number
  quantidade: number
}

const taxasCredito: Record<number, number> = {
  1: 5.99,
  2: 11.39,
  3: 12.49,
  4: 13.09,
  5: 13.79,
  6: 14.49,
  7: 15.49,
  8: 16.09,
  9: 16.69,
  10: 17.39,
  11: 18.39,
  12: 18.79,
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function CaixaPage() {
  const router = useRouter()
  const inputCodigoRef = useRef<HTMLInputElement>(null)
  const botaoFinalizarRef = useRef<HTMLButtonElement>(null)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [tipoItem, setTipoItem] = useState<"produto" | "servico">("produto")
  const [itemId, setItemId] = useState("")
  const [quantidade, setQuantidade] = useState("1")
  const [codigoBarras, setCodigoBarras] = useState("")
  const [busca, setBusca] = useState("")
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [formaPagamento, setFormaPagamento] = useState("PIX")
  const [parcelas, setParcelas] = useState("1")
  const [valorRecebido, setValorRecebido] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

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

  const totalOriginal = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  )

  const quantidadeItens = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  )

  const numeroParcelas = Number(parcelas)

  const taxaMaquininha =
    formaPagamento === "Cartão de Crédito"
      ? taxasCredito[numeroParcelas] || 0
      : 0

  const taxaRepassadaCliente =
    formaPagamento === "Cartão de Crédito" && numeroParcelas > 3
      ? taxaMaquininha
      : 0

  const totalCliente =
    taxaRepassadaCliente > 0
      ? totalOriginal / (1 - taxaRepassadaCliente / 100)
      : totalOriginal

  const valorTaxa = totalCliente - totalOriginal

  const valorParcela =
    numeroParcelas > 0 ? totalCliente / numeroParcelas : totalCliente

  const valorRecebidoLoja =
    formaPagamento === "Cartão de Crédito" && taxaRepassadaCliente > 0
      ? totalOriginal
      : totalCliente - (totalCliente * taxaMaquininha / 100)

  const troco =
    formaPagamento === "Dinheiro" && valorRecebido
      ? Number(valorRecebido) - totalOriginal
      : 0

  async function buscarDados() {
    const respostaProdutos = await fetch("http://127.0.0.1:8000/produtos/")
    const dadosProdutos = await respostaProdutos.json()
    setProdutos(dadosProdutos)

    const respostaServicos = await fetch("http://127.0.0.1:8000/servicos/")
    const dadosServicos = await respostaServicos.json()
    setServicos(dadosServicos)
  }

  function quantidadeProdutoNoCarrinho(produtoId: number) {
    return carrinho
      .filter((item) => item.tipo === "produto" && item.item_id === produtoId)
      .reduce((soma, item) => soma + item.quantidade, 0)
  }

  function adicionarProdutoAoCarrinho(produto: Produto, qtd: number) {
    const quantidadeJaNoCarrinho = quantidadeProdutoNoCarrinho(produto.id)

    if (quantidadeJaNoCarrinho + qtd > produto.quantidade_estoque) {
      setMensagem("Quantidade maior que o estoque disponível.")
      return
    }

    const produtoJaExiste = carrinho.find(
      (item) => item.tipo === "produto" && item.item_id === produto.id
    )

    if (produtoJaExiste) {
      setCarrinho(
        carrinho.map((item) =>
          item.tipo === "produto" && item.item_id === produto.id
            ? { ...item, quantidade: item.quantidade + qtd }
            : item
        )
      )
    } else {
      setCarrinho([
        ...carrinho,
        {
          tipo: "produto",
          item_id: produto.id,
          nome: produto.nome,
          preco: produto.preco_venda,
          quantidade: qtd,
        },
      ])
    }

    setMensagem(`${produto.nome} adicionado ao carrinho.`)
  }

  async function buscarPorCodigoBarras(event: React.FormEvent) {
    event.preventDefault()
    setMensagem("")

    const codigo = codigoBarras.trim()

    if (!codigo) {
      setMensagem("Informe ou bipe um código de barras.")
      inputCodigoRef.current?.focus()
      return
    }

    const resposta = await fetch(
      `http://127.0.0.1:8000/produtos/codigo-barras/${codigo}`
    )

    const produto = await resposta.json()

    if (produto.mensagem) {
      setMensagem("Produto não encontrado para este código de barras.")
      setCodigoBarras("")
      inputCodigoRef.current?.focus()
      return
    }

    adicionarProdutoAoCarrinho(produto, 1)
    setCodigoBarras("")
    inputCodigoRef.current?.focus()
  }

  function limparBusca() {
    setBusca("")
    setCodigoBarras("")
    setItemId("")
    inputCodigoRef.current?.focus()
  }

  function adicionarAoCarrinho() {
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
      adicionarProdutoAoCarrinho(produto, qtd)
    }

    if (tipoItem === "servico") {
      const servico = itemSelecionado as Servico

      const servicoJaExiste = carrinho.find(
        (item) => item.tipo === "servico" && item.item_id === servico.id
      )

      if (servicoJaExiste) {
        setCarrinho(
          carrinho.map((item) =>
            item.tipo === "servico" && item.item_id === servico.id
              ? { ...item, quantidade: item.quantidade + qtd }
              : item
          )
        )
      } else {
        setCarrinho([
          ...carrinho,
          {
            tipo: "servico",
            item_id: servico.id,
            nome: servico.nome,
            preco: servico.preco,
            quantidade: qtd,
          },
        ])
      }

      setMensagem(`${servico.nome} adicionado ao carrinho.`)
    }

    setItemId("")
    setQuantidade("1")
    inputCodigoRef.current?.focus()
  }

  function removerItem(index: number) {
    setCarrinho(carrinho.filter((_, i) => i !== index))
  }

  async function finalizarVenda(event: React.FormEvent) {
    event.preventDefault()
    setMensagem("")

    if (carrinho.length === 0) {
      setMensagem("Adicione pelo menos um item ao carrinho.")
      return
    }

    if (formaPagamento === "Dinheiro" && Number(valorRecebido) < totalOriginal) {
      setMensagem("Valor recebido é menor que o total da venda.")
      return
    }

    setCarregando(true)

    const resposta = await fetch("http://127.0.0.1:8000/vendas/carrinho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itens: carrinho.map((item) => ({
          tipo: item.tipo,
          item_id: item.item_id,
          quantidade: item.quantidade,
        })),
        forma_pagamento: formaPagamento,
        parcelas: numeroParcelas,
        taxa_percentual: taxaRepassadaCliente,
      }),
    })

    const dados = await resposta.json()

    if (dados.mensagem === "Venda do carrinho registrada com sucesso") {
      setCarrinho([])
      setFormaPagamento("PIX")
      setParcelas("1")
      setValorRecebido("")
      await buscarDados()

      router.push(`/comprovante/${dados.venda_id}`)
      return
    }

    setMensagem(dados.mensagem || "Erro ao registrar venda.")
    setCarregando(false)
  }

  useEffect(() => {
    buscarDados()
  }, [])

  useEffect(() => {
    function atalhos(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        limparBusca()
      }

      if (event.key === "F2") {
        event.preventDefault()
        botaoFinalizarRef.current?.click()
      }
    }

    window.addEventListener("keydown", atalhos)

    return () => {
      window.removeEventListener("keydown", atalhos)
    }
  }, [busca, codigoBarras, itemId])

    return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <ShoppingCart size={32} />
              Caixa / PDV
            </h1>

            <p className="text-gray-600">
              Registre produtos e serviços na mesma venda.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-200 px-5 py-3">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Keyboard size={16} />
              Atalhos
            </p>

            <p className="font-semibold text-[#102A67]">
              F2 finalizar • ESC limpar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
                <Barcode size={22} />
                Leitura rápida
              </h2>

              <form onSubmit={buscarPorCodigoBarras} className="space-y-3">
                <input
                  ref={inputCodigoRef}
                  type="text"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Bipe ou digite o código de barras"
                  autoFocus
                />

                <button
                  type="submit"
                  className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition flex items-center justify-center gap-2"
                >
                  <Barcode size={20} />
                  Adicionar por código
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
                <Search size={22} />
                Adicionar item manualmente
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

                <div className="md:col-span-2 flex items-end gap-3">
                  <button
                    type="button"
                    onClick={adicionarAoCarrinho}
                    className="flex-1 bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Adicionar ao carrinho
                  </button>

                  <button
                    type="button"
                    onClick={limparBusca}
                    className="bg-gray-200 text-gray-800 rounded-xl px-5 py-3 font-semibold hover:bg-gray-300 transition"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Mostrando {itensFiltrados.length} item(ns).
              </p>
            </div>

            {mensagem && (
              <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 shadow">
                {mensagem}
              </div>
            )}
          </div>

          <form
            onSubmit={finalizarVenda}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5 h-fit sticky top-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
                <Receipt size={22} />
                Carrinho
              </h2>

              <span className="bg-[#F5F7FA] text-[#102A67] px-3 py-1 rounded-full text-sm font-bold">
                {quantidadeItens} item(ns)
              </span>
            </div>

            {carrinho.length === 0 ? (
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                Nenhum item adicionado.
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {carrinho.map((item, index) => (
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
                          {item.quantidade} x {formatarMoeda(item.preco)}
                        </p>

                        <p className="font-bold text-gray-800">
                          {formatarMoeda(item.preco * item.quantidade)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="text-red-600 font-semibold hover:text-red-700"
                        title="Remover item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-200 pt-5 space-y-4">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <CreditCard size={18} />
                Forma de pagamento
              </label>

              <select
                value={formaPagamento}
                onChange={(e) => {
                  setFormaPagamento(e.target.value)
                  setParcelas("1")
                  setValorRecebido("")
                }}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                <option>PIX</option>
                <option>Dinheiro</option>
                <option>Cartão de Débito</option>
                <option>Cartão de Crédito</option>
              </select>

              {formaPagamento === "Cartão de Crédito" && (
                <select
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((p) => (
                    <option key={p} value={p}>
                      {p}x {p <= 3 ? "sem juros para o cliente" : "com taxa repassada"}
                    </option>
                  ))}
                </select>
              )}

              {formaPagamento === "Dinheiro" && (
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Banknote size={18} />
                    Valor recebido
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={valorRecebido}
                    onChange={(e) => setValorRecebido(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                    placeholder="Valor recebido"
                  />
                </div>
              )}
            </div>

            <div className="bg-[#102A67] text-white rounded-2xl p-5 space-y-3">
              <div>
                <p className="text-sm text-blue-100">
                  Total da venda
                </p>

                <p className="text-4xl font-bold">
                  {formatarMoeda(totalOriginal)}
                </p>
              </div>

              {formaPagamento === "Cartão de Crédito" && (
                <div className="border-t border-blue-900 pt-3 space-y-1 text-sm">
                  <p>Taxa da maquininha: {taxaMaquininha}%</p>
                  <p>Taxa repassada ao cliente: {taxaRepassadaCliente}%</p>
                  <p>Cliente paga: {formatarMoeda(totalCliente)}</p>
                  <p>{parcelas}x de {formatarMoeda(valorParcela)}</p>
                  <p>Você recebe: {formatarMoeda(valorRecebidoLoja)}</p>
                  <p>Taxa estimada: {formatarMoeda(valorTaxa)}</p>
                </div>
              )}

              {formaPagamento === "Dinheiro" && valorRecebido && (
                <div className="border-t border-blue-900 pt-3">
                  <p className="text-blue-100">
                    Troco
                  </p>

                  <p className="text-2xl font-bold">
                    {formatarMoeda(troco >= 0 ? troco : 0)}
                  </p>
                </div>
              )}
            </div>

            <button
              ref={botaoFinalizarRef}
              type="submit"
              disabled={carregando}
              className="w-full bg-[#FFD22E] text-[#102A67] rounded-xl p-4 font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <DollarSign size={22} />
              {carregando ? "Finalizando..." : "Finalizar Venda"}
            </button>
          </form>
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