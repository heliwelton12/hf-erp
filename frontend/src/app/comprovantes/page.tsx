import Link from "next/link"
import MenuLateral from "@/components/MenuLateral"
import {
  Receipt,
  ArrowLeft,
  Eye,
  CreditCard,
  CalendarDays,
  DollarSign,
} from "lucide-react"

type Venda = {
  id: number
  numero_venda: string
  forma_pagamento: string
  parcelas: number
  total_original: number
  valor_taxa: number
  total_final: number
  data_venda: string
}

async function buscarComprovantes(): Promise<Venda[]> {
  const resposta = await fetch("http://127.0.0.1:8000/vendas/principais", {
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

export default async function ComprovantesPage() {
  const vendas = await buscarComprovantes()

  const totalComprovantes = vendas.length
  const totalVendido = vendas.reduce((total, venda) => total + venda.total_final, 0)
  const totalTaxas = vendas.reduce((total, venda) => total + venda.valor_taxa, 0)

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-7xl mx-auto pl-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
              <Receipt size={32} />
              Histórico de Comprovantes
            </h1>

            <p className="text-gray-600">
              Consulte e reimprima comprovantes de vendas anteriores.
            </p>
          </div>

          <Link
            href="/financeiro"
            className="bg-white text-[#102A67] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition border border-gray-200 flex items-center gap-2 shadow"
          >
            <ArrowLeft size={20} />
            Financeiro
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Receipt size={18} />
              Comprovantes
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {totalComprovantes}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <DollarSign size={18} />
              Total registrado
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(totalVendido)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <CreditCard size={18} />
              Juros repassados
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              {formatarMoeda(totalTaxas)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#102A67] flex items-center gap-2">
              <Receipt size={22} />
              Comprovantes emitidos
            </h2>

            <p className="text-gray-500 mt-1">
              Lista das vendas registradas no sistema.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-[#102A67] text-white">
                <tr>
                  <th className="p-4">Venda</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id} className="border-t hover:bg-blue-50 transition">
                    <td className="p-4 font-bold text-[#102A67] whitespace-nowrap">
                      {venda.numero_venda}
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatarData(venda.data_venda)}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <CreditCard size={16} />
                        {venda.forma_pagamento}
                      </span>
                    </td>

                    <td className="p-4 text-[#102A67] font-bold whitespace-nowrap">
                      {formatarMoeda(venda.total_final)}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/comprovante/${venda.id}`}
                        className="inline-flex items-center gap-2 bg-[#102A67] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0B1F4F] transition"
                      >
                        <Eye size={16} />
                        Ver comprovante
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vendas.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum comprovante encontrado.
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            href="/financeiro"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar ao Financeiro
          </Link>
        </div>
      </div>
    </main>
  )
}