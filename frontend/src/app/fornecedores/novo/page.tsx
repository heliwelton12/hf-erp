"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  Truck,
  ArrowLeft,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Tags,
  FileText,
} from "lucide-react"

export default function NovoFornecedorPage() {
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [nomeFantasia, setNomeFantasia] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [telefone, setTelefone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [endereco, setEndereco] = useState("")
  const [categoria, setCategoria] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [status, setStatus] = useState("Ativo")

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function salvarFornecedor(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch("http://127.0.0.1:8000/fornecedores/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        nome_fantasia: nomeFantasia || null,
        cnpj: cnpj || null,
        telefone: telefone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        endereco: endereco || null,
        categoria: categoria || null,
        observacoes: observacoes || null,
        status,
      }),
    })

    const dados = await resposta.json()

    if (dados.mensagem === "Fornecedor cadastrado com sucesso") {
      setMensagem("Fornecedor cadastrado com sucesso!")

      setTimeout(() => {
        router.push("/fornecedores")
      }, 800)

      return
    }

    setMensagem(dados.mensagem || "Erro ao cadastrar fornecedor.")
    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-4xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <Truck size={32} />
            Novo Fornecedor
          </h1>

          <p className="text-gray-600">
            Cadastre fornecedores de produtos, materiais, serviços e insumos.
          </p>
        </div>

        <form
          onSubmit={salvarFornecedor}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <Building2 size={22} />
              Dados principais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome / Razão Social
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: Papelaria Atacado LTDA"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome Fantasia
                </label>

                <input
                  type="text"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: Atacado Papel"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <FileText size={22} />
              Documentos e categoria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  CNPJ
                </label>

                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="00.000.000/0001-00"
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
                  placeholder="Ex: Papelaria, Sublimação..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
                >
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <Phone size={22} />
              Contato
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Telefone
                </label>

                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  WhatsApp
                </label>

                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="(00) 90000-0000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="fornecedor@email.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
              <MapPin size={22} />
              Endereço
            </h2>

            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>

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
              placeholder="Ex: Condições de compra, prazo de entrega, produtos fornecidos..."
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-bold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar Fornecedor"}
          </button>

          {mensagem && (
            <div className="bg-[#F5F7FA] border border-gray-200 text-gray-800 rounded-xl p-4 font-semibold">
              {mensagem}
            </div>
          )}
        </form>

        <div className="mt-6">
          <Link
            href="/fornecedores"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Fornecedores
          </Link>
        </div>
      </div>
    </main>
  )
}