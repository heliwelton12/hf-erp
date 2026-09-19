"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Home,
  ShoppingCart,
  Users,
  Wrench,
  Package,
  ClipboardList,
  Wallet,
  FileText,
  BarChart3,
  Settings,
  DatabaseBackup,
  Boxes,
} from "lucide-react"

const links = [
  { href: "/", label: "Início", Icon: Home },
  { href: "/caixa", label: "Caixa / PDV", Icon: ShoppingCart },
  { href: "/clientes", label: "Clientes", Icon: Users },
  { href: "/os", label: "Ordens de Serviço", Icon: Wrench },
  { href: "/produtos", label: "Produtos", Icon: Package },
  { href: "/estoque", label: "Estoque", Icon: Boxes },
  { href: "/servicos", label: "Serviços", Icon: ClipboardList },
  { href: "/financeiro", label: "Financeiro", Icon: Wallet },
  { href: "/comprovantes", label: "Comprovantes", Icon: FileText },
  { href: "/caixa-fechamento", label: "Fechamento", Icon: BarChart3 },
]

export default function MenuLateral() {
  const [aberto, setAberto] = useState(false)

  return (
    <aside
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      className={`fixed left-0 top-0 h-screen bg-[#102A67] text-white shadow-2xl z-50 transition-all duration-300 ${
        aberto ? "w-72" : "w-20"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-blue-900 flex items-center">
          <div className={`flex items-center gap-3 ${!aberto ? "mx-auto" : ""}`}>
            <Image
              src="/logo-hf.jpeg"
              alt="Logo HF"
              width={44}
              height={44}
              className="rounded-xl bg-white p-1"
            />

            {aberto && (
              <div>
                <h2 className="font-bold text-lg leading-tight">
                  HF ERP
                </h2>

                <p className="text-xs text-blue-200">
                  Papelaria & Informática
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.Icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/10 transition ${
                  !aberto ? "justify-center" : ""
                }`}
                title={link.label}
              >
                <Icon size={22} />

                {aberto && (
                  <span className="font-medium">
                    {link.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-blue-900 space-y-2">
          <Link
            href="/configuracoes"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 bg-white/10 hover:bg-white/20 transition ${
              !aberto ? "justify-center" : ""
            }`}
            title="Configurações"
          >
            <Settings size={22} />

            {aberto && (
              <span className="font-medium">
                Configurações
              </span>
            )}
          </Link>

          <Link
            href="/configuracoes/backup"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 bg-[#FFD22E] text-[#102A67] hover:opacity-90 transition ${
              !aberto ? "justify-center" : ""
            }`}
            title="Backup"
          >
            <DatabaseBackup size={22} />

            {aberto && (
              <span className="font-bold">
                Backup
              </span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  )
}