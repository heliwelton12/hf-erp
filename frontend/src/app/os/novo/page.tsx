"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MenuLateral from "@/components/MenuLateral"
import {
  Wrench,
  UserRound,
  Laptop,
  FileText,
  ClipboardList,
  DollarSign,
  CalendarDays,
  Save,
  ArrowLeft,
} from "lucide-react"

type Cliente = {
  id: number
  nome: string
  telefone: string
}

const statusOpcoes = [
  "Recebido",
  "Em análise",
  "Em andamento",
  "Aguardando cliente",
  "Aguardando peça",
  "Concluído",
  "Entregue",
  "Cancelado",
]

export default function NovaOSPage() {
  const router = useRouter()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteId, setClienteId] = useState("")
  const [equipamento, setEquipamento] = useState("")
  const [marcaModelo, setMarcaModelo] = useState("")
  const [defeitoRelatado, setDefeitoRelatado] = useState("")
  const [servicoSolicitado, setServicoSolicitado] = useState("")
  const [status, setStatus] = useState("Recebido")
  const [valor, setValor] = useState("")
  const [prazoEntrega, setPrazoEntrega] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function buscarClientes() {
    const resposta = await fetch("http://127.0.0.1:8000/clientes/")
    const dados = await resposta.json()
    setClientes(dados)
  }

  useEffect(() => {
    buscarClientes()
  }, [])

  async function salvarOS(event: React.FormEvent) {
    event.preventDefault()
    setCarregando(true)

    await fetch("http://127.0.0.1:8000/os/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente_id: Number(clienteId),
        equipamento,
        marca_modelo: marcaModelo,
        defeito_relatado: defeitoRelatado,
        servico_solicitado: servicoSolicitado,
        status,
        valor: Number(valor || 0),
        prazo_entrega: prazoEntrega,
        observacoes,
      }),
    })

    setCarregando(false)
    router.push("/os")
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-4xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <Wrench size={32} />
            Nova Ordem de Serviço
          </h1>

          <p className="text-gray-600">
            Cadastre uma nova OS para acompanhar atendimento, prazo e status.
          </p>
        </div>

        <form
          onSubmit={salvarOS}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <UserRound size={18} />
              Cliente
            </label>

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
            >
              <option value="">Selecione um cliente</option>

              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} — {cliente.telefone}
                </option>
              ))}
            </select>

            {clientes.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Nenhum cliente cadastrado. Cadastre um cliente antes de abrir uma OS.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Laptop size={18} />
                Equipamento
              </label>

              <input
                type="text"
                value={equipamento}
                onChange={(e) => setEquipamento(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: Notebook"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Laptop size={18} />
                Marca / Modelo
              </label>

              <input
                type="text"
                value={marcaModelo}
                onChange={(e) => setMarcaModelo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: Dell Inspiron"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FileText size={18} />
              Defeito Relatado
            </label>

            <textarea
              value={defeitoRelatado}
              onChange={(e) => setDefeitoRelatado(e.target.value)}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Computador lento"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <ClipboardList size={18} />
              Serviço Solicitado
            </label>

            <input
              type="text"
              value={servicoSolicitado}
              onChange={(e) => setServicoSolicitado(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Formatação"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <ClipboardList size={18} />
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white"
              >
                {statusOpcoes.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <DollarSign size={18} />
                Valor
              </label>

              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
                placeholder="Ex: 120"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <CalendarDays size={18} />
                Prazo de Entrega
              </label>

              <input
                type="date"
                value={prazoEntrega}
                onChange={(e) => setPrazoEntrega(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FileText size={18} />
              Observações
            </label>

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800"
              placeholder="Ex: Cliente pediu backup"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || clientes.length === 0}
            className="w-full bg-[#102A67] text-white rounded-xl p-3 font-semibold hover:bg-[#0B1F4F] transition disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {carregando ? "Salvando..." : "Salvar OS"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/os"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Ordens de Serviço
          </Link>
        </div>
      </div>
    </main>
  )
}