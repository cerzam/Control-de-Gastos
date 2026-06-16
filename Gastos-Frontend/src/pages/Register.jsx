import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!nombre || !email || !password) {
      setError('Por favor, rellena todos los campos obligatorios.')
      return
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones de privacidad.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', { nombre, email, password })
      const { token, usuario } = res.data.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))
      navigate('/home')
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Este correo ya está registrado.')
      } else {
        setError('Error al registrar, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] flex flex-col items-center justify-center px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#F0F6FC] tracking-tight">GastosClaros</h1>
        <p className="text-[#8B949E] text-sm mt-1">Crea tu cuenta y toma el control hoy mismo</p>
      </div>

      <div className="w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[#F0F6FC] mb-5">Registro</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nombre completo</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="text"
                placeholder="Abraham Cervantes"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Correo electrónico</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="email"
                placeholder="abraham@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field pl-9"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
              className="mt-1 accent-[#1DB954]"
            />
            <label htmlFor="terms" className="text-xs text-[#8B949E] leading-tight">
              Acepto que GastosClaros procese mis datos para la generación de reportes financieros locales.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : <><span>Registrarse</span><ArrowRight size={16} /></>}
          </button>
        </form>
      </div>

      <p className="text-[#8B949E] text-sm mt-6">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-[#1DB954] font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}