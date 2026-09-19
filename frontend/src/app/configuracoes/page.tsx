"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MenuLateral from "@/components/MenuLateral"
import {
  Settings,
  Building2,
  Phone,
  MapPin,
  Receipt,
  Save,
  ArrowLeft,
  DatabaseBackup,
} from "lucide-react"

type ConfiguracaoEmpresa = {
  nome_empresa: string
  nome_fantasia: string
  cnpj: string
  telefone: string
  whatsapp: string
  email: string
  endereco: string
  mensagem_comprovante: string
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<ConfiguracaoEmpresa>({
    nome_empresa: "",
    nome_fantasia: "",
    cnpj: "",
    telefone: "",
    whatsapp: "",
    email: "",
    endereco: "",
    mensagem_comprovante: "Obrigado pela preferência!",
  })

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarConfiguracoes() {
    const resposta = await fetch("http://127.0.0.1:8000/configuracoes/")
    const dados = await resposta.json()

    setConfig({
      nome_empresa: dados.nome_empresa || "",
      nome_fantasia: dados.nome_fantasia || "",
      cnpj: dados.cnpj || "",
      telefone: dados.telefone || "",
      whatsapp: dados.whatsapp || "",
      email: dados.email || "",
      endereco: dados.endereco || "",
      mensagem_comprovante:
        dados.mensagem_comprovante || "Obrigado pela preferência!",
    })
  }

  useEffect(() => {
    buscarConfiguracoes()
  }, [])

  async function salvarConfiguracoes(event: React.FormEvent) {
    event.preventDefault()

    setCarregando(true)
    setMensagem("")

    const resposta = await fetch("http://127.0.0.1:8000/configuracoes/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    })

    const dados = await resposta.json()

    setMensagem(dados.mensagem || "Configurações salvas.")
    setCarregando(false)
  }

  function alterarCampo(campo: keyof ConfiguracaoEmpresa, valor: string) {
    setConfig({
      ...config,
      [campo]: valor,
    })
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-5xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Settings size={32} />
              Configurações da Empresa
            </h1>

            <p className="text-gray-600">
              Configure os dados usados em comprovantes, relatórios e documentos.
            </p>
          </div>

          <Link
            href="/configuracoes/backup"
            className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
          >
            <DatabaseBackup size={20} />
            Backup
          </Link>
        </div>

        <form onSubmit={salvarConfiguracoes} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67] mb-5">
              <Building2 size={22} />
              Dados da Empresa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome da empresa
                </label>

                <input
                  value={config.nome_empresa}
                  onChange={(e) =>
                    alterarCampo("nome_empresa", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: HF Tecnologia"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome fantasia
                </label>

                <input
                  value={config.nome_fantasia}
                  onChange={(e) =>
                    alterarCampo("nome_fantasia", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: HF Papelaria e Informática"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  CNPJ
                </label>

                <input
                  value={config.cnpj}
                  onChange={(e) => alterarCampo("cnpj", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: 00.000.000/0001-00"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67] mb-5">
              <Phone size={22} />
              Contato
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Telefone
                </label>

                <input
                  value={config.telefone}
                  onChange={(e) => alterarCampo("telefone", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: (75) 0000-0000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  WhatsApp
                </label>

                <input
                  value={config.whatsapp}
                  onChange={(e) => alterarCampo("whatsapp", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: (75) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  E-mail
                </label>

                <input
                  value={config.email}
                  onChange={(e) => alterarCampo("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                  placeholder="Ex: contato@hf.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67] mb-5">
              <MapPin size={22} />
              Endereço
            </h2>

            <label className="block text-gray-700 font-medium mb-2">
              Endereço completo
            </label>

            <input
              value={config.endereco}
              onChange={(e) => alterarCampo("endereco", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67] mb-5">
              <Receipt size={22} />
              Comprovantes
            </h2>

            <label className="block text-gray-700 font-medium mb-2">
              Mensagem do comprovante
            </label>

            <textarea
              value={config.mensagem_comprovante}
              onChange={(e) =>
                alterarCampo("mensagem_comprovante", e.target.value)
              }
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Obrigado pela preferência!"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-600"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar Configurações"}
          </button>

          {mensagem && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-semibold">
              {mensagem}
            </div>
          )}
        </form>

        <div className="mt-6">
          <Link
            href="/"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  )
}