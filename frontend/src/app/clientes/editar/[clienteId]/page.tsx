"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  UserRoundPen,
  UserRound,
  Phone,
  Mail,
  Save,
  ArrowLeft,
} from "lucide-react"

type Cliente = {
  id: number
  nome: string
  telefone: string
  email?: string
}

export default function EditarClientePage() {
  const params = useParams()
  const router = useRouter()

  const clienteId = params.clienteId as string

  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function buscarCliente() {
      const resposta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}`)
      const cliente: Cliente = await resposta.json()

      setNome(cliente.nome)
      setTelefone(cliente.telefone)
      setEmail(cliente.email || "")
    }

    if (clienteId) {
      buscarCliente()
    }
  }, [clienteId])

  async function salvarCliente(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        telefone,
        email,
      }),
    })

    const dados = await resposta.json()

    if (dados.mensagem === "Cliente atualizado com sucesso") {
      setMensagem("Cliente atualizado com sucesso!")

      setTimeout(() => {
        router.push("/clientes")
      }, 800)
    } else {
      setMensagem(dados.mensagem || "Erro ao atualizar cliente.")
    }

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-3xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <UserRoundPen size={32} />
            Editar Cliente
          </h1>

          <p className="text-gray-600">
            Atualize os dados de contato do cliente cadastrado.
          </p>
        </div>

        <form
          onSubmit={salvarCliente}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <UserRound size={18} />
              Nome
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
              <Phone size={18} />
              Telefone
            </label>

            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Mail size={18} />
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
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
            href="/clientes"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Clientes
          </Link>
        </div>
      </div>
    </main>
  )
}