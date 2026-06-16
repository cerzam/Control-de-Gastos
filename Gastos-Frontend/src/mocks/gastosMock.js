// src/mocks/gastosMock.js
// ─────────────────────────────────────────────────────────────────────────────
// Fuente única de datos simulados para GastosClaros MVP
// Sustituir por llamadas reales al API de Landeta y Axel cuando esté listo.
// ─────────────────────────────────────────────────────────────────────────────

// ── USUARIO ──────────────────────────────────────────────────────────────────
export const usuarioActual = {
  id:        'usr_001',
  nombre:    'Carlos Méndez',
  email:     'carlos.mendez@ejemplo.com',
  iniciales: 'CM',
}

// ── PRESUPUESTO Y BALANCE (HU-16, HU-17) ────────────────────────────────────
export const presupuestoMes = {
  mes:                'Junio',
  anio:               2026,
  limiteTotal:        5000.00,
  gastadoTotal:       4420.00,
  ingresos:           6500.00,
  balanceDisponible:  2080.00,
  porcentajeGastado:  88,
  estadoAlerta:       'cuidado',   // 'ok' | 'cuidado' | 'peligro'
  umbralAlerta:       80,
  ingresosVsMayo:     12,          // +12%
  gastosVsMayo:       15,          // -15% (reducción)
}

// ── CATEGORÍAS con colores únicos (HU-18, NuevoGasto) ───────────────────────
export const CATEGORIAS = [
  { id: 'alimentacion',    label: 'Alimentación', icono: 'Utensils',     color: '#1DB954', colorBg: 'bg-green-500/15',  colorText: 'text-green-400'  },
  { id: 'transporte',      label: 'Transporte',   icono: 'Car',          color: '#3B82F6', colorBg: 'bg-blue-500/15',   colorText: 'text-blue-400'   },
  { id: 'vivienda',        label: 'Vivienda',     icono: 'Home',         color: '#8B5CF6', colorBg: 'bg-purple-500/15', colorText: 'text-purple-400' },
  { id: 'servicios',       label: 'Servicios',    icono: 'Zap',          color: '#EF4444', colorBg: 'bg-red-500/15',    colorText: 'text-red-400'    },
  { id: 'entretenimiento', label: 'Entrete.',     icono: 'Gamepad2',     color: '#F59E0B', colorBg: 'bg-amber-500/15',  colorText: 'text-amber-400'  },
  { id: 'salud',           label: 'Salud',        icono: 'Heart',        color: '#EC4899', colorBg: 'bg-pink-500/15',   colorText: 'text-pink-400'   },
  { id: 'educacion',       label: 'Educación',    icono: 'BookOpen',     color: '#06B6D4', colorBg: 'bg-cyan-500/15',   colorText: 'text-cyan-400'   },
  { id: 'compras',         label: 'Compras',      icono: 'ShoppingCart', color: '#F97316', colorBg: 'bg-orange-500/15', colorText: 'text-orange-400' },
]

export function getCat(id) {
  return CATEGORIAS.find(c => c.id === id) ?? CATEGORIAS[0]
}

// ── TODOS LOS GASTOS del mes (agrupados para Mis Gastos) ────────────────────
export const todosLosGastos = [
  // HOY — 15 Jun
  { id: 'g001', nombre: 'Mercado La Colonia', categoria: 'alimentacion', nota: 'Compras semanales',  monto: 145.50, fecha: '2026-06-15', hora: '14:23', metodoPago: 'debito',    recurrente: false },
  { id: 'g002', nombre: 'Gasolinera Puma',    categoria: 'transporte',   nota: '',                   monto: 80.00,  fecha: '2026-06-15', hora: '10:15', metodoPago: 'debito',    recurrente: false },

  // AYER — 14 Jun
  { id: 'g003', nombre: 'Restaurante El Mesón', categoria: 'alimentacion', nota: 'Cena con familia', monto: 320.00, fecha: '2026-06-14', hora: '20:47', metodoPago: 'credito',   recurrente: false },
  { id: 'g004', nombre: 'Alquiler Junio',        categoria: 'vivienda',     nota: '',                 monto: 1800.00,fecha: '2026-06-14', hora: '09:00', metodoPago: 'transferencia', recurrente: true },

  // VIERNES — 12 Jun
  { id: 'g005', nombre: 'CNFL Electricidad', categoria: 'servicios',       nota: '',                monto: 48.30,  fecha: '2026-06-12', hora: '08:00', metodoPago: 'debito',    recurrente: true  },
  { id: 'g006', nombre: 'Netflix',           categoria: 'entretenimiento', nota: 'Suscripción mensual', monto: 15.99, fecha: '2026-06-12', hora: '00:00', metodoPago: 'credito', recurrente: true  },

  // JUEVES — 11 Jun
  { id: 'g007', nombre: 'Farmacia Fischel', categoria: 'salud',    nota: 'Medicamentos',    monto: 62.50, fecha: '2026-06-11', hora: '16:30', metodoPago: 'efectivo',  recurrente: false },

  // MÁS ATRÁS
  { id: 'g008', nombre: 'Uber',             categoria: 'transporte',   nota: 'Viaje aeropuerto', monto: 120.00, fecha: '2026-06-10', hora: '07:00', metodoPago: 'debito',   recurrente: false },
  { id: 'g009', nombre: 'Spotify',          categoria: 'entretenimiento', nota: 'Plan familiar', monto: 8.99,  fecha: '2026-06-09', hora: '00:00', metodoPago: 'credito',  recurrente: true  },
  { id: 'g010', nombre: 'UCR Colegiatura',  categoria: 'educacion',    nota: '',               monto: 400.00, fecha: '2026-06-05', hora: '10:00', metodoPago: 'transferencia', recurrente: true },
  { id: 'g011', nombre: 'Supermercado Buen Precio', categoria: 'alimentacion', nota: '',      monto: 230.00, fecha: '2026-06-03', hora: '17:45', metodoPago: 'debito',   recurrente: false },
  { id: 'g012', nombre: 'Librería Universal',       categoria: 'compras',       nota: '',      monto: 189.72, fecha: '2026-06-01', hora: '12:00', metodoPago: 'credito',  recurrente: false },
]

// Últimos 5 para el Dashboard
export const gastosRecientes = todosLosGastos.slice(0, 5)

// ── GRÁFICA POR CATEGORÍA (HU-18) ────────────────────────────────────────────
export const gastosPorCategoria = [
  { id: 'alimentacion',    nombre: 'Alimentación',    porcentaje: 28, color: '#1DB954' },
  { id: 'transporte',      nombre: 'Transporte',      porcentaje: 15, color: '#3B82F6' },
  { id: 'vivienda',        nombre: 'Vivienda',        porcentaje: 41, color: '#8B5CF6' },
  { id: 'entretenimiento', nombre: 'Entretenimiento', porcentaje: 10, color: '#F59E0B' },
  { id: 'servicios',       nombre: 'Servicios',       porcentaje: 6,  color: '#EF4444' },
]

// ── TENDENCIA MENSUAL (E7) ────────────────────────────────────────────────────
export const tendenciaMensual = [
  { mes: 'Ene', ingresos: 5800, gastos: 3900 },
  { mes: 'Feb', ingresos: 6100, gastos: 4100 },
  { mes: 'Mar', ingresos: 6200, gastos: 4300 },
  { mes: 'Abr', ingresos: 6000, gastos: 4000 },
  { mes: 'May', ingresos: 5804, gastos: 5129 },
  { mes: 'Jun', ingresos: 6500, gastos: 4420 },
]

// ── HELPERS ───────────────────────────────────────────────────────────────────
export function formatMoneda(n) {
  return `₡${Number(n).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function etiquetaAlerta(estado) {
  return { ok: 'Al día', cuidado: 'Cuidado', peligro: '¡Peligro!' }[estado] ?? 'Al día'
}

export function classAlerta(estado) {
  return {
    ok:      'bg-green-500/20 text-green-400',
    cuidado: 'bg-yellow-500/20 text-yellow-400',
    peligro: 'bg-red-500/20 text-red-400',
  }[estado] ?? 'bg-gray-500/20 text-gray-400'
}

export function colorBarra(pct) {
  if (pct >= 90) return 'bg-red-500'
  if (pct >= 75) return 'bg-yellow-400'
  return 'bg-[#1DB954]'
}

// Agrupa gastos por fecha para la pantalla Mis Gastos
export function agruparPorFecha(lista) {
  const hoy   = '2026-06-15'
  const ayer  = '2026-06-14'
  const grupos = {}

  lista.forEach(g => {
    let titulo
    if (g.fecha === hoy)   titulo = 'HOY'
    else if (g.fecha === ayer) titulo = 'AYER'
    else {
      const [, mes, dia] = g.fecha.split('-')
      const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
      const diaSemana = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO']
      const d = new Date(g.fecha + 'T12:00:00')
      titulo = `${diaSemana[d.getDay()]}, ${parseInt(dia)} ${meses[parseInt(mes)-1]}`
    }
    if (!grupos[titulo]) grupos[titulo] = { titulo, fecha: g.fecha, items: [] }
    grupos[titulo].items.push(g)
  })

  return Object.values(grupos)
}