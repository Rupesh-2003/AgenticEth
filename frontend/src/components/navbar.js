"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full mx-auto px-[80px] border-b-[1px] border-gray-200">
        <div className="flex justify-between w-full h-16 items-center">
          <div className="flex flex-row">
            <img src="/ethchatagent_logo.png" alt="Logo" className="h-8 w-8 mr-[10px]"/>
            <span className="text-xl font-bold text-gray-800">EthChatAgent</span>
          </div>
          <div className="hidden sm:flex sm:space-x-8 pr-6">
            <Link
              href="/autonome-ai-agent"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/autonome-ai-agent"
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Autonome Agent
            </Link>
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/"
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Coinbase AgentKit
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
