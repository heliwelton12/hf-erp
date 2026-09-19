"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Users,
  Plus,
  Pencil,
  Search,
  Phone,
  Mail,
  ArrowLeft,
  UserRound,
  Contact,
} from "lucide-react"

type Cliente = {
  id: number
  nome: string
  telefone: string
  email?: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState("")
  const [carregando, setCarregando] = useState(true)

  async function buscarClientes() {
    const resposta = await fetch("http://127.0.0.1:8000/clientes/", {
      cache: "no-store",
    })

    const dados = await resposta.json()
    setClientes(dados)
    setCarregando(false)
  }

  useEffect(() => {
    buscarClientes()
  }, [])

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const textoBusca = busca.toLowerCase()

      return (
        cliente.nome.toLowerCase().includes(textoBusca) ||
        cliente.telefone.toLowerCase().includes(textoBusca) ||
        (cliente.email || "").toLowerCase().includes(textoBusca)
      )
    })
  }, [clientes, busca])

  const clientesComEmail = clientes.filter((cliente) => cliente.email).length
  const clientesComTelefone = clientes.filter((cliente) => cliente.telefone).length

  function limparBusca() {
    setBusca("")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Users size={32} />
              Clientes
            </h1>

            <p className="text-gray-600">
              Gerencie os clientes cadastrados no sistema.
            </p>
          </div>

          <Link
            href="/clientes/novo"
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
          >
            <Plus size={20} />
            Novo Cliente
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Users size={18} />
              Total de clientes
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {clientes.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Phone size={18} />
              Com telefone
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {clientesComTelefone}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Mail size={18} />
              Com e-mail
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {clientesComEmail}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Search size={18} />
                Buscar cliente
              </label>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Digite nome, telefone ou e-mail..."
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={limparBusca}
                className="w-full bg-gray-200 text-gray-800 rounded-xl p-3 font-semibold hover:bg-gray-300 transition"
              >
                Limpar busca
              </button>
            </div>
          </div>

          <p className="text-gray-500 mt-4">
            Mostrando {clientesFiltrados.length} de {clientes.length} cliente(s).
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <Contact size={22} />
              Lista de clientes
            </h2>

            <p className="text-gray-500 mt-1">
              Visualize contatos e dados dos clientes cadastrados.
            </p>
          </div>

          {carregando ? (
            <div className="p-8 text-center text-gray-500">
              Carregando clientes...
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum cliente encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Cliente #{cliente.id}
                      </p>

                      <h3 className="text-xl font-bold text-[#102A67] mt-1 flex items-center gap-2">
                        <UserRound size={20} />
                        {cliente.nome}
                      </h3>

                      <div className="mt-4 space-y-2">
                        <p className="text-gray-700 flex items-center gap-2">
                          <Phone size={16} />
                          {cliente.telefone}
                        </p>

                        <p className="text-gray-700 flex items-center gap-2">
                          <Mail size={16} />
                          {cliente.email || "Sem e-mail cadastrado"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/clientes/editar/${cliente.id}`}
                      className="bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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