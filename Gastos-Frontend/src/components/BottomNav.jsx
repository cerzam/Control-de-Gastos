import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, List, PieChart, Settings, Plus } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Manejador especial para el botón de resumen:
  // Hace scroll suave si estás en Home, o te lleva a Home sin dejar prendido el botón
  const handleResumenClick = () => {
    if (pathname === '/home') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } else {
      navigate('/home')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50
                    bg-[#1A1F2F] border-t border-[#374151]/30
                    flex items-center justify-around px-2 py-2 shadow-2xl">
      
      {/* 1. INICIO (Solo se ilumina si estás en /home) */}
      <button 
        onClick={() => navigate('/home')} 
        className="flex flex-col items-center gap-1 px-3 py-1 min-w-[54px] cursor-pointer"
      >
        <LayoutDashboard size={20} className={pathname === '/home' ? 'text-[#10B981]' : 'text-[#8B949E]'} />
        <span className={`text-[10px] font-semibold ${pathname === '/home' ? 'text-[#10B981]' : 'text-[#8B949E]'}`}>Inicio</span>
      </button>

      {/* 2. GASTOS (Solo se ilumina si estás en /gastos) */}
      <button 
        onClick={() => navigate('/gastos')} 
        className="flex flex-col items-center gap-1 px-3 py-1 min-w-[54px] cursor-pointer"
      >
        <List size={20} className={pathname === '/gastos' ? 'text-[#10B981]' : 'text-[#8B949E]'} />
        <span className={`text-[10px] font-semibold ${pathname === '/gastos' ? 'text-[#10B981]' : 'text-[#8B949E]'}`}>Gastos</span>
      </button>

      {/* 3. FAB FLOTANTE CENTRAL (Nuevo Gasto) */}
      <button 
        onClick={() => navigate('/nuevo')} 
        className="w-14 h-14 -mt-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg shadow-green-950/40 hover:bg-green-400 active:scale-95 transition-all cursor-pointer"
      >
        <Plus size={26} className="text-[#0F1419]" strokeWidth={3} />
      </button>

      {/* 4. RESUMEN (Nunca se queda prendido fijo, solo reacciona al hover/click) */}
      <button 
        onClick={handleResumenClick} 
        className="flex flex-col items-center gap-1 px-3 py-1 min-w-[54px] cursor-pointer text-[#8B949E] hover:text-[#10B981] transition-colors"
      >
        <PieChart size={20} />
        <span className="text-[10px] font-semibold">Resumen</span>
      </button>

      {/* 5. AJUSTES (Solo se ilumina si estás en /ajustes) */}
      <button 
        onClick={() => navigate('/ajustes')} 
        className="flex flex-col items-center gap-1 px-3 py-1 min-w-[54px] cursor-pointer"
      >
        <Settings size={20} className={pathname === '/ajustes' ? 'text-[#10B981]' : 'text-[#8B949E]'} />
        <span className={`text-[10px] font-semibold ${pathname === '/ajustes' ? 'text-[#10B981]' : 'text-[#8B949E]'}`}>Ajustes</span>
      </button>

    </nav>
  )
}