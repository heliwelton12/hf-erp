"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Boxes,
  Package,
  PlusCircle,
  MinusCircle,
  RefreshCcw,
  ClipboardList,
  ArrowLeft,
  Save,
} from "lucide-react"

type Produto = {
  id: number
  nome: string
  categoria: string
  quantidade_estoque: number
}

type MovimentacaoEstoque = {
  id: number
  produto_id: number
  produto_nome: string
  tipo: string
  quantidade: number
  motivo: string
  observacao?: string
  estoque_antes: number
  estoque_depois: number
  data_movimentacao: string
}

function formatarData(data: string) {
  return new Date(data).toLocaleString("pt-BR")
}

function corTipo(tipo: string) {
  if (tipo === "Entrada") return "bg-green-100 text-green-700"
  if (tipo === "Saida") return "bg-red-100 text-red-700"
  return "bg-blue-100 text-blue-700"
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])

  const [produtoId, setProdutoId] = useState("")
  const [tipo, setTipo] = useState("Entrada")
  const [quantidade, setQuantidade] = useState("")
  const [motivo, setMotivo] = useState("Compra")
  const [observacao, setObservacao] = useState("")

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarDados() {
    const respostaProdutos = await fetch("http://127.0.0.1:8000/produtos/")
    const dadosProdutos = await respostaProdutos.json()
    setProdutos(dadosProdutos)

    const respostaMovimentacoes = await fetch(
      "http://127.0.0.1:8000/estoque/movimentacoes"
    )
    const dadosMovimentacoes = await respostaMovimentacoes.json()
    setMovimentacoes(dadosMovimentacoes)
  }

  useEffect(() => {
    buscarDados()
  }, [])

  async function registrarMovimentacao(event: React.FormEvent) {
    event.preventDefault()
    setMensagem("")

    if (!produtoId) {
      setMensagem("Selecione um produto.")
      return
    }

    if (!quantidade || Number(quantidade) <= 0) {
      setMensagem("Informe uma quantidade válida.")
      return
    }

    setCarregando(true)

    const resposta = await fetch("http://127.0.0.1:8000/estoque/movimentacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produto_id: Number(produtoId),
        tipo,
        quantidade: Number(quantidade),
        motivo,
        observacao: observacao || null,
      }),
    })

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Movimentação registrada.")

    if (dados.mensagem === "Movimentação de estoque registrada com sucesso") {
      setProdutoId("")
      setTipo("Entrada")
      setQuantidade("")
      setMotivo("Compra")
      setObservacao("")
      await buscarDados()
    }

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <Boxes size={32} />
            Movimentação de Estoque
          </h1>

          <p className="text-gray-600">
            Registre entradas, saídas manuais e ajustes de inventário.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <form
            onSubmit={registrarMovimentacao}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5"
          >
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <Save size={22} />
              Nova movimentação
            </h2>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Produto
              </label>

              <select
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                required
              >
                <option value="">Selecione um produto</option>

                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} — Estoque atual: {produto.quantidade_estoque}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTipo("Entrada")
                  setMotivo("Compra")
                }}
                className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                  tipo === "Entrada"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <PlusCircle size={20} />
                Entrada
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo("Saida")
                  setMotivo("Uso interno")
                }}
                className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                  tipo === "Saida"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <MinusCircle size={20} />
                Saída
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo("Ajuste")
                  setMotivo("Ajuste manual")
                }}
                className={`rounded-xl p-4 font-bold transition flex items-center justify-center gap-2 border ${
                  tipo === "Ajuste"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <RefreshCcw size={20} />
                Ajuste
              </button>
            </div>

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
                placeholder={
                  tipo === "Ajuste"
                    ? "Novo estoque final"
                    : "Quantidade movimentada"
                }
                required
              />

              {tipo === "Ajuste" && (
                <p className="text-sm text-gray-500 mt-2">
                  No ajuste, informe o novo total real contado no estoque.
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Motivo
              </label>

              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                {tipo === "Entrada" && (
                  <>
                    <option>Compra</option>
                    <option>Devolução</option>
                    <option>Reposição</option>
                    <option>Correção de estoque</option>
                  </>
                )}

                {tipo === "Saida" && (
                  <>
                    <option>Uso interno</option>
                    <option>Perda</option>
                    <option>Brinde</option>
                    <option>Avaria</option>
                    <option>Correção de estoque</option>
                  </>
                )}

                {tipo === "Ajuste" && (
                  <>
                    <option>Ajuste manual</option>
                    <option>Contagem física</option>
                    <option>Correção de inventário</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Observação
              </label>

              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: Nota fiscal, motivo da perda, conferência manual..."
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#102A67] text-white rounded-xl p-3 font-bold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600"
            >
              {carregando ? "Registrando..." : "Registrar Movimentação"}
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
                <ClipboardList size={22} />
                Histórico de Movimentações
              </h2>

              <p className="text-gray-500 mt-1">
                Entradas, saídas e ajustes registrados no estoque.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-[#102A67] text-white">
                  <tr>
                    <th className="p-4">Data</th>
                    <th className="p-4">Produto</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Qtd</th>
                    <th className="p-4">Antes</th>
                    <th className="p-4">Depois</th>
                    <th className="p-4">Motivo</th>
                  </tr>
                </thead>

                <tbody>
                  {movimentacoes.map((mov) => (
                    <tr key={mov.id} className="border-t hover:bg-blue-50 transition">
                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        {formatarData(mov.data_movimentacao)}
                      </td>

                      <td className="p-4 font-semibold text-[#102A67]">
                        {mov.produto_nome}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${corTipo(
                            mov.tipo
                          )}`}
                        >
                          {mov.tipo}
                        </span>
                      </td>

                      <td className="p-4 text-gray-700">
                        {mov.quantidade}
                      </td>

                      <td className="p-4 text-gray-700">
                        {mov.estoque_antes}
                      </td>

                      <td className="p-4 font-bold text-[#102A67]">
                        {mov.estoque_depois}
                      </td>

                      <td className="p-4 text-gray-700">
                        {mov.motivo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {movimentacoes.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhuma movimentação registrada.
              </div>
            )}
          </div>
        </div>

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