"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function RestaurarVendaPage() {
  const params = useParams()
  const router = useRouter()

  const vendaId = params.vendaId as string

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function restaurarVenda() {
    setCarregando(true)
    setMensagem("")

    const resposta = await fetch(
      `http://127.0.0.1:8000/vendas/${vendaId}/restaurar`,
      {
        method: "PATCH",
      }
    )

    const dados = await resposta.json()

    if (dados.mensagem === "Venda restaurada com sucesso") {
      setMensagem("Venda restaurada com sucesso!")

      setTimeout(() => {
        router.push("/financeiro")
      }, 1000)

      return
    }

    setMensagem(dados.mensagem || "Erro ao restaurar venda.")
    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Restaurar Venda
        </h1>

        <p className="text-gray-600 mb-8">
          Tem certeza que deseja restaurar esta venda?
        </p>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl p-4 mb-6 font-medium">
            A venda voltará para os totais financeiros e os produtos serão
            retirados novamente do estoque.
          </div>

          <div className="space-y-3">
            <button
              onClick={restaurarVenda}
              disabled={carregando}
              className="block w-full bg-gray-800 text-white rounded-xl p-3 font-semibold text-center hover:bg-gray-700 transition"
            >
              {carregando ? "Restaurando..." : "Confirmar Restauração"}
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
        </div>
      </div>
    </main>
  )
}