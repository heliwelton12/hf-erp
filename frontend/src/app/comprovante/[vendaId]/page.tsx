"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Receipt,
  Printer,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  CalendarDays,
  CheckCircle,
  XCircle,
} from "lucide-react"

type ItemComprovante = {
  id: number
  tipo: string
  nome: string
  quantidade: number
  preco_unitario: number
  subtotal: number
}

type Comprovante = {
  loja: {
    nome: string
    descricao: string
    whatsapp: string
  }
  venda: {
    id: number
    numero_venda: string
    data_venda: string
    forma_pagamento: string
    parcelas: number
    taxa_percentual: number
    total_original: number
    valor_taxa: number
    total_final: number
    valor_parcela: number
    status?: string
    motivo_cancelamento?: string
    data_cancelamento?: string
  }
  itens: ItemComprovante[]
  mensagem_final: string
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarData(data?: string) {
  if (!data) return "-"
  return new Date(data).toLocaleString("pt-BR")
}

export default function ComprovantePage() {
  const params = useParams()
  const vendaId = params.vendaId as string

  const [comprovante, setComprovante] = useState<Comprovante | null>(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function buscarComprovante() {
      const resposta = await fetch(
        `http://127.0.0.1:8000/vendas/${vendaId}/comprovante`
      )

      const dados = await resposta.json()

      if (dados.mensagem) {
        setErro(dados.mensagem)
        setComprovante(null)
        return
      }

      setComprovante(dados)
    }

    if (vendaId) {
      buscarComprovante()
    }
  }, [vendaId])

  if (erro) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <p className="text-red-600 font-semibold">
            {erro}
          </p>

          <Link
            href="/caixa"
            className="block mt-4 text-[#102A67] font-medium hover:underline"
          >
            ← Voltar ao Caixa
          </Link>
        </div>
      </main>
    )
  }

  if (!comprovante) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <div className="max-w-md mx-auto text-gray-800">
          Carregando comprovante...
        </div>
      </main>
    )
  }

  const temAcrescimo =
    comprovante.venda.valor_taxa && comprovante.venda.valor_taxa > 0

  const vendaCancelada = comprovante.venda.status === "Cancelada"

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8 print:bg-white print:p-0">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          {vendaCancelada && (
            <div className="bg-red-100 border-b border-red-300 text-red-800 p-4 text-center">
              <p className="font-bold text-lg flex items-center justify-center gap-2">
                <XCircle size={20} />
                VENDA CANCELADA
              </p>

              <p className="text-sm mt-1">
                Este comprovante pertence a uma venda cancelada.
              </p>

              {comprovante.venda.motivo_cancelamento && (
                <p className="text-sm mt-2">
                  <strong>Motivo:</strong>{" "}
                  {comprovante.venda.motivo_cancelamento}
                </p>
              )}

              {comprovante.venda.data_cancelamento && (
                <p className="text-sm mt-1">
                  <strong>Cancelada em:</strong>{" "}
                  {formatarData(comprovante.venda.data_cancelamento)}
                </p>
              )}
            </div>
          )}

          <div className="bg-[#102A67] text-white p-6 text-center">
            <Image
              src="/logo-hf.jpeg"
              alt="Logo HF"
              width={90}
              height={90}
              className="mx-auto rounded-2xl object-contain bg-white mb-3"
              priority
            />

            <h1 className="text-2xl font-bold">
              {comprovante.loja.nome}
            </h1>

            <p className="text-blue-100">
              {comprovante.loja.descricao}
            </p>

            <p className="text-blue-100">
              WhatsApp: {comprovante.loja.whatsapp}
            </p>
          </div>

          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67] mb-3">
                <Receipt size={22} />
                Comprovante de Venda
              </h2>

              <div className="space-y-2 text-gray-800">
                <p>
                  <strong>Venda:</strong> {comprovante.venda.numero_venda}
                </p>

                <p className="flex items-center gap-2">
                  <strong>Status:</strong>

                  <span
                    className={
                      vendaCancelada
                        ? "text-red-700 font-semibold flex items-center gap-1"
                        : "text-green-700 font-semibold flex items-center gap-1"
                    }
                  >
                    {vendaCancelada ? (
                      <XCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {comprovante.venda.status || "Ativa"}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <strong>Data:</strong>{" "}
                  {formatarData(comprovante.venda.data_venda)}
                </p>

                <p className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <strong>Pagamento:</strong>{" "}
                  {comprovante.venda.forma_pagamento}
                </p>

                {comprovante.venda.parcelas > 1 && (
                  <p>
                    <strong>Parcelas:</strong>{" "}
                    {comprovante.venda.parcelas}x de{" "}
                    {formatarMoeda(comprovante.venda.valor_parcela)}
                  </p>
                )}
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="flex items-center gap-2 font-bold text-[#102A67] mb-3">
                <ShoppingCart size={20} />
                Itens
              </h2>

              <div className="space-y-3">
                {comprovante.itens.map((item) => (
                  <div key={item.id} className="text-gray-800">
                    <div className="flex justify-between gap-4">
                      <span>
                        {item.quantidade}x {item.nome}
                      </span>

                      <strong>
                        {formatarMoeda(item.subtotal)}
                      </strong>
                    </div>

                    <p className="text-sm text-gray-500">
                      Unitário: {formatarMoeda(item.preco_unitario)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>{formatarMoeda(comprovante.venda.total_original)}</strong>
              </div>

              {temAcrescimo && (
                <div className="flex justify-between">
                  <span>Acréscimo parcelamento</span>
                  <strong>{formatarMoeda(comprovante.venda.valor_taxa)}</strong>
                </div>
              )}

              <div className="flex justify-between text-xl border-t border-gray-200 pt-3 text-[#102A67]">
                <span className="font-bold">Total</span>
                <strong>{formatarMoeda(comprovante.venda.total_final)}</strong>
              </div>
            </div>

            <p className="text-center text-gray-700 mt-6">
              {vendaCancelada
                ? "Venda cancelada. Comprovante apenas para conferência."
                : comprovante.mensagem_final}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Imprimir
          </button>

          <Link
            href="/caixa"
            className="flex-1 bg-white border border-gray-300 text-[#102A67] rounded-xl p-3 font-semibold text-center hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Caixa
          </Link>
        </div>
      </div>
    </main>
  )
}