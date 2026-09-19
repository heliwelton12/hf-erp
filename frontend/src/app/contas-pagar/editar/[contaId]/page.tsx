"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  WalletCards,
  ArrowLeft,
  Save,
  Truck,
  FileText,
  DollarSign,
  Tags,
  CreditCard,
  Pencil,
} from "lucide-react"

type Fornecedor = {
  id: number
  nome: string
  status: string
}

type ContaPagar = {
  id: number
  fornecedor_id?: number | null
  fornecedor_nome?: string
  descricao: string
  categoria?: string | null
  valor: number
  data_vencimento: string
  data_pagamento?: string | null
  forma_pagamento?: string | null
  status: string
  observacoes?: string | null
  mensagem?: string
}

function normalizarData(data?: string | null) {
  if (!data) return ""

  return data.split("T")[0]
}

export default function EditarContaPagarPage() {
  const params = useParams()
  const router = useRouter()

  const contaId = params.contaId as string

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const [fornecedorId, setFornecedorId] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [valor, setValor] = useState("")
  const [dataVencimento, setDataVencimento] = useState("")
  const [dataPagamento, setDataPagamento] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("")
  const [status, setStatus] = useState("Em aberto")
  const [observacoes, setObservacoes] = useState("")

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(true)

  async function buscarFornecedores() {
    const resposta = await fetch("http://127.0.0.1:8000/fornecedores/")
    const dados = await resposta.json()

    setFornecedores(dados)
  }

  async function buscarConta() {
    const resposta = await fetch(
      `http://127.0.0.1:8000/contas-pagar/${contaId}`
    )

    const dados: ContaPagar = await resposta.json()

    if (dados.mensagem) {
      setMensagem(dados.mensagem)
      setCarregandoDados(false)
      return
    }

    setFornecedorId(dados.fornecedor_id ? String(dados.fornecedor_id) : "")
    setDescricao(dados.descricao || "")
    setCategoria(dados.categoria || "")
    setValor(String(dados.valor || ""))
    setDataVencimento(normalizarData(dados.data_vencimento))
    setDataPagamento(normalizarData(dados.data_pagamento))
    setFormaPagamento(dados.forma_pagamento || "")
    setStatus(dados.status || "Em aberto")
    setObservacoes(dados.observacoes || "")

    setCarregandoDados(false)
  }

  useEffect(() => {
    buscarFornecedores()

    if (contaId) {
      buscarConta()
    }
  }, [contaId])

  async function salvarConta(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/contas-pagar/${contaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fornecedor_id: fornecedorId ? Number(fornecedorId) : null,
          descricao,
          categoria: categoria || null,
          valor: Number(valor),
          data_vencimento: dataVencimento,
          data_pagamento: dataPagamento || null,
          forma_pagamento: formaPagamento || null,
          status,
          observacoes: observacoes || null,
        }),
      }
    )

    const dados = await resposta.json()

    if (dados.mensagem === "Conta a pagar atualizada com sucesso") {
      setMensagem("Conta a pagar atualizada com sucesso!")

      setTimeout(() => {
        router.push("/contas-pagar")
      }, 800)

      return
    }

    setMensagem(dados.mensagem || "Erro ao atualizar conta.")
    setCarregando(false)
  }

  if (carregandoDados) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <MenuLateral />

        <div className="max-w-4xl mx-auto pl-24">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-gray-600">
            Carregando conta a pagar...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-4xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <Pencil size={32} />
            Editar Conta a Pagar
          </h1>

          <p className="text-gray-600">
            Atualize os dados da despesa, fornecedor, vencimento e pagamento.
          </p>
        </div>

        <form
          onSubmit={salvarConta}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <Truck size={22} />
              Fornecedor
            </h2>

            <select
              value={fornecedorId}
              onChange={(e) => setFornecedorId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
            >
              <option value="">Sem fornecedor vinculado</option>

              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}{" "}
                  {fornecedor.status === "Inativo" ? "(Inativo)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <FileText size={22} />
              Dados da conta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descrição
                </label>

                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: Compra de resmas de papel"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Categoria
                </label>

                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: Estoque, Aluguel, Internet..."
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <DollarSign size={22} />
              Valor e vencimento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Valor
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 350.00"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Data de vencimento
                </label>

                <input
                  type="date"
                  value={dataVencimento}
                  onChange={(e) => setDataVencimento(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value)

                    if (e.target.value !== "Pago") {
                      setDataPagamento("")
                      setFormaPagamento("")
                    }
                  }}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                >
                  <option>Em aberto</option>
                  <option>Pago</option>
                  <option>Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {status === "Pago" && (
            <div>
              <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
                <CreditCard size={22} />
                Dados do pagamento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Data de pagamento
                  </label>

                  <input
                    type="date"
                    value={dataPagamento}
                    onChange={(e) => setDataPagamento(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Forma de pagamento
                  </label>

                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                  >
                    <option value="">Selecione</option>
                    <option>PIX</option>
                    <option>Dinheiro</option>
                    <option>Cartão de Débito</option>
                    <option>Cartão de Crédito</option>
                    <option>Boleto</option>
                    <option>Transferência</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <Tags size={22} />
              Observações
            </h2>

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Compra feita para reposição do estoque..."
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-bold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar Alterações"}
          </button>

          {mensagem && (
            <div className="bg-[#F5F7FA] border border-gray-200 text-gray-800 rounded-xl p-4 font-semibold">
              {mensagem}
            </div>
          )}
        </form>

        <div className="mt-6">
          <Link
            href="/contas-pagar"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Contas a Pagar
          </Link>
        </div>
      </div>
    </main>
  )
}