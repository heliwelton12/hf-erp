"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Users,
  Wrench,
  Package,
  ClipboardList,
  ShoppingCart,
  Wallet,
  BarChart3,
  DollarSign,
  Boxes,
  FileText,
  Search,
  Truck,
} from "lucide-react"
import MenuLateral from "@/components/MenuLateral"

type DashboardResumo = {
  vendas_hoje: number
  faturamento_hoje: number
  produtos_estoque_baixo: number
  os_abertas: number
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function obterSaudacao() {
  const hora = new Date().getHours()

  if (hora >= 5 && hora < 12) return "Bom dia"
  if (hora >= 12 && hora < 18) return "Boa tarde"

  return "Boa noite"
}

const frasesMotivacionais = [
  "Cada atendimento bem feito fortalece a sua marca.",
  "Organização hoje, crescimento amanhã.",
  "Pequenos processos bem feitos criam grandes resultados.",
  "A qualidade do seu serviço começa nos detalhes.",
  "Vender bem também é atender com cuidado.",
  "Sua empresa cresce quando seus processos ficam mais simples.",
  "Um bom controle transforma trabalho em resultado.",
]

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardResumo>({
    vendas_hoje: 0,
    faturamento_hoje: 0,
    produtos_estoque_baixo: 0,
    os_abertas: 0,
  })

  const [carregando, setCarregando] = useState(true)

  const saudacao = obterSaudacao()

  const fraseDoDia = useMemo(() => {
    const dia = new Date().getDate()
    const indice = dia % frasesMotivacionais.length
    return frasesMotivacionais[indice]
  }, [])

  async function buscarDashboard() {
    const resposta = await fetch("http://127.0.0.1:8000/dashboard/resumo", {
      cache: "no-store",
    })

    const dados = await resposta.json()
    setDashboard(dados)
    setCarregando(false)
  }

  useEffect(() => {
    buscarDashboard()
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <Image
                src="/logo-hf.jpeg"
                alt="Logo HF"
                width={115}
                height={115}
                className="rounded-2xl object-contain"
                priority
              />

              <div>
                <h1 className="text-4xl font-bold text-[#102A67] mb-1">
                  HF ERP
                </h1>

                <p className="text-xl font-semibold text-gray-800">
                  HF Papelaria & Informática
                </p>

                <p className="text-gray-500">
                  Conectando ideias, imprimindo resultados!
                </p>
              </div>
            </div>

            <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5 max-w-md">
              <p className="text-lg font-bold text-[#102A67]">
                {saudacao}!
              </p>

              <p className="text-gray-600 mt-1">
                {fraseDoDia}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Link
            href="/caixa"
            className="bg-[#102A67] text-white rounded-2xl shadow-lg p-4 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <p className="text-sm text-blue-100">Atalho rápido</p>

            <h2 className="flex items-center gap-2 text-xl font-bold">
              <ShoppingCart size={22} />
              Nova Venda
            </h2>
          </Link>

          <Link
            href="/orcamentos/novo"
            className="bg-[#FFD22E] text-[#102A67] rounded-2xl shadow-lg p-4 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <p className="text-sm text-gray-700">Atalho rápido</p>

            <h2 className="flex items-center gap-2 text-xl font-bold">
              <FileText size={22} />
              Novo Orçamento
            </h2>
          </Link>

          <Link
            href="/os/novo"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <p className="text-sm text-gray-500">Atalho rápido</p>

            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67]">
              <Wrench size={22} />
              Nova OS
            </h2>
          </Link>

          <Link
            href="/produtos/novo"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <p className="text-sm text-gray-500">Atalho rápido</p>

            <h2 className="flex items-center gap-2 text-xl font-bold text-[#102A67]">
              <Package size={22} />
              Novo Produto
            </h2>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="flex items-center gap-2 text-gray-500">
              <ShoppingCart size={18} />
              Vendas Hoje
            </p>

            <h2 className="text-3xl font-bold text-[#102A67]">
              {carregando ? "..." : dashboard.vendas_hoje}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="flex items-center gap-2 text-gray-500">
              <DollarSign size={18} />
              Faturamento Hoje
            </p>

            <h2 className="text-3xl font-bold text-[#102A67]">
              {carregando ? "..." : formatarMoeda(dashboard.faturamento_hoje)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="flex items-center gap-2 text-gray-500">
              <Boxes size={18} />
              Estoque Baixo
            </p>

            <h2 className="text-3xl font-bold text-[#102A67]">
              {carregando ? "..." : dashboard.produtos_estoque_baixo}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#374151] p-6">
            <p className="flex items-center gap-2 text-gray-500">
              <Wrench size={18} />
              OS Abertas
            </p>

            <h2 className="text-3xl font-bold text-[#102A67]">
              {carregando ? "..." : dashboard.os_abertas}
            </h2>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#102A67]">
            Gestão da Empresa
          </h2>

          <p className="text-gray-500">
            Cadastros, produtos, serviços, estoque, fornecedores e controle financeiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/clientes"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Users size={22} />
              Clientes
            </h2>

            <p className="text-gray-600">
              Gerencie os clientes cadastrados.
            </p>
          </Link>

          <Link
            href="/produtos"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Package size={22} />
              Produtos
            </h2>

            <p className="text-gray-600">
              Gerencie produtos, preços e estoque.
            </p>
          </Link>

          <Link
            href="/estoque"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Boxes size={22} />
              Estoque
            </h2>

            <p className="text-gray-600">
              Movimente entradas, saídas e ajustes.
            </p>
          </Link>

          <Link
            href="/servicos"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <ClipboardList size={22} />
              Serviços
            </h2>

            <p className="text-gray-600">
              Cadastre serviços oferecidos.
            </p>
          </Link>

          <Link
            href="/financeiro"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Wallet size={22} />
              Financeiro
            </h2>

            <p className="text-gray-600">
              Controle receitas e faturamento.
            </p>
          </Link>

          <Link
            href="/fornecedores"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Truck size={22} />
              Fornecedores
            </h2>

            <p className="text-gray-600">
              Gerencie fornecedores e parceiros comerciais.
            </p>
          </Link>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#102A67]">
            Vendas e Atendimento
          </h2>

          <p className="text-gray-500">
            Orçamentos, ordens de serviço e acompanhamento do cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10">
          <Link
            href="/orcamentos"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <FileText size={22} />
              Orçamentos
            </h2>

            <p className="text-gray-600">
              Crie propostas para clientes.
            </p>
          </Link>

          <Link
            href="/os"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Wrench size={22} />
              Ordens de Serviço
            </h2>

            <p className="text-gray-600">
              Controle serviços, status e atendimentos.
            </p>
          </Link>

          <Link
            href="/consulta"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <Search size={22} />
              Consulta OS
            </h2>

            <p className="text-gray-600">
              Página para o cliente consultar a OS.
            </p>
          </Link>

          <Link
            href="/caixa-fechamento"
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition block"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-2 text-[#102A67]">
              <BarChart3 size={22} />
              Fechamento de Caixa
            </h2>

            <p className="text-gray-600">
              Confira e encerre o caixa do dia.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}