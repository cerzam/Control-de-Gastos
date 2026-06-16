  import React from 'react'
  import { Routes, Route, Navigate } from 'react-router-dom'
  import Login       from './pages/Login.jsx'
  import Register    from './pages/Register.jsx'
  import Home        from './pages/Home.jsx'
  import Gastos      from './pages/Gastos.jsx'
  import NuevoGasto  from './pages/NuevoGasto.jsx'
  import Ajustes     from './pages/Ajustes.jsx'
  import ProtectedRoute from './components/ProtectedRoute.jsx'
  export default function App() {
    return (
      // Este contenedor bloquea el ancho en PC para que parezca app de celular centrada
      <div className="min-h-screen bg-[#05070A] flex justify-center items-center">
        <div className="w-full max-w-md min-h-screen bg-[#0F1419] shadow-2xl relative overflow-y-auto border-x border-[#374151]/10">
          <Routes>
            {/* Auth */}
            <Route path="/"          element={<Navigate to="/login" replace />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            {/* App */}
            <Route path="/home"      element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/gastos"    element={<ProtectedRoute><Gastos /></ProtectedRoute>} />
            <Route path="/nuevo"     element={<ProtectedRoute><NuevoGasto /></ProtectedRoute>}/>
            <Route path="/ajustes"   element={<ProtectedRoute><Ajustes /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*"          element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    )
  }