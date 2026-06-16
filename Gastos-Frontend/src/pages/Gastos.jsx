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
  ShoppingCart,
  Pencil,
  Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { todosLosGastos, CATEGORIAS } from '../mocks/gastosMock'

const formatPeso = (val) => `$${Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

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
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [catSeleccionada, setCatSeleccionada] = useState('todas') 
  const [showFilters, setShowFilters] = useState(false)
  const [listaGastosActiva, setListaGastosActiva] = useState(todosLosGastos)

  const handleEliminarGasto = (id, nombre) => {
    const seguro = window.confirm(`¿Estás seguro de que deseas eliminar el gasto "${nombre}"?`)
    if (seguro) {
      setListaGastosActiva(prev => prev.filter(g => g.id !== id))
    }
  }

  const handleEditarGasto = (gasto) => {
    navigate('/nuevo', { state: { editandoGasto: gasto } })
  }

  const gastosFiltrados = listaGastosActiva.filter(gasto => {
    const coincideTexto = gasto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = catSeleccionada === 'todas' || gasto.categoria === catSeleccionada
    return coincideTexto && coincideCategoria
  })

  const totalGeneralFiltrado = gastosFiltrados.reduce((acc, current) => acc + current.monto, 0)

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

  const agruparGastosPorFechaVisual = (lista) => {
    const grupos = {}
    lista.forEach(g => {
      let labelFecha = g.fecha
      if (g.fecha === '2026-06-15') labelFecha = 'HOY'
      else if (g.fecha === '2026-06-14') labelFecha = 'DOMINGO, 14 JUN'
      else if (g.fecha === '2026-06-13') labelFecha = 'SÁBADO, 13 JUN'
      else if (g.fecha === '2026-06-12') labelFecha = 'VIERNES, 12 JUN'
      else if (g.fecha === '2026-06-11') labelFecha = 'JUEVES, 11 JUN'
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
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Mis Gastos</h1>
        <div className="flex items-center gap-3.5">
          <button className="p-1 text-neutral-400"><ArrowUpDown size={18} /></button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
              showFilters ? 'bg-[#10B981] text-[#0F1419]' : 'bg-[#1A1F2F] text-[#8B949E] border border-[#374151]/30'
            }`}
          >
            <SlidersHorizontal size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input type="text" placeholder="Buscar gastos..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-[#1A1F2F] border border-[#374151]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F7FB] placeholder-neutral-500 focus:outline-none focus:border-[#10B981]" />
      </div>

      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-none snap-x">
          {FILTROS_CATEGORIAS.map(filtro => (
            <button key={filtro.id} onClick={() => setCatSeleccionada(filtro.id)} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              catSeleccionada === filtro.id ? 'bg-[#10B981] text-[#0F1419]' : 'bg-[#1A1F2F] text-neutral-400 border border-[#374151]/20'
            }`}>
              {filtro.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-[11px] font-medium text-neutral-400 mb-4 px-0.5">
        <span>{gastosFiltrados.length} transacciones</span>
        <div className="space-x-1">
          <span>Total:</span>
          <span className="text-[#EF4444] font-bold text-xs">{formatPeso(totalGeneralFiltrado)}</span>
        </div>
      </div>

      <div className="space-y-5">
        {bloquesDeGastos.map((bloque) => (
          <div key={bloque.titulo} className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#8B949E] tracking-wider uppercase px-1">
              <span>{bloque.titulo}</span>
              <span className="text-neutral-500 font-semibold">{formatPeso(bloque.totalDia)}</span>
            </div>

            <div className="bg-[#1A1F2F]/40 border border-[#374151]/10 rounded-2xl overflow-hidden divide-y divide-[#374151]/20 shadow-sm">
              {bloque.items.map((gasto) => {
                const metaCategoria = CATEGORIAS.find(c => c.id === gasto.categoria) || CATEGORIAS[0]
                
                return (
                  <div key={gasto.id} className="group p-3.5 flex items-center justify-between hover:bg-[#1A1F2F]/30 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${metaCategoria.color}25`, color: metaCategoria.color }}>
                        {getIconoComponente(gasto.categoria)}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#F5F7FB] truncate">{gasto.nombre}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: `${metaCategoria.color}10`, color: metaCategoria.color, borderColor: `${metaCategoria.color}30` }}>
                            {metaCategoria.label || gasto.categoria}
                          </span>
                          {gasto.nota && (
                            <span className="text-[10px] text-neutral-500 truncate max-w-[120px]">{gasto.nota}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── SECCIÓN CONTENEDORA DE ACCIONES EN EXTREMO DERECHO ── */}
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs font-bold text-[#EF4444] tracking-tight">-{formatPeso(gasto.monto)}</span>
                      
                      {/* Subcontenedor interactivo para los botones con opacidad condicional */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEditarGasto(gasto)} className="p-1 text-neutral-500 hover:text-[#3B82F6] transition-colors cursor-pointer">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleEliminarGasto(gasto.id, gasto.nombre)} className="p-1 text-neutral-500 hover:text-[#EF4444] transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {bloquesDeGastos.length === 0 && (
          <div className="text-center py-12"><p className="text-xs text-neutral-500 font-medium">No se encontraron transacciones.</p></div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}