# GastosClaros — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18-5A29E4?style=flat-square&logo=axios&logoColor=white)

Interfaz web para la aplicación de control de gastos personales **GastosClaros**. Permite a los usuarios registrarse, iniciar sesión y gestionar sus gastos, categorías y presupuesto mensual desde una UI mobile-first.

---

## 📋 Tabla de contenidos

- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y configuración](#-instalación-y-configuración)
- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Verificación y prueba](#-verificación-y-prueba)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Conexión con el backend](#-conexión-con-el-backend)
- [Equipo](#-equipo)

---

## 🛠 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.0 | Biblioteca de UI |
| Vite | 6.0 | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.0 | Estilos utilitarios |
| React Router DOM | 6.28 | Enrutamiento SPA |
| Axios | 1.18 | Cliente HTTP para el backend |
| Recharts | 2.15 | Gráficas de gastos y tendencias |
| Lucide React | 0.400 | Iconografía |

---

## ✅ Requisitos previos

- **Node.js** v18 o superior — [descargar](https://nodejs.org)
- **npm** v9 o superior (incluido con Node.js)
- El **backend** (`Gastos-Backend`) corriendo en `http://localhost:5000` antes de iniciar el frontend

---

## 🚀 Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/cerzam/Control-de-Gastos.git
cd Control-de-Gastos/Gastos-Frontend
```

### 2. Instala las dependencias

```bash
npm install
```

No se requiere archivo `.env` — la URL del backend está configurada directamente en `src/api/axios.js`. Si necesitas apuntar a un backend distinto, edita la propiedad `baseURL` en ese archivo.

---

## ▶️ Cómo ejecutar el proyecto

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

### Build de producción

```bash
npm run build       # genera la carpeta dist/
npm run preview     # sirve el build localmente para revisión
```

---

## 🧪 Verificación y prueba

### Lista de comprobación antes de iniciar

Antes de abrir el navegador, confirma que:

- [ ] Ejecutaste `npm install` en esta carpeta
- [ ] El backend está corriendo (`npm run dev` en `Gastos-Backend`) y responde en `http://localhost:5000/api/health`
- [ ] La base de datos Supabase ya tiene las tablas creadas (`schema.sql`)

### Prueba de registro (primera vez)

1. Abre `http://localhost:5173` — debe redirigir automáticamente a `/login`
2. Haz clic en **Regístrate gratis** para ir a `/register`
3. Completa nombre, correo, contraseña y acepta los términos
4. Si el registro es exitoso, serás redirigido a `/home` automáticamente
5. Abre las DevTools → Application → Local Storage → `localhost:5173` y confirma que existen las keys `token` y `user`

### Prueba de inicio de sesión

1. Borra el `token` y `user` de Local Storage (o abre una ventana de incógnito)
2. Ve a `http://localhost:5173/login`
3. Ingresa el correo y contraseña del usuario registrado
4. Tras el login exitoso debes llegar a `/home`
5. Intenta acceder directamente a `/home` sin token — debes ser redirigido a `/login`

### Prueba de ruta protegida

```
# Con sesión activa → permite el acceso
http://localhost:5173/home      ✓

# Sin token en localStorage → redirige a login
http://localhost:5173/home      → /login
```

### Otros comandos útiles

```bash
npm run lint      # revisa errores de estilo con ESLint
npm run build     # compila para producción en dist/
npm run preview   # sirve el build de dist/ en http://localhost:4173
```

---

## 📁 Estructura del proyecto

```
Gastos-Frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js            # Instancia de Axios con baseURL apuntando al backend
│   │                           # e interceptor que inyecta el JWT en cada petición
│   │
│   ├── assets/                 # Imágenes y recursos estáticos
│   │
│   ├── components/
│   │   ├── BottomNav.jsx       # Barra de navegación inferior (mobile-first)
│   │   │                       # con enlaces a Home, Gastos, Nuevo gasto y Ajustes
│   │   └── ProtectedRoute.jsx  # Guard de ruta: verifica que exista un JWT válido
│   │                           # en localStorage; redirige a /login si no hay sesión
│   │
│   ├── mocks/
│   │   └── gastosMock.js       # Datos de ejemplo para desarrollo sin backend activo;
│   │                           # se reemplaza progresivamente con llamadas reales a la API
│   │
│   ├── pages/
│   │   ├── Login.jsx           # Pantalla de inicio de sesión
│   │   │                       # POST /api/auth/login → guarda token y usuario en localStorage
│   │   ├── Register.jsx        # Pantalla de registro de cuenta nueva
│   │   │                       # POST /api/auth/register → guarda token y usuario en localStorage
│   │   ├── Home.jsx            # Dashboard principal con resumen del mes,
│   │   │                       # gráficas de tendencia y gastos recientes
│   │   ├── Gastos.jsx          # Listado completo de gastos con filtros por mes y categoría
│   │   ├── NuevoGasto.jsx      # Formulario para registrar un gasto nuevo
│   │   └── Ajustes.jsx         # Configuración de perfil y presupuesto mensual
│   │
│   ├── App.jsx                 # Definición del árbol de rutas con React Router
│   ├── App.css                 # Estilos globales complementarios a Tailwind
│   ├── index.css               # Importación de Tailwind CSS y variables base
│   └── main.jsx                # Entry point: monta <App /> en el DOM
│
├── index.html
├── vite.config.js
├── package.json
└── eslint.config.js
```

---

## 🔗 Conexión con el backend

Todas las peticiones HTTP pasan por `src/api/axios.js`, que centraliza:

- **`baseURL`** apuntando a `http://localhost:5000/api`
- Un **interceptor de request** que lee el token de `localStorage` e inyecta el header `Authorization: Bearer <token>` automáticamente en cada llamada protegida

Las páginas `Login.jsx` y `Register.jsx` ya están conectadas al backend real. El resto de páginas consumen datos desde `mocks/gastosMock.js` mientras se completa la integración.

### Flujo de autenticación

```
Usuario llena formulario
        ↓
POST /api/auth/login  o  POST /api/auth/register
        ↓
Backend devuelve { token, usuario }
        ↓
localStorage.setItem('token', token)
localStorage.setItem('user',  JSON.stringify(usuario))
        ↓
navigate('/home')   →   ProtectedRoute lo deja pasar
```

### Rutas de la SPA

| Ruta | Componente | Protegida |
|---|---|---|
| `/login` | `Login.jsx` | No |
| `/register` | `Register.jsx` | No |
| `/home` | `Home.jsx` | Sí |
| `/gastos` | `Gastos.jsx` | Sí |
| `/nuevo-gasto` | `NuevoGasto.jsx` | Sí |
| `/ajustes` | `Ajustes.jsx` | Sí |

---

## 👥 Equipo

Proyecto desarrollado para la materia **Equipos de Alto Rendimiento**.

| Integrante | Rol |
|---|---|
| Ciro | Product Owner |
| Carlos | Diseño UI/UX |
| Abraham | Frontend (React + Vite) |
| Landeta | Backend (Node.js + Express) |
| Axel | Backend (Node.js + Express) |
| Oscar Yael | QA |
