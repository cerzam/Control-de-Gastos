import React, { useState } from 'react'
import { 
  Search, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Utensils, 
  Car, 
  Home as HomeIcon, 
  Zap, 
  Gamepad2, 
  Heart, 
  BookOpen, 
  ShoppingCart 
} from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { todosLosGastos, CATEGORIAS } from '../mocks/gastosMock'

// Helper de formato consistente en pesos ($)
const formatPeso = (val) => `$${Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

// Definición de los filtros horizontales deslizables (Figma Match)
const FILTROS_CATEGORIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'alimentacion', label: 'Alimentación' },
  { id: 'transporte', label: 'Transporte' },
  { id: 'vivienda', label: 'Vivienda' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'entrete', label: 'Entrete.' },
  { id: 'salud', label: 'Salud' },
  { id: 'educacion', label: 'Educación' },
  { id: 'compras', label: 'Compras' },
]

export default function Gastos() {
  const [busqueda, setBusqueda] = useState('')
  const [catSeleccionada, setCatSeleccionada] = useState('todas') 
  const [showFilters, setShowFilters] = useState(false) // ← ¡Controlador dinámico del estado del filtro!

  // 1. DOBLE FILTRADO: Texto (búsqueda) + Píldora de Categoría activa
  const gastosFiltrados = todosLosGastos.filter(gasto => {
    const coincideTexto = gasto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = catSeleccionada === 'todas' || gasto.categoria === catSeleccionada
    return coincideTexto && coincideCategoria
  })

  // 2. Cálculo del total acumulado de las transacciones filtradas
  const totalGeneralFiltrado = gastosFiltrados.reduce((acc, current) => acc + current.monto, 0)

  // Mapeo de iconos
  const getIconoComponente = (catId) => {
    switch (catId) {
      case 'alimentacion': return <Utensils size={18} />
      case 'transporte': return <Car size={18} />
      case 'vivienda': return <HomeIcon size={18} />
      case 'servicios': return <Zap size={18} />
      case 'entrete': return <Gamepad2 size={18} />
      case 'salud': return <Heart size={18} />
      case 'educacion': return <BookOpen size={18} />
      case 'compras': return <ShoppingCart size={18} />
      default: return <Utensils size={18} />
    }
  }

  // 3. Agrupación estructurada (HOY, AYER, etc.)
  const agruparGastosPorFechaVisual = (lista) => {
    const grupos = {}
    lista.forEach(g => {
      let labelFecha = g.fecha
      if (g.fecha === '2026-06-15') labelFecha = 'HOY'
      else if (g.fecha === '2026-06-14') labelFecha = 'AYER'
      else if (g.fecha === '2026-06-12') labelFecha = 'VIERNES, 12 JUN'
      else {
        const [, mes, dia] = g.fecha.split('-')
        const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
        labelFecha = `${parseInt(dia)} ${meses[parseInt(mes) - 1]}`
      }

      if (!grupos[labelFecha]) {
        grupos[labelFecha] = { titulo: labelFecha, totalDia: 0, items: [] }
      }
      grupos[labelFecha].items.push(g)
      grupos[labelFecha].totalDia += g.monto
    })
    return Object.values(grupos)
  }

  const bloquesDeGastos = agruparGastosPorFechaVisual(gastosFiltrados)

  return (
    <div className="h-full bg-[#0F1419] text-[#F5F7FB] pb-32 pt-4 px-4 overflow-y-auto select-none">
      
      {/* ── HEADER SUPERIOR Y BOTONES DE ACCIÓN ─────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Mis Gastos</h1>
        <div className="flex items-center gap-3.5">
          <button className="p-1 text-neutral-400 hover:opacity-80 transition-opacity">
            <ArrowUpDown size={18} />
          </button>
          
          {/* ¡Botón modificado para alternar el showFilters al dar clic! */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
    showFilters 
      ? 'bg-[#10B981] text-[#0F1419]' // ← Encendido en verde si están abiertas
      : 'bg-[#1A1F2F] text-[#8B949E] border border-[#374151]/30 hover:border-neutral-500' // ← Apagado si están ocultas
  }`}
          >
            <SlidersHorizontal size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── INPUT DE BÚSQUEDA INPUT FIELD ──────────────────────────── */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Buscar gastos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-[#1A1F2F] border border-[#374151]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F7FB] placeholder-neutral-500 focus:outline-none focus:border-[#10B981] transition-colors"
        />
      </div>

      {/* ── BARRA DESLIZABLE CONDICIONAL DE FILTROS ── */}
      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-none snap-x transition-all duration-300">
          {FILTROS_CATEGORIAS.map(filtro => (
            <button
              key={filtro.id}
              onClick={() => setCatSeleccionada(filtro.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                catSeleccionada === filtro.id 
                  ? 'bg-[#10B981] text-[#0F1419]' 
                  : 'bg-[#1A1F2F] text-neutral-400 border border-[#374151]/20 hover:border-neutral-500'
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      )}

      {/* ── METRICAS RESUMEN DE TRANSACCIONES CONTADAS ───────────────── */}
      <div className="flex justify-between items-center text-[11px] font-medium text-neutral-400 mb-4 px-0.5">
        <span>
          {gastosFiltrados.length} transacciones
        </span>
        <div className="space-x-1">
          <span>Total:</span>
          <span className="text-[#EF4444] font-bold text-xs">
            {formatPeso(totalGeneralFiltrado)}
          </span>
        </div>
      </div>

      {/* ── SECCIONES AGRUPADAS POR FECHA ────────────────────────────── */}
      <div className="space-y-5">
        {bloquesDeGastos.map((bloque) => (
          <div key={bloque.titulo} className="space-y-2.5">
            
            {/* Header del Bloque Diario */}
            <div className="flex justify-between items-center text-[11px] font-bold text-[#8B949E] tracking-wider px-0.5">
              <span>{bloque.titulo}</span>
              <span className="font-semibold text-xs text-[#8B949E]/80">
                {formatPeso(bloque.totalDia)}
              </span>
            </div>

            {/* Listado de tarjetas de transacción en este día */}
            <div className="space-y-2.5">
              {bloque.items.map((gasto) => {
                const metaCategoria = CATEGORIAS.find(c => c.id === gasto.categoria) || CATEGORIAS[0]
                
                return (
                  <div 
                    key={gasto.id} 
                    className="w-full bg-[#1A1F2F] border border-[#374151]/10 rounded-xl p-3.5 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                        style={{ 
                          backgroundColor: `${metaCategoria.color}25`, 
                          color: metaCategoria.color 
                        }}
                      >
                        {getIconoComponente(gasto.categoria)}
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-[#F5F7FB] tracking-tight leading-tight mb-0.5">
                          {gasto.nombre}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#8B949E] font-medium">
                          <span style={{ color: metaCategoria.color }}>
                            {metaCategoria.label || gasto.categoria}
                          </span>
                          {gasto.nota && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[130px] font-normal text-[#8B949E]/70">
                                {gasto.nota}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#EF4444] tracking-tight">
                      -{formatPeso(gasto.monto)}
                    </span>
                  </div>
                )
              })}
            </div>

          </div>
        ))}

        {/* Mensaje de estado vacío */}
        {bloquesDeGastos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xs text-neutral-500 font-medium">No se encontraron transacciones en esta categoría.</p>
          </div>
        )}
      </div>

      {/* Menú Global Inferior Compartido */}
      <BottomNav />
    </div>
  )
}