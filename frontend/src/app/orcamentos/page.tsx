import Link from "next/link"
import MenuLateral from "@/components/MenuLateral"
import {
  FileText,
  Plus,
  Eye,
  CalendarDays,
  UserRound,
  DollarSign,
  ArrowLeft,
} from "lucide-react"

type Orcamento = {
  id: number
  numero_orcamento: string
  cliente_id: number
  cliente_nome: string
  status: string
  observacoes?: string
  total: number
  data_criacao: string
  data_atualizacao: string
}

async function buscarOrcamentos(): Promise<Orcamento[]> {
  const resposta = await fetch("http://127.0.0.1:8000/orcamentos/", {
    cache: "no-store",
  })

  return resposta.json()
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
  if (status === "Aprovado") {
    return "bg-green-100 text-green-700"
  }

  if (status === "Recusado") {
    return "bg-red-100 text-red-700"
  }

  if (status === "Convertido") {
    return "bg-blue-100 text-blue-700"
  }

  return "bg-yellow-100 text-yellow-700"
}

export default async function OrcamentosPage() {
  const orcamentos = await buscarOrcamentos()

  const totalOrcamentos = orcamentos.length
  const totalAberto = orcamentos.filter((orc) => orc.status === "Aberto").length
  const totalGeral = orcamentos.reduce((total, orc) => total + orc.total, 0)

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <FileText size={32} />
              Orçamentos
            </h1>

            <p className="text-gray-600">
              Crie, acompanhe e imprima orçamentos para clientes.
            </p>
          </div>

          <Link
            href="/orcamentos/novo"
            className="bg-[#102A67] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition flex items-center gap-2 shadow"
          >
            <Plus size={20} />
            Novo Orçamento
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500">Total de orçamentos</p>
            <h2 className="text-2xl font-bold text-[#102A67]">
              {totalOrcamentos}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500">Em aberto</p>
            <h2 className="text-2xl font-bold text-[#102A67]">
              {totalAberto}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500">Valor orçado</p>
            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(totalGeral)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67]">
              Histórico de Orçamentos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Orçamento</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {orcamentos.map((orcamento) => (
                  <tr key={orcamento.id} className="border-t hover:bg-blue-50 transition">
                    <td className="p-4 font-bold text-[#102A67]">
                      {orcamento.numero_orcamento}
                    </td>

                    <td className="p-4 text-gray-700">
                      <span className="flex items-center gap-2">
                        <UserRound size={16} />
                        {orcamento.cliente_nome}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatarData(orcamento.data_criacao)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${corStatus(
                          orcamento.status
                        )}`}
                      >
                        {orcamento.status}
                      </span>
                    </td>

                    <td className="p-4 text-[#102A67] font-bold whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <DollarSign size={16} />
                        {formatarMoeda(orcamento.total)}
                      </span>
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/orcamentos/${orcamento.numero_orcamento}`}
                        className="inline-flex items-center gap-2 bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition"
                      >
                        <Eye size={16} />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orcamentos.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum orçamento cadastrado.
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