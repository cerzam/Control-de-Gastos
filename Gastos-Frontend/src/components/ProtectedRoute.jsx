import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // Verificamos si existe el token simulado en el almacenamiento del navegador
  const token = localStorage.getItem('token')

  // Si no hay token, lo redirige al login de inmediato
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, permite ver la pantalla protegida
  return children
}