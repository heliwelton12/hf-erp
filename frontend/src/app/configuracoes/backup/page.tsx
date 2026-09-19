import Link from "next/link"
import MenuLateral from "@/components/MenuLateral"
import {
  DatabaseBackup,
  Download,
  ShieldCheck,
  Cloud,
  HardDrive,
  Usb,
  ArrowLeft,
  RotateCcw,
} from "lucide-react"

export default function BackupPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <MenuLateral />

      <div className="max-w-5xl mx-auto pl-24">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-[#102A67] mb-2">
            <DatabaseBackup size={32} />
            Backup do Sistema
          </h1>

          <p className="text-gray-600">
            Gere uma cópia de segurança do banco de dados do HF ERP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#102A67] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <ShieldCheck size={18} />
              Segurança
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              Backup Manual
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#FFD22E] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <Cloud size={18} />
              Recomendado
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              Nuvem
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-l-8 border-[#3B82F6] p-6">
            <p className="text-gray-500 flex items-center gap-2">
              <HardDrive size={18} />
              Cópia Extra
            </p>

            <h2 className="text-2xl font-bold text-[#102A67]">
              HD/Pendrive
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
            <Download size={22} />
            Gerar backup agora
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 font-medium mb-6">
            Guarde o arquivo de backup em um local seguro, como Google Drive,
            OneDrive, HD externo ou pendrive. Evite deixar apenas no computador.
          </div>

          <a
            href="http://127.0.0.1:8000/backup/gerar"
            className="w-full bg-[#102A67] text-white rounded-xl p-4 font-bold text-center hover:bg-[#0B1F4F] transition flex items-center justify-center gap-2"
          >
            <Download size={22} />
            Gerar Backup
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-[#102A67] mb-4 flex items-center gap-2">
            <RotateCcw size={22} />
            Restaurar Backup
          </h2>

          <div className="bg-gray-100 border border-gray-200 text-gray-700 rounded-xl p-4 mb-5">
            Esta função ficará disponível futuramente. Por segurança, a restauração
            do banco precisa confirmar o arquivo correto antes de substituir os dados.
          </div>

          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 rounded-xl p-4 font-bold cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RotateCcw size={22} />
            Restaurar Backup em breve
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">
            <Cloud className="text-[#102A67] mb-3" size={28} />

            <h3 className="font-bold text-[#102A67]">
              Google Drive / OneDrive
            </h3>

            <p className="text-gray-600 mt-2">
              Ideal para manter uma cópia fora do computador.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">
            <Usb className="text-[#102A67] mb-3" size={28} />

            <h3 className="font-bold text-[#102A67]">
              Pendrive
            </h3>

            <p className="text-gray-600 mt-2">
              Útil para guardar uma cópia rápida e portátil.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-200 p-5">
            <HardDrive className="text-[#102A67] mb-3" size={28} />

            <h3 className="font-bold text-[#102A67]">
              HD Externo
            </h3>

            <p className="text-gray-600 mt-2">
              Boa opção para armazenar backups maiores.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href="/configuracoes"
            className="text-[#102A67] font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar para Configurações
          </Link>
        </div>
      </div>
    </main>
  )
}