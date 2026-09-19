"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function CancelarVendaPage() {
  const params = useParams()
  const router = useRouter()

  const vendaId = params.vendaId as string

  const [motivo, setMotivo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function cancelarVenda(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/vendas/${vendaId}/cancelar`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo: motivo || "Cancelamento solicitado",
        }),
      }
    )

    const dados = await resposta.json()

    if (dados.mensagem === "Venda cancelada com sucesso") {
      setMensagem("Venda cancelada com sucesso!")

      setTimeout(() => {
        router.push("/financeiro")
      }, 1000)

      return
    }

    setMensagem(dados.mensagem || "Erro ao cancelar venda.")
    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Cancelar Venda
        </h1>

        <p className="text-gray-600 mb-8">
          Tem certeza que deseja cancelar esta venda? Esta ação devolverá os
          produtos ao estoque e removerá a venda dos totais financeiros.
        </p>

        <form
          onSubmit={cancelarVenda}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 mb-6 font-medium">
            Atenção: essa ação não apaga a venda, apenas marca como cancelada.
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Motivo do cancelamento
            </label>

            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Venda lançada por engano, cliente desistiu, pagamento não aprovado..."
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={carregando}
              className="block w-full bg-gray-800 text-white rounded-xl p-3 font-semibold text-center hover:bg-gray-700 transition"
            >
              {carregando ? "Cancelando..." : "Confirmar Cancelamento"}
            </button>

            <Link
              href="/financeiro"
              className="block w-full bg-gray-200 text-gray-800 rounded-xl p-3 font-semibold text-center hover:bg-gray-300 transition"
            >
              Voltar
            </Link>
          </div>

          {mensagem && (
            <div className="mt-4 bg-gray-100 border border-gray-300 text-gray-800 rounded-xl p-4">
              {mensagem}
            </div>
          )}
        </form>
      </div>
    </main>
  )
}