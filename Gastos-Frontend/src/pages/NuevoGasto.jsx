import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Utensils, Car, Home as HomeIcon, Zap, Gamepad2, Heart, BookOpen, ShoppingCart } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const CATEGORIAS_FORM = [
  { id: 'alimentacion', label: 'Alimentación', icon: Utensils, borderActive: 'border-[#10B981] text-[#10B981] ring-1 ring-[#10B981]/30' },
  { id: 'transporte',   label: 'Transporte',   icon: Car, borderActive: 'border-[#3B82F6] text-[#3B82F6] ring-1 ring-[#3B82F6]/30' },
  { id: 'vivienda',     label: 'Vivienda',     icon: HomeIcon, borderActive: 'border-[#8B5CF6] text-[#8B5CF6] ring-1 ring-[#8B5CF6]/30' },
  { id: 'servicios',    label: 'Servicios',    icon: Zap, borderActive: 'border-[#EF4444] text-[#EF4444] ring-1 ring-[#EF4444]/30' },
  { id: 'entrete',      label: 'Entrete.',      icon: Gamepad2, borderActive: 'border-[#F59E0B] text-[#F59E0B] ring-1 ring-[#F59E0B]/30' },
  { id: 'salud',        label: 'Salud',        icon: Heart, borderActive: 'border-[#EC4899] text-[#EC4899] ring-1 ring-[#EC4899]/30' },
  { id: 'educacion',    label: 'Educación',    icon: BookOpen, borderActive: 'border-[#06B6D4] text-[#06B6D4] ring-1 ring-[#06B6D4]/30' },
  { id: 'compras',      label: 'Compras',      icon: ShoppingCart, borderActive: 'border-[#F97316] text-[#F97316] ring-1 ring-[#F97316]/30' },
]

export default function NuevoGasto() {
  const navigate = useNavigate()
  const [monto, setMonto] = useState('0.00')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('2026-06-15')
  const [categoria, setCategoria] = useState('transporte')
  const [metodoPago, setMetodoPago] = useState('Debito')
  const [nota, setNota] = useState('')
  const [recurrente, setRecurrente] = useState(false)

  return (
    <div className="h-full bg-[#0F1419] text-[#F5F7FB] pb-32 pt-4 px-4 overflow-y-auto select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/home')} className="p-1"><ChevronLeft size={22} /></button>
        <h1 className="text-md font-bold">Nuevo Gasto</h1>
        <button className="p-1"><Camera size={20} /></button>
      </div>

      {/* Monto Hero Display */}
      <div className="w-full bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-5 text-center mb-5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#0F1419]/60 block mb-1">Monto del Gasto</span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-light text-[#0F1419]/60">$</span>
          <input type="text" value={monto} onChange={e => setMonto(e.target.value)} className="bg-transparent text-white text-4xl font-bold text-center focus:outline-none w-44" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-neutral-300">Descripción</label>
          <input type="text" placeholder="ej. Almuerzo en restaurante" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="field" />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 text-neutral-300">Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="field" />
        </div>

        {/* Categorías */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral-300">Categoría</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIAS_FORM.map(cat => {
              const Icon = cat.icon
              const activo = categoria === cat.id
              return (
                <button key={cat.id} type="button" onClick={() => setCategoria(cat.id)} className={`flex flex-col items-center justify-center py-2.5 rounded-xl border aspect-square transition-all ${
                  activo ? cat.borderActive : 'bg-[#1A1F2F] border-[#374151]/30 text-[#8B949E]'
                }`}>
                  <Icon size={18} className="mb-1" />
                  <span className="text-[9px] font-medium tracking-tight">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Métodos de Pago */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral-300">Método de pago</label>
          <div className="grid grid-cols-2 gap-2">
            {['Efectivo', 'Débito', 'Crédito', 'Transferencia'].map(metodo => (
              <button key={metodo} type="button" onClick={() => setMetodoPago(metodo)} className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-medium transition-colors ${
                metodoPago === metodo ? 'bg-[#1A1F2F] border-[#10B981] text-[#10B981]' : 'bg-[#1A1F2F] border-[#374151]/30 text-[#8B949E]'
              }`}>
                {metodo}
                {metodoPago === metodo && <span className="text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Nota Opcional */}
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-neutral-300">Nota (opcional)</label>
          <textarea placeholder="Agrega un detalle adicional..." value={nota} onChange={e => setNota(e.target.value)} className="field h-16 resize-none" />
        </div>

        {/* Switch Recurrente */}
        <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold">Gasto recurrente</p>
            <p className="text-[10px] text-[#8B949E]">Se repetirá mensualmente</p>
          </div>
          <button type="button" onClick={() => setRecurrente(!recurrente)} className={`w-10 h-5 rounded-full relative transition-colors ${recurrente ? 'bg-[#10B981]' : 'bg-neutral-700'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${recurrente ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>

        <button onClick={() => navigate('/home')} className="btn-primary !mt-6">Guardar gasto</button>
      </div>
      <BottomNav />
    </div>
  )
}