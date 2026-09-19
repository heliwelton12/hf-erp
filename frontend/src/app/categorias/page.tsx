"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Tags,
  Plus,
  Trash2,
  ArrowLeft,
  Home,
  FolderOpen,
  Save,
} from "lucide-react"

type Categoria = {
  id: number
  nome: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarCategorias() {
    const resposta = await fetch("http://127.0.0.1:8000/categorias/")
    const dados = await resposta.json()
    setCategorias(dados)
  }

  async function salvarCategoria(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch("http://127.0.0.1:8000/categorias/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
      }),
    })

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Categoria cadastrada.")
    setNome("")
    await buscarCategorias()

    setCarregando(false)
  }

  async function excluirCategoria(id: number) {
    const confirmar = confirm("Tem certeza que deseja excluir esta categoria?")

    if (!confirmar) return

    const resposta = await fetch(`http://127.0.0.1:8000/categorias/${id}`, {
      method: "DELETE",
    })

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Categoria excluída.")
    await buscarCategorias()
  }

  useEffect(() => {
    buscarCategorias()
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-5xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Tags size={32} />
              Categorias
            </h1>

            <p className="text-gray-600">
              Organize produtos e serviços por grupos para facilitar cadastros, filtros e relatórios.
            </p>
          </div>

          <Link
            href="/produtos"
            className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
          >
            <ArrowLeft size={20} />
            Produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Tags size={18} />
              Total de categorias
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {categorias.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <FolderOpen size={18} />
              Organização
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              Produtos
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <FolderOpen size={18} />
              Uso futuro
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              Serviços
            </h2>
          </div>
        </div>

        <form
          onSubmit={salvarCategoria}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67] mb-5">
            <Plus size={22} />
            Nova Categoria
          </h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Papelaria, Informática, Sublimação..."
            />

            <button
              type="submit"
              disabled={carregando}
              className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {mensagem && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
              {mensagem}
            </div>
          )}
        </form>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67]">
              <FolderOpen size={22} />
              Categorias cadastradas
            </h2>

            <p className="text-gray-500 mt-1">
              Lista de categorias disponíveis para produtos e serviços.
            </p>
          </div>

          {categorias.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma categoria cadastrada.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Categoria #{categoria.id}
                      </p>

                      <h3 className="text-xl font-bold text-[#102A67] mt-1 flex items-center gap-2">
                        <Tags size={20} />
                        {categoria.nome}
                      </h3>

                      <p className="text-gray-500 mt-2">
                        Usada para organizar cadastros e facilitar filtros no sistema.
                      </p>
                    </div>

                    <button
                      onClick={() => excluirCategoria(categoria.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href="/produtos"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Produtos
          </Link>

          <Link
            href="/"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <Home size={18} />
            Início
          </Link>
        </div>
      </div>
    </main>
  )
}