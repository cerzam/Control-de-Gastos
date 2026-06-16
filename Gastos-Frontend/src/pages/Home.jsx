import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { 
  presupuestoMes, 
  gastosRecientes, 
  gastosPorCategoria, 
  tendenciaMensual,
  usuarioActual
} from '../mocks/gastosMock'

// Modificamos el helper local para usar pesos ($) en lugar de colones
const formatPeso = (val) => `$${Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

export default function Home() {
  const navigate = useNavigate()
  
  // Lógica de alertas de presupuesto (HU-16)
  const esExcedido = presupuestoMes.porcentajeGastado >= presupuestoMes.umbralAlerta

  return (
    <div className="min-h-screen bg-[#0D0F14] text-[#F0F6FC] pb-24 px-4 pt-6">
      
      {/* ── HEADER DE BIENVENIDA ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs text-[#8B949E] tracking-wider uppercase font-medium">Panel General</span>
          <h1 className="text-2xl font-bold tracking-tight">Hola, {usuarioActual.nombre}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1C2130] border border-[#30363D] flex items-center justify-center font-bold text-[#1DB954]">
          {usuarioActual.iniciales}
        </div>
      </div>

      {/* ── TARJETA CARD DE BALANCE Y ALERTA (HU-16 / HU-17) ──────────── */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 mb-5 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-[#8B949E] font-medium">Balance Disponible ({presupuestoMes.mes})</p>
            <h2 className="text-3xl font-extrabold text-[#F0F6FC] mt-1">
              {formatPeso(presupuestoMes.balanceDisponible)}
            </h2>
          </div>
          
          {/* Badge Dinámico de Alerta */}
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${
            esExcedido ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
          }`}>
            {esExcedido ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
            {esExcedido ? 'Cuidado (Límite 80%)' : 'Presupuesto OK'}
          </span>
        </div>

        {/* Barra de progreso de Presupuesto */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#8B949E] mb-1.5">
            <span>Gastado: {formatPeso(presupuestoMes.gastadoTotal)}</span>
            <span>{presupuestoMes.porcentajeGastado}% del límite</span>
          </div>
          <div className="w-full h-2.5 bg-[#1C2130] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                esExcedido ? 'bg-amber-500' : 'bg-[#1DB954]'
              }`}
              style={{ width: `${Math.min(presupuestoMes.porcentajeGastado, 100)}%` }}
            />
          </div>
        </div>

        {/* Mini stats de comparación */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#30363D]/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-500/10 text-green-400">
              <ArrowUpRight size={16} />
            </div>
            <div>
              <p className="text-[10px] text-[#8B949E]">Ingresos del mes</p>
              <p className="text-sm font-semibold">{formatPeso(presupuestoMes.ingresos)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <ArrowDownRight size={16} />
            </div>
            <div>
              <p className="text-[10px] text-[#8B949E]">Límite fijado</p>
              <p className="text-sm font-semibold">{formatPeso(presupuestoMes.limiteTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRÁFICA DE TENDENCIA (ÉPICA 7) ─────────────────────────────── */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 mb-5">
        <h3 className="text-sm font-bold text-[#F0F6FC] mb-3">Historial de Gastos vs Ingresos</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tendenciaMensual} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="mes" stroke="#8B949E" fontSize={11} tickLine={false} />
              <YAxis stroke="#8B949E" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} />
              <Area type="monotone" dataKey="ingresos" stroke="#3B82F6" fillOpacity={0.1} fill="#3B82F6" strokeWidth={2} />
              <Area type="monotone" dataKey="gastos" stroke="#EF4444" fillOpacity={0.1} fill="#EF4444" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── DISTRIBUCIÓN POR CATEGORÍAS (HU-18) ─────────────────────────── */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 mb-5 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-5 h-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gastosPorCategoria}
                innerRadius={28}
                outerRadius={42}
                paddingAngle={3}
                dataKey="porcentaje"
              >
                {gastosPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-[#F0F6FC]">Categorías</span>
          </div>
        </div>
        
        {/* Leyenda de categorías */}
        <div className="col-span-7 space-y-2">
          {gastosPorCategoria.slice(0, 3).map((cat) => (
            <div key={cat.id} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[#8B949E] truncate max-w-[90px]">{cat.nombre}</span>
              </div>
              <span className="font-semibold text-right">{cat.porcentaje}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ÚLTIMOS GASTOS REGISTRADOS (HU-10) ─────────────────────────── */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[#F0F6FC]">Gastos recientes</h3>
          <button 
            onClick={() => navigate('/gastos')}
            className="text-xs text-[#1DB954] font-semibold flex items-center hover:underline"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-[#30363D]/50">
          {gastosRecientes.map((gasto) => (
            <div key={gasto.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-[#F0F6FC]">{gasto.nombre}</p>
                <p className="text-xs text-[#8B949E]">{gasto.hora} • {gasto.categoria}</p>
              </div>
              <span className="text-sm font-bold text-red-400">
                -{formatPeso(gasto.monto)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Renderizado de la barra de navegación compartida */}
      <BottomNav />
    </div>
  )
}