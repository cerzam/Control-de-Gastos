// src/pages/Login.jsx  — HU-06: Iniciar sesión con email y contraseña
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// SVG logos inline para evitar dependencias externas
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Completa todos los campos.'); return }

    setLoading(true)
    // Simula autenticación — reemplazar con llamada al API
    setTimeout(() => {
      setLoading(false)
      if (email === 'carlos.mendez@ejemplo.com' && password === '12345678') {
        localStorage.setItem ('token', 'jwt_mock_carlos_2026')
        navigate('/home')
      } else {
        setError('Correo o contraseña incorrectos.')
      }
    }, 900)
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] flex flex-col items-center justify-center px-5 py-10">

      {/* ── Logo y tagline ─────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#F0F6FC] tracking-tight">
          GastosClaros
        </h1>
        <p className="text-[#8B949E] text-sm mt-1">
          Controla tus finanzas personales
        </p>
      </div>

      {/* ── Card de formulario ─────────────────────────────────────────── */}
      <div className="w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-6">

        <h2 className="text-xl font-bold text-[#F0F6FC] mb-1">Iniciar sesión</h2>
        <p className="text-[#8B949E] text-sm mb-6">Accede a tu cuenta personal</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          text-xs rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="form-label">Correo electrónico</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="email"
                placeholder="carlos.mendez@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field pl-9"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="form-label">Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#F0F6FC]"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <button type="button" className="text-[#1DB954] text-xs hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#30363D]" />
          <span className="text-[#8B949E] text-xs">o continua con</span>
          <div className="flex-1 h-px bg-[#30363D]" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary">
            <GoogleIcon /> Google
          </button>
          <button className="btn-secondary">
            <GithubIcon /> GitHub
          </button>
        </div>
      </div>

      {/* Registro */}
      <p className="text-[#8B949E] text-sm mt-6">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-[#1DB954] font-medium hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}