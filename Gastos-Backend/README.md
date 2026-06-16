# Control de Gastos — Backend API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

API REST para la aplicación de control de gastos personales. Permite registrar y gestionar gastos, categorías y presupuestos mensuales con autenticación por usuario.

---

## 📋 Tabla de contenidos

- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y configuración](#-instalación-y-configuración)
- [Variables de entorno](#-variables-de-entorno)
- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Endpoints](#-endpoints)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Esquema de base de datos](#-esquema-de-base-de-datos)
- [Equipo](#-equipo)

---

## 🛠 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Entorno de ejecución |
| Express | 4.19.2 | Framework HTTP |
| pg | 8.12.0 | Cliente PostgreSQL |
| Supabase | — | Base de datos en la nube (PostgreSQL) |
| jsonwebtoken | 9.0.2 | Autenticación con JWT |
| bcryptjs | 2.4.3 | Hash de contraseñas |
| dotenv | 16.4.5 | Variables de entorno |
| cors | 2.8.5 | Política de acceso entre orígenes |
| nodemon | 3.1.4 | Hot-reload en desarrollo |

---

## ✅ Requisitos previos

- **Node.js** v18 o superior — [descargar](https://nodejs.org)
- **npm** v9 o superior (incluido con Node.js)
- **Cuenta en Supabase** — [supabase.com](https://supabase.com) (plan gratuito disponible)
- El frontend (`Gastos-Frontend`) corriendo en el puerto `5173`

---

## 🚀 Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/cerzam/Control-de-Gastos.git
cd Control-de-Gastos/Gastos-Backend
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver sección [Variables de entorno](#-variables-de-entorno)).

### 4. Inicializa la base de datos

En el **SQL Editor** de tu proyecto en Supabase, ejecuta el contenido del archivo:

```
src/config/schema.sql
```

Esto creará las 4 tablas necesarias: `users`, `categorias`, `gastos` y `presupuestos_mensuales`.

---

## 🔐 Variables de entorno

Copia `.env.example` a `.env` y completa cada valor:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto en el que corre el servidor | `5000` |
| `DATABASE_URL` | Connection string de Supabase (o cualquier PostgreSQL) | `postgresql://postgres.xxxx:PASSWORD@host:5432/postgres` |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT — usa una cadena larga y aleatoria | `mi_clave_super_secreta_2024` |
| `JWT_EXPIRES_IN` | Tiempo de expiración de los tokens | `24h` |
| `FRONTEND_URL` | URL del frontend para la política CORS | `http://localhost:5173` |

> La `DATABASE_URL` se encuentra en tu proyecto de Supabase en:  
> **Project Settings → Database → Connection string → URI**

---

## ▶️ Cómo ejecutar el proyecto

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor quedará disponible en `http://localhost:5000`.  
Puedes verificar que funciona accediendo a `http://localhost:5000/api/health`.

---

## 📡 Endpoints

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o register exitoso.

### 🔑 Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Registra un usuario nuevo y devuelve token |
| `POST` | `/api/auth/login` | No | Autentica un usuario y devuelve token |

**Body register / login:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@correo.com",
  "password": "mi_contraseña"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "usuario": { "id": 1, "nombre": "Juan Pérez", "email": "juan@correo.com", "iniciales": "JP" }
  }
}
```

---

### 💸 Gastos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/gastos` | Sí | Lista todos los gastos del usuario. Acepta query params `?mes=YYYY-MM` y `?categoria_id=` |
| `POST` | `/api/gastos` | Sí | Crea un nuevo gasto |
| `PUT` | `/api/gastos/:id` | Sí | Actualiza un gasto existente |
| `DELETE` | `/api/gastos/:id` | Sí | Elimina un gasto |

**Body POST / PUT:**
```json
{
  "nombre": "Supermercado",
  "categoria_id": 2,
  "monto": 350.50,
  "fecha": "2024-06-15",
  "hora": "14:30:00",
  "metodo_pago": "Tarjeta",
  "nota": "Compra semanal",
  "recurrente": false
}
```

---

### 📊 Dashboard

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/dashboard` | Sí | Resumen del mes: total gastado, presupuesto, gastos por categoría, tendencia de 6 meses y últimos 5 gastos. Acepta `?mes=YYYY-MM` |

---

### 👤 Perfil de usuario

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/usuario/perfil` | Sí | Devuelve los datos del usuario autenticado |
| `PUT` | `/api/usuario/perfil` | Sí | Actualiza nombre y/o contraseña del usuario |

**Body PUT perfil:**
```json
{
  "nombre": "Juan García",
  "password_actual": "contraseña_actual",
  "password_nueva": "nueva_contraseña"
}
```

---

### ⚙️ Configuración — Presupuesto

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/configuracion/presupuesto` | Sí | Devuelve el límite mensual del usuario. Acepta `?mes=YYYY-MM` |
| `PUT` | `/api/configuracion/presupuesto` | Sí | Crea o actualiza el límite mensual (upsert) |

**Body PUT presupuesto:**
```json
{
  "mes": "2024-06",
  "limite_total": 5000.00
}
```

---

### 🏷️ Categorías

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/categorias` | Sí | Lista las categorías del usuario |
| `POST` | `/api/categorias` | Sí | Crea una nueva categoría |
| `DELETE` | `/api/categorias/:id` | Sí | Elimina una categoría |

**Body POST categoría:**
```json
{
  "nombre": "Alimentación",
  "color": "#4CAF50",
  "icono": "🛒"
}
```

---

### Formato de respuesta

Todos los endpoints responden en el mismo formato:

```json
{ "success": true, "data": { ... } }
```
```json
{ "success": false, "message": "Descripción del error" }
```

---

## 📁 Estructura del proyecto

```
Gastos-Backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Conexión al pool de PostgreSQL via DATABASE_URL
│   │   └── schema.sql         # DDL para crear las 4 tablas en Supabase
│   ├── middlewares/
│   │   └── authMiddleware.js  # Verifica el token JWT e inyecta req.user.id
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/register y /login
│   │   ├── gastos.js          # CRUD /api/gastos
│   │   ├── categorias.js      # CRUD /api/categorias
│   │   ├── dashboard.js       # GET /api/dashboard
│   │   └── configuracion.js   # /api/usuario/perfil y /api/configuracion/presupuesto
│   ├── controllers/
│   │   ├── authController.js          # Lógica de registro y login
│   │   ├── gastosController.js        # Lógica CRUD de gastos
│   │   ├── categoriasController.js    # Lógica CRUD de categorías
│   │   ├── dashboardController.js     # Agrega métricas del mes en paralelo
│   │   └── configuracionController.js # Perfil de usuario y presupuesto mensual
│   └── index.js               # Entry point: Express, CORS, rutas
├── .env.example               # Plantilla de variables de entorno
├── .gitignore                 # Ignora node_modules y .env
└── package.json
```

---

## 🗄 Esquema de base de datos

### `users`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | Identificador único |
| `nombre` | VARCHAR(100) | Nombre completo |
| `email` | VARCHAR(150) UNIQUE | Correo electrónico (único) |
| `password_hash` | VARCHAR(255) | Contraseña hasheada con bcrypt |
| `iniciales` | VARCHAR(5) | Iniciales generadas automáticamente |
| `created_at` | TIMESTAMP | Fecha de registro |

### `categorias`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | Identificador único |
| `user_id` | INT FK → users | Usuario propietario |
| `nombre` | VARCHAR(100) | Nombre de la categoría |
| `color` | VARCHAR(20) | Color en hex (ej. `#4CAF50`) |
| `icono` | VARCHAR(50) | Emoji o nombre de icono |

### `gastos`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | Identificador único |
| `user_id` | INT FK → users | Usuario propietario |
| `nombre` | VARCHAR(200) | Descripción del gasto |
| `categoria_id` | INT FK → categorias | Categoría asignada (nullable) |
| `monto` | DECIMAL(12,2) | Importe del gasto |
| `fecha` | DATE | Fecha del gasto |
| `hora` | TIME | Hora del gasto (nullable) |
| `metodo_pago` | VARCHAR(50) | Efectivo, Tarjeta, etc. (nullable) |
| `nota` | TEXT | Observación adicional (nullable) |
| `recurrente` | BOOLEAN | Indica si el gasto se repite |
| `created_at` | TIMESTAMP | Fecha de registro |

### `presupuestos_mensuales`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | Identificador único |
| `user_id` | INT FK → users | Usuario propietario |
| `mes` | VARCHAR(7) | Mes en formato `YYYY-MM` |
| `limite_total` | DECIMAL(12,2) | Límite de gasto para ese mes |

> Restricción única en `(user_id, mes)` — solo un presupuesto por usuario por mes.

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
