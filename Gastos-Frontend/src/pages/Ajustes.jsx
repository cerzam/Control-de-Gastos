import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Shield, CreditCard, BellRing, LogOut, ChevronRight, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import api from '../api/axios.js'

const COLORES_PRESET = [
  '#10B981', '#3B82F6', '#8B5CF6', '#EF4444',
  '#F59E0B', '#EC4899', '#06B6D4', '#F97316',
]

const ICONOS_PRESET = [
  { nombre: 'Utensils',     emoji: '🍽️' },
  { nombre: 'Car',          emoji: '🚗' },
  { nombre: 'Home',         emoji: '🏠' },
  { nombre: 'Zap',          emoji: '⚡' },
  { nombre: 'Gamepad2',     emoji: '🎮' },
  { nombre: 'Heart',        emoji: '❤️' },
  { nombre: 'BookOpen',     emoji: '📚' },
  { nombre: 'ShoppingCart', emoji: '🛒' },
]

export default function Ajustes() {
  const navigate = useNavigate()

  // ── Perfil ────────────────────────────────────────────────────────
  const [perfil, setPerfil] = useState({ nombre: '', email: '', iniciales: '' })
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [nombreEditado, setNombreEditado] = useState('')
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState('')

  // ── Presupuesto ───────────────────────────────────────────────────
  const [presupuesto, setPresupuesto] = useState('')
  const [loadingPresupuesto, setLoadingPresupuesto] = useState(false)
  const [presupuestoOk, setPresupuestoOk] = useState(false)
  const [errorPresupuesto, setErrorPresupuesto] = useState('')

  // ── Categorías ────────────────────────────────────────────────────
  const [categorias, setCategorias] = useState([])
  const [nuevaCatNombre, setNuevaCatNombre] = useState('')
  const [nuevaCatColor, setNuevaCatColor] = useState('#10B981')
  const [nuevaCatIcono, setNuevaCatIcono] = useState('Utensils')
  const [errorCat, setErrorCat] = useState('')
  const [loadingCat, setLoadingCat] = useState(false)

  // ── Carga inicial de los tres recursos ───────────────────────────
  useEffect(() => {
    api.get('/usuario/perfil')
      .then(res => setPerfil(res.data.data))
      .catch(() => {})

    api.get('/configuracion/presupuesto')
      .then(res => {
        const val = res.data.data?.limite_total
        // limite_total: 0 significa sin presupuesto configurado
        setPresupuesto(val && Number(val) !== 0 ? String(val) : '')
      })
      .catch(() => {})

    api.get('/categorias')
      .then(res => setCategorias(res.data.data))
      .catch(() => {})
  }, [])

  // ── Logout (ya implementado, no modificar) ────────────────────────
  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // ── Guardar presupuesto ───────────────────────────────────────────
  const handleGuardarPresupuesto = async () => {
    const valor = parseFloat(presupuesto)
    if (!presupuesto || isNaN(valor) || valor <= 0) {
      setErrorPresupuesto('Ingresa un valor mayor a 0')
      return
    }
    setErrorPresupuesto('')
    setLoadingPresupuesto(true)
    try {
      const mes = new Date().toISOString().substring(0, 7)
      await api.put('/configuracion/presupuesto', { mes, limite_total: valor })
      setPresupuestoOk(true)
      setTimeout(() => setPresupuestoOk(false), 2000)
    } catch (err) {
      setErrorPresupuesto(err.response?.data?.message || 'Error al guardar el presupuesto')
    } finally {
      setLoadingPresupuesto(false)
    }
  }

  // ── Editar nombre del perfil ──────────────────────────────────────
  const handleEditarPerfil = () => {
    setNombreEditado(perfil.nombre)
    setErrorPerfil('')
    setEditandoPerfil(true)
  }

  const handleGuardarPerfil = async () => {
    if (!nombreEditado.trim()) {
      setErrorPerfil('El nombre es requerido')
      return
    }
    setLoadingPerfil(true)
    setErrorPerfil('')
    try {
      const res = await api.put('/usuario/perfil', { nombre: nombreEditado.trim() })
      setPerfil(res.data.data)
      setEditandoPerfil(false)
    } catch (err) {
      setErrorPerfil(err.response?.data?.message || 'Error al actualizar el perfil')
    } finally {
      setLoadingPerfil(false)
    }
  }

  // ── Crear categoría ───────────────────────────────────────────────
  const handleCrearCategoria = async () => {
    if (!nuevaCatNombre.trim()) {
      setErrorCat('El nombre es requerido')
      return
    }
    setErrorCat('')
    setLoadingCat(true)
    try {
      const res = await api.post('/categorias', {
        nombre: nuevaCatNombre.trim(),
        color:  nuevaCatColor,
        icono:  nuevaCatIcono,
      })
      setCategorias(prev => [...prev, res.data.data])
      setNuevaCatNombre('')
    } catch (err) {
      setErrorCat(err.response?.data?.message || 'Error al crear la categoría')
    } finally {
      setLoadingCat(false)
    }
  }

  // ── Eliminar categoría ────────────────────────────────────────────
  const handleEliminarCategoria = async (id) => {
    try {
      await api.delete(`/categorias/${id}`)
      setCategorias(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      if (err.response?.status === 409) {
        alert('No puedes eliminar una categoría con gastos asociados')
      } else {
        alert('No se pudo eliminar la categoría. Intenta nuevamente.')
      }
    }
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
          {perfil.iniciales || '??'}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-white tracking-tight">{perfil.nombre || '...'}</h2>
            <CheckCircle2 size={13} className="text-[#10B981]" fill="#10B981" />
          </div>
          <p className="text-xs text-[#8B949E] font-medium mt-0.5">{perfil.email || '...'}</p>
          <span className="inline-block bg-[#10B981]/10 text-[#10B981] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#10B981]/20 mt-2">
            Tech Lead Developer
          </span>
        </div>
      </div>

      {/* ── EDICIÓN DE NOMBRE (visible solo cuando editandoPerfil=true) ── */}
      {editandoPerfil && (
        <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4 mb-6">
          <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-2">
            Editar nombre
          </label>
          <input
            type="text"
            value={nombreEditado}
            onChange={e => setNombreEditado(e.target.value)}
            className="w-full bg-[#0F1419] border border-[#374151]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#10B981] mb-2"
          />
          {errorPerfil && <p className="text-xs text-[#EF4444] mb-2">{errorPerfil}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleGuardarPerfil}
              disabled={loadingPerfil}
              className="flex-1 bg-[#10B981] text-[#0F1419] font-bold text-[11px] px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingPerfil ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={() => setEditandoPerfil(false)}
              className="px-4 py-2 rounded-xl border border-[#374151]/40 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── PRESUPUESTO MENSUAL (HU-16) ───────────────────────────── */}
      <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4 mb-6">
        <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-2">
          Definir Presupuesto Mensual (HU-16 CA-1)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={presupuesto}
            onChange={e => { setPresupuesto(e.target.value); setErrorPresupuesto('') }}
            placeholder="$ Configura tu meta"
            className="flex-1 bg-[#0F1419] border border-[#374151]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
          />
          <button
            onClick={handleGuardarPresupuesto}
            disabled={loadingPresupuesto}
            className="bg-[#10B981] text-[#0F1419] font-bold text-[11px] px-4 rounded-xl uppercase tracking-wider cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingPresupuesto ? '...' : presupuestoOk ? '✓ Listo' : 'Establecer'}
          </button>
        </div>
        {errorPresupuesto && (
          <p className="text-xs text-[#EF4444] mt-1.5">{errorPresupuesto}</p>
        )}
      </div>

      {/* ── GESTIÓN DE CATEGORÍAS (HU-15) ─────────────────────────── */}
      <div className="bg-[#1A1F2F] border border-[#374151]/20 rounded-2xl p-4 mb-6">
        <p className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-3">
          Mis categorías
        </p>

        {/* Lista de categorías existentes */}
        {categorias.length === 0 ? (
          <p className="text-xs text-neutral-600 text-center py-2 mb-3">Sin categorías creadas</p>
        ) : (
          <div className="space-y-1.5 mb-3">
            {categorias.map(cat => (
              <div key={cat.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || '#8B949E' }}
                  />
                  <span className="text-xs font-semibold text-neutral-200">{cat.nombre}</span>
                </div>
                <button
                  onClick={() => handleEliminarCategoria(cat.id)}
                  className="p-1 text-neutral-600 hover:text-[#EF4444] transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para nueva categoría */}
        <div className="border-t border-[#374151]/20 pt-3 space-y-2">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nuevaCatNombre}
            onChange={e => { setNuevaCatNombre(e.target.value); setErrorCat('') }}
            className="w-full bg-[#0F1419] border border-[#374151]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
          />

          {/* Selector de color */}
          <div className="flex gap-1.5">
            {COLORES_PRESET.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNuevaCatColor(color)}
                className={`w-6 h-6 rounded-full flex-shrink-0 transition-all cursor-pointer ${
                  nuevaCatColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1A1F2F] scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Selector de ícono */}
          <div className="flex gap-1.5 flex-wrap">
            {ICONOS_PRESET.map(({ nombre, emoji }) => (
              <button
                key={nombre}
                type="button"
                onClick={() => setNuevaCatIcono(nombre)}
                className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center cursor-pointer transition-all ${
                  nuevaCatIcono === nombre
                    ? 'bg-[#10B981]/20 ring-1 ring-[#10B981]'
                    : 'bg-[#0F1419] hover:bg-[#0F1419]/80'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {errorCat && <p className="text-xs text-[#EF4444]">{errorCat}</p>}

          <button
            onClick={handleCrearCategoria}
            disabled={loadingCat}
            className="w-full flex items-center justify-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-bold text-[11px] px-4 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer hover:bg-[#10B981]/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus size={13} />
            {loadingCat ? 'Creando...' : 'Nueva categoría'}
          </button>
        </div>
      </div>

      {/* ── SECCIÓN DE OPCIONES DE MENÚ ──────────────────────────────── */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider px-1">Ajustes de cuenta</p>

        <div className="bg-[#1A1F2F]/60 border border-[#374151]/10 rounded-2xl divide-y divide-[#374151]/20 overflow-hidden">

          <button
            onClick={handleEditarPerfil}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1A1F2F] transition-colors text-left cursor-pointer"
          >
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
