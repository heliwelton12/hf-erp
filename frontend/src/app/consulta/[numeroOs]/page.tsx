import Image from "next/image"
import Link from "next/link"
import {
  Wrench,
  Laptop,
  CalendarDays,
  FileText,
  UserRound,
  Search,
} from "lucide-react"

type OrdemServico = {
  numero_os: string
  cliente_nome?: string
  equipamento: string
  marca_modelo?: string
  servico_solicitado: string
  status: string
  prazo_entrega?: string
  observacoes?: string
  mensagem?: string
}

type Props = {
  params: Promise<{
    numeroOs: string
  }>
}

function corStatus(status: string) {
  if (status === "Concluído" || status === "Entregue") {
    return "bg-green-100 text-green-700"
  }

  if (status === "Cancelado") {
    return "bg-red-100 text-red-700"
  }

  if (status === "Aguardando cliente" || status === "Aguardando peça") {
    return "bg-yellow-100 text-yellow-700"
  }

  if (status === "Em análise" || status === "Em andamento") {
    return "bg-blue-100 text-blue-700"
  }

  return "bg-gray-100 text-gray-700"
}

function formatarData(data?: string) {
  if (!data) {
    return "Não informado"
  }

  const partes = data.split("-")

  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  return data
}

async function buscarOS(numeroOs: string): Promise<OrdemServico> {
  const resposta = await fetch(`http://127.0.0.1:8000/os/${numeroOs}`, {
    cache: "no-store",
  })

  return resposta.json()
}

export default async function ConsultaDiretaOSPage({ params }: Props) {
  const { numeroOs } = await params
  const ordem = await buscarOS(numeroOs)

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-5">
            <Image
              src="/logo-hf.jpeg"
              alt="Logo HF"
              width={95}
              height={95}
              className="rounded-2xl object-contain"
              priority
            />

            <div>
              <h1 className="text-4xl font-bold text-[#102A67] mb-1">
                Consulta de OS
              </h1>

              <p className="text-xl font-semibold text-gray-800">
                HF Papelaria & Informática
              </p>

              <p className="text-gray-500">
                Acompanhe o andamento da sua ordem de serviço.
              </p>
            </div>
          </div>
        </div>

        {ordem.mensagem ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4">
              <Search size={32} />
            </div>

            <h2 className="text-2xl font-bold text-[#102A67]">
              OS não encontrada
            </h2>

            <p className="text-gray-600 mt-2">
              Verifique o número informado e tente novamente.
            </p>

            <Link
              href="/consulta"
              className="inline-block mt-6 bg-[#102A67] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0B1F4F] transition"
            >
              Fazer nova consulta
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#102A67] text-white p-6">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="text-blue-100">Ordem de Serviço</p>

                  <h2 className="text-3xl font-bold">
                    {ordem.numero_os}
                  </h2>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-bold ${corStatus(
                    ordem.status
                  )}`}
                >
                  {ordem.status}
                </span>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-5">
              {ordem.cliente_nome && (
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                  <p className="flex items-center gap-2 text-gray-500 mb-2">
                    <UserRound size={18} />
                    Cliente
                  </p>

                  <h3 className="font-bold text-[#102A67] text-xl">
                    {ordem.cliente_nome}
                  </h3>
                </div>
              )}

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <p className="flex items-center gap-2 text-gray-500 mb-2">
                  <Laptop size={18} />
                  Equipamento
                </p>

                <h3 className="font-bold text-[#102A67] text-xl">
                  {ordem.equipamento}
                </h3>

                {ordem.marca_modelo && (
                  <p className="text-gray-600 mt-1">
                    {ordem.marca_modelo}
                  </p>
                )}
              </div>

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <p className="flex items-center gap-2 text-gray-500 mb-2">
                  <Wrench size={18} />
                  Serviço
                </p>

                <h3 className="font-bold text-[#102A67] text-xl">
                  {ordem.servico_solicitado}
                </h3>
              </div>

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5">
                <p className="flex items-center gap-2 text-gray-500 mb-2">
                  <CalendarDays size={18} />
                  Prazo
                </p>

                <h3 className="font-bold text-[#102A67] text-xl">
                  {formatarData(ordem.prazo_entrega)}
                </h3>
              </div>

              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-5 md:col-span-2">
                <p className="flex items-center gap-2 text-gray-500 mb-2">
                  <FileText size={18} />
                  Observações
                </p>

                <p className="text-gray-700">
                  {ordem.observacoes || "Nenhuma observação cadastrada."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/consulta"
            className="text-[#102A67] font-medium hover:underline"
          >
            Fazer outra consulta
          </Link>
        </div>
      </div>
    </main>
  )
}