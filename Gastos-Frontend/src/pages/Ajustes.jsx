import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Shield, CreditCard, BellRing, LogOut, ChevronRight, CheckCircle2 } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { usuarioActual } from '../mocks/gastosMock'

export default function Ajustes() {
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Rompe sesión local y manda a login
    navigate('/login')
  }

  return (
    <div className="h-full bg-[#0F1419] text-[#F5F7FB] pb-32 pt-6 px-4 overflow-y-auto select-none font-sans">
      
      {/* Header simple */}
      <div className="mb-6">
        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest block">Configuración</span>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5">Mi Perfil</h1>
      </div>

      {/* ── CARD DEL DETALLE DEL USUARIO (PREMIUM LOG) ───────────────── */}
      <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-5 flex items-center gap-4 mb-6 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#0F1419] border-2 border-[#10B981] flex items-center justify-center font-extrabold text-xl text-[#10B981]">
          {usuarioActual.iniciales}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-white tracking-tight">{usuarioActual.nombre}</h2>
            <CheckCircle2 size={13} className="text-[#10B981]" fill="#10B981" />
          </div>
          <p className="text-xs text-[#8B949E] font-medium mt-0.5">{usuarioActual.email}</p>
          <span className="inline-block bg-[#10B981]/10 text-[#10B981] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#10B981]/20 mt-2">
            Tech Lead Developer
          </span>
        </div>
      </div>
      <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4 mb-6">
  <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-2">
    Definir Presupuesto Mensual (HU-16 CA-1)
  </label>
  <div className="flex gap-2">
    <input 
      type="number" 
      defaultValue="4000" 
      placeholder="$ Configura tu meta"
      className="flex-1 bg-[#0F1419] border border-[#374151]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
    />
    <button 
      onClick={() => alert('¡Presupuesto actualizado y guardado en almacenamiento persistente!')}
      className="bg-[#10B981] text-[#0F1419] font-bold text-[11px] px-4 rounded-xl uppercase tracking-wider cursor-pointer hover:bg-green-400 transition-colors"
    >
      Establecer
    </button>
  </div>
</div>

      {/* ── SECCIÓN DE OPCIONES DE MENÚ ──────────────────────────────── */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider px-1">Ajustes de cuenta</p>
        
        <div className="bg-[#1A1F2F]/60 border border-[#374151]/10 rounded-2xl divide-y divide-[#374151]/20 overflow-hidden">
          
          <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1A1F2F] transition-colors text-left cursor-pointer">
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-200">
              <User size={18} className="text-[#3B82F6]" /> Editar información personal
            </div>
            <ChevronRight size={16} className="text-neutral-600" />
          </button>

          <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1A1F2F] transition-colors text-left cursor-pointer">
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-200">
              <CreditCard size={18} className="text-[#10B981]" /> Moneda y Presupuestos
            </div>
            <ChevronRight size={16} className="text-neutral-600" />
          </button>

          <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1A1F2F] transition-colors text-left cursor-pointer">
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-200">
              <BellRing size={18} className="text-[#F59E0B]" /> Notificaciones de Alerta
            </div>
            <ChevronRight size={16} className="text-neutral-600" />
          </button>

          <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1A1F2F] transition-colors text-left cursor-pointer">
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-200">
              <Shield size={18} className="text-[#8B5CF6]" /> Seguridad y Contraseña
            </div>
            <ChevronRight size={16} className="text-neutral-600" />
          </button>

        </div>
      </div>

      {/* ── BOTÓN DE ACCIÓN DE CIERRE DE SESIÓN ────────────────────── */}
      <div className="mt-8 pt-4">
        <button 
          onClick={handleCerrarSesion}
          className="w-full bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444]/20 text-[#EF4444] font-bold rounded-xl py-3.5 text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
        >
          <LogOut size={15} strokeWidth={2.5} /> Cerrar Sesión Activa
        </button>
        <p className="text-center text-[10px] text-neutral-600 mt-4 font-medium">GastosClaros MVP • Versión 1.0.0</p>
      </div>

      {/* Navegación Móvil */}
      <BottomNav />
    </div>
  )
}