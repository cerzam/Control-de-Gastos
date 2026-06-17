import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import api from '../api/axios.js'

const formatPeso = (val) => `$${Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

const formatMesLabel = (m) => {
  if (!m) return '...'
  const [year, month] = m.split('-')
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${meses[parseInt(month) - 1]} ${year}`
}

const formatHora = (h) => (h ? String(h).substring(0, 5) : '')

export default function Home() {
  const navigate = useNavigate()

  // Usuario desde localStorage (guardado por Login.jsx al autenticar)
  let userLocal = {}
  try { userLocal = JSON.parse(localStorage.getItem('user') || '{}') } catch { userLocal = {} }

  // ── Estado del dashboard ───────────────────────────────────────────
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setDashboard(res.data.data))
      .catch(() => setError('No se pudo cargar el dashboard. Verifica tu conexión.'))
      .finally(() => setLoading(false))
  }, [])

  // ── Valores derivados (seguros ante null mientras carga) ───────────
  const totalMes      = Number(dashboard?.total_mes    ?? 0)
  const limiteMes     = Number(dashboard?.limite_total ?? 0)
  const porcentaje    = dashboard?.porcentaje           ?? 0
  const balance       = limiteMes - totalMes
  const ultimosGastos = dashboard?.ultimos_gastos       ?? []

  // Tendencia: mapear { mes, total } → { mes, gastos } para el dataKey existente
  const tendencia = (dashboard?.tendencia ?? []).map(t => ({
    mes:    t.mes,
    gastos: Number(t.total),
  }))

  // Por categoría: calcular porcentaje en cliente para el dataKey existente
  const categoriaData   = dashboard?.por_categoria ?? []
  const totalCategorias = categoriaData.reduce((s, c) => s + Number(c.total), 0)
  const pieData = categoriaData.map(c => ({
    ...c,
    color:     c.color || '#8B949E',
    porcentaje: totalCategorias > 0
      ? Math.round((Number(c.total) / totalCategorias) * 100)
      : 0,
  }))

  // ── Lógica de semáforo de alertas (sin cambios respecto al original) ─
  let clasesBadge = 'bg-green-500/10 text-green-400 border border-green-500/20'
  let clasesBarra = 'bg-[#1DB954]'
  let iconoAlerta = <CheckCircle2 size={13} />
  let textoAlerta = 'Presupuesto OK'

  if (porcentaje >= 100) {
    clasesBadge = 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
    clasesBarra = 'bg-red-500'
    iconoAlerta = <AlertCircle size={13} />
    textoAlerta = 'Presupuesto Excedido (100%+)'
  } else if (porcentaje >= 80) {
    clasesBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    clasesBarra = 'bg-amber-500'
    iconoAlerta = <AlertTriangle size={13} />
    textoAlerta = 'Cuidado (Límite 80%)'
  }

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#F5F7FB] pb-24 px-4 pt-6 overflow-y-auto">

      {/* HEADER DE BIENVENIDA */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] text-[#8B949E] tracking-wider uppercase font-bold block">Panel General</span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Hola, {userLocal.nombre || 'Usuario'}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1A1F2F] border border-[#374151]/30 flex items-center justify-center font-bold text-[#10B981]">
          {userLocal.iniciales || '?'}
        </div>
      </div>

      {/* ── Estado de carga ─────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-xs text-neutral-500 font-medium">Cargando dashboard...</p>
        </div>
      )}

      {/* ── Estado de error ─────────────────────────────────────────── */}
      {!loading && error && (
        <div className="text-center py-12">
          <p className="text-xs text-[#EF4444] font-medium">{error}</p>
        </div>
      )}

      {/* ── Contenido principal (solo cuando los datos están listos) ── */}
      {!loading && !error && (
        <>
          {/* TARJETA DE BALANCE Y ALERTAS INTEGRADA (HU-16 CA-3, CA-4, CA-5) */}
          <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-5 mb-5 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-[#8B949E] font-medium">Balance Disponible ({formatMesLabel(dashboard?.mes)})</p>
                <h2 className="text-3xl font-extrabold text-[#F5F7FB] mt-1">
                  {formatPeso(balance)}
                </h2>
              </div>

              {/* Badge de Alerta Dinámico */}
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${clasesBadge}`}>
                {iconoAlerta}
                {textoAlerta}
              </span>
            </div>

            {/* Barra de progreso de Presupuesto */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-[#8B949E] mb-1.5 font-medium">
                <span>Gastado: {formatPeso(totalMes)}</span>
                <span>{porcentaje}% del límite</span>
              </div>
              <div className="w-full h-2 bg-[#0F1419] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${clasesBarra}`}
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                />
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#374151]/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-green-500/10 text-green-400">
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#8B949E] font-medium">Ingresos del mes</p>
                  <p className="text-sm font-bold">{formatPeso(0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                  <ArrowDownRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#8B949E] font-medium">Límite fijado</p>
                  <p className="text-sm font-bold">{formatPeso(limiteMes)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* GRÁFICA DE TENDENCIA */}
          <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4 mb-5">
            <h3 className="text-xs font-bold text-[#F5F7FB] mb-3">Historial de Gastos vs Ingresos</h3>
            {tendencia.length === 0 ? (
              <div className="w-full h-44 flex items-center justify-center">
                <p className="text-xs text-neutral-600 font-medium">Sin datos de tendencia</p>
              </div>
            ) : (
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tendencia} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="mes" stroke="#8B949E" fontSize={10} tickLine={false} />
                    <YAxis stroke="#8B949E" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1A1F2F', borderColor: '#374151' }} />
                    <Area type="monotone" dataKey="ingresos" stroke="#3B82F6" fillOpacity={0.05} fill="#3B82F6" strokeWidth={2} />
                    <Area type="monotone" dataKey="gastos"   stroke="#EF4444" fillOpacity={0.05} fill="#EF4444" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* DISTRIBUCIÓN POR CATEGORÍAS */}
          <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4 mb-5 grid grid-cols-12 gap-4 items-center">
            {pieData.length === 0 ? (
              <div className="col-span-12 text-center py-4">
                <p className="text-xs text-neutral-600 font-medium">Sin gastos por categoría este mes</p>
              </div>
            ) : (
              <>
                <div className="col-span-5 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={24}
                        outerRadius={38}
                        paddingAngle={3}
                        dataKey="porcentaje"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold text-neutral-400">Gastos</span>
                  </div>
                </div>

                <div className="col-span-7 space-y-2">
                  {pieData.slice(0, 3).map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-[#8B949E] font-medium truncate">{cat.nombre}</span>
                      </div>
                      <span className="font-bold ml-1">{cat.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ÚLTIMOS GASTOS REGISTRADOS */}
          <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#F5F7FB]">Gastos recientes</h3>
              <button
                onClick={() => navigate('/gastos')}
                className="text-xs text-[#10B981] font-semibold flex items-center hover:underline"
              >
                Ver todos <ChevronRight size={14} />
              </button>
            </div>

            {ultimosGastos.length === 0 ? (
              <p className="text-xs text-neutral-600 text-center py-4 font-medium">
                Aún no tienes gastos registrados.
              </p>
            ) : (
              <div className="divide-y divide-[#374151]/30">
                {ultimosGastos.map((gasto) => (
                  <div key={gasto.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-bold text-[#F5F7FB]">{gasto.nombre}</p>
                      <p className="text-[10px] text-[#8B949E] mt-0.5">
                        {formatHora(gasto.hora)} • {gasto.categoria_nombre || 'Sin categoría'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-red-400">
                      -{formatPeso(gasto.monto)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
