"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  FileText,
  Printer,
  ArrowLeft,
  UserRound,
  Phone,
  CalendarDays,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
} from "lucide-react"

type ItemOrcamento = {
  id: number
  tipo: string
  item_id: number
  nome: string
  quantidade: number
  preco_unitario: number
  subtotal: number
}

type Orcamento = {
  id: number
  numero_orcamento: string
  cliente_id: number
  cliente_nome: string
  cliente_telefone?: string
  status: string
  observacoes?: string
  total: number
  data_criacao: string
  data_atualizacao: string
  itens: ItemOrcamento[]
  mensagem?: string
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

function formatarData(data: string) {
  return new Date(data).toLocaleString("pt-BR")
}

function corStatus(status: string) {
  if (status === "Aprovado") return "bg-green-100 text-green-700"
  if (status === "Recusado") return "bg-red-100 text-red-700"
  if (status === "Convertido") return "bg-blue-100 text-blue-700"

  return "bg-yellow-100 text-yellow-700"
}

function iconeStatus(status: string) {
  if (status === "Aprovado") return <CheckCircle size={18} />
  if (status === "Recusado") return <XCircle size={18} />
  return <Clock size={18} />
}

export default function VisualizarOrcamentoPage() {
  const params = useParams()
  const router = useRouter()

  const numeroOrcamento = params.numeroOrcamento as string

  const [orcamento, setOrcamento] = useState<Orcamento | null>(null)
  const [mensagem, setMensagem] = useState("")
  const [carregandoStatus, setCarregandoStatus] = useState(false)
  const [convertendoVenda, setConvertendoVenda] = useState(false)

  const [formaPagamento, setFormaPagamento] = useState("PIX")
  const [parcelas, setParcelas] = useState("1")

  async function buscarOrcamento() {
    const resposta = await fetch(
      `http://127.0.0.1:8000/orcamentos/${numeroOrcamento}`
    )

    const dados = await resposta.json()

    if (dados.mensagem) {
      setMensagem(dados.mensagem)
      setOrcamento(null)
      return
    }

    setOrcamento(dados)
  }

  async function atualizarStatus(novoStatus: string) {
    setCarregandoStatus(true)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/orcamentos/${numeroOrcamento}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus,
        }),
      }
    )

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Status atualizado.")
    await buscarOrcamento()

    setCarregandoStatus(false)
  }

  async function converterEmVenda() {
    const numeroParcelas = Number(parcelas)

    const taxaPercentual =
      formaPagamento === "Cartão de Crédito" && numeroParcelas > 3
        ? taxasCredito[numeroParcelas] || 0
        : 0

    const confirmar = confirm(
      `Deseja converter este orçamento em venda?\n\nPagamento: ${formaPagamento}${
        formaPagamento === "Cartão de Crédito"
          ? `\nParcelas: ${numeroParcelas}x`
          : ""
      }`
    )

    if (!confirmar) return

    setConvertendoVenda(true)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/orcamentos/${numeroOrcamento}/converter-venda`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forma_pagamento: formaPagamento,
          parcelas: numeroParcelas,
          taxa_percentual: taxaPercentual,
        }),
      }
    )

    const dados = await resposta.json()

    if (dados.mensagem === "Orçamento convertido em venda com sucesso") {
      router.push(`/comprovante/${dados.venda_id}`)
      return
    }

    setMensagem(dados.mensagem || "Erro ao converter orçamento em venda.")
    setConvertendoVenda(false)
  }

  useEffect(() => {
    if (numeroOrcamento) {
      buscarOrcamento()
    }
  }, [numeroOrcamento])

  if (mensagem && !orcamento) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-[#102A67]">
            Orçamento não encontrado
          </h1>

          <p className="text-gray-600 mt-2">{mensagem}</p>

          <Link
            href="/orcamentos"
            className="inline-block mt-6 bg-[#102A67] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition"
          >
            Voltar para Orçamentos
          </Link>
        </div>
      </main>
    )
  }

  if (!orcamento) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-gray-600">
          Carregando orçamento...
        </div>
      </main>
    )
  }

  const jaConvertido = orcamento.status === "Convertido"

  const numeroParcelas = Number(parcelas)

  const taxaPercentual =
    formaPagamento === "Cartão de Crédito" && numeroParcelas > 3
      ? taxasCredito[numeroParcelas] || 0
      : 0

  const totalCliente =
    taxaPercentual > 0
      ? orcamento.total / (1 - taxaPercentual / 100)
      : orcamento.total

  const valorTaxa = totalCliente - orcamento.total
  const valorParcela = totalCliente / numeroParcelas

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/orcamentos"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Orçamentos
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2"
          >
            <Printer size={20} />
            Imprimir
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          <div className="bg-[#102A67] text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-blue-100">Orçamento</p>

                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <FileText size={34} />
                  {orcamento.numero_orcamento}
                </h1>
              </div>

              <span
                className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${corStatus(
                  orcamento.status
                )}`}
              >
                {iconeStatus(orcamento.status)}
                {orcamento.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <p className="text-gray-500 flex items-center gap-2">
                  <UserRound size={18} />
                  Cliente
                </p>

                <h2 className="text-xl font-bold text-[#102A67] mt-1">
                  {orcamento.cliente_nome}
                </h2>
              </div>

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <p className="text-gray-500 flex items-center gap-2">
                  <Phone size={18} />
                  Telefone
                </p>

                <h2 className="text-xl font-bold text-[#102A67] mt-1">
                  {orcamento.cliente_telefone || "-"}
                </h2>
              </div>

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <p className="text-gray-500 flex items-center gap-2">
                  <CalendarDays size={18} />
                  Data
                </p>

                <h2 className="text-xl font-bold text-[#102A67] mt-1">
                  {formatarData(orcamento.data_criacao)}
                </h2>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#102A67] mb-4">
                Itens do orçamento
              </h2>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#102A67] text-white">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Qtd</th>
                      <th className="p-4">Unitário</th>
                      <th className="p-4">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orcamento.itens.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-4 text-gray-800 font-semibold">
                          {item.nome}
                        </td>

                        <td className="p-4 text-gray-700">
                          {item.tipo === "produto" ? "Produto" : "Serviço"}
                        </td>

                        <td className="p-4 text-gray-700">
                          {item.quantidade}
                        </td>

                        <td className="p-4 text-gray-700">
                          {formatarMoeda(item.preco_unitario)}
                        </td>

                        <td className="p-4 text-[#102A67] font-bold">
                          {formatarMoeda(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {orcamento.observacoes && (
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <h2 className="text-xl font-bold text-[#102A67] mb-2">
                  Observações
                </h2>

                <p className="text-gray-700">{orcamento.observacoes}</p>
              </div>
            )}

            <div className="bg-[#102A67] text-white rounded-2xl p-6 flex items-center justify-between">
              <span className="text-blue-100 flex items-center gap-2">
                <DollarSign size={22} />
                Total do orçamento
              </span>

              <strong className="text-4xl">
                {formatarMoeda(orcamento.total)}
              </strong>
            </div>

            <div className="print:hidden border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-[#102A67] mb-4">
                Ações do orçamento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => atualizarStatus("Aprovado")}
                  disabled={carregandoStatus || jaConvertido}
                  className="bg-green-100 text-green-700 rounded-xl p-3 font-bold hover:bg-green-200 transition disabled:bg-gray-200 disabled:text-gray-500"
                >
                  Aprovar
                </button>

                <button
                  onClick={() => atualizarStatus("Recusado")}
                  disabled={carregandoStatus || jaConvertido}
                  className="bg-red-100 text-red-700 rounded-xl p-3 font-bold hover:bg-red-200 transition disabled:bg-gray-200 disabled:text-gray-500"
                >
                  Recusar
                </button>

                <button
                  onClick={() => atualizarStatus("Aberto")}
                  disabled={carregandoStatus || jaConvertido}
                  className="bg-yellow-100 text-yellow-700 rounded-xl p-3 font-bold hover:bg-yellow-200 transition disabled:bg-gray-200 disabled:text-gray-500"
                >
                  Reabrir
                </button>
              </div>

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-lg font-bold text-[#102A67] flex items-center gap-2">
                  <CreditCard size={20} />
                  Converter em venda
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Forma de pagamento
                    </label>

                    <select
                      value={formaPagamento}
                      onChange={(e) => {
                        setFormaPagamento(e.target.value)
                        setParcelas("1")
                      }}
                      disabled={jaConvertido}
                      className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                    >
                      <option>PIX</option>
                      <option>Dinheiro</option>
                      <option>Cartão de Débito</option>
                      <option>Cartão de Crédito</option>
                    </select>
                  </div>

                  {formaPagamento === "Cartão de Crédito" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Parcelas
                      </label>

                      <select
                        value={parcelas}
                        onChange={(e) => setParcelas(e.target.value)}
                        disabled={jaConvertido}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((p) => (
                          <option key={p} value={p}>
                            {p}x{" "}
                            {p <= 3
                              ? "sem juros para o cliente"
                              : "com taxa repassada"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {formaPagamento === "Cartão de Crédito" && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-1 text-gray-700">
                    <p>
                      Taxa aplicada: <strong>{taxaPercentual}%</strong>
                    </p>

                    <p>
                      Acréscimo: <strong>{formatarMoeda(valorTaxa)}</strong>
                    </p>

                    <p>
                      Cliente paga:{" "}
                      <strong>{formatarMoeda(totalCliente)}</strong>
                    </p>

                    <p>
                      Parcelamento:{" "}
                      <strong>
                        {numeroParcelas}x de {formatarMoeda(valorParcela)}
                      </strong>
                    </p>

                    <p>
                      Você recebe:{" "}
                      <strong>{formatarMoeda(orcamento.total)}</strong>
                    </p>
                  </div>
                )}

                <button
                  onClick={converterEmVenda}
                  disabled={convertendoVenda || jaConvertido}
                  className="w-full bg-[#102A67] text-white rounded-xl p-3 font-bold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  {convertendoVenda ? "Convertendo..." : "Converter em Venda"}
                </button>
              </div>

              {mensagem && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-semibold">
                  {mensagem}
                </div>
              )}
            </div>

            <div className="text-center text-gray-500 border-t border-gray-200 pt-6">
              Orçamento gerado pelo HF ERP.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}