# PLG Capital - Sistema de Crédito

Aplicación web moderna para administrar ventas a crédito, clientes, pagos e inversionistas. Construida con Next.js 16, TypeScript, Tailwind CSS y Supabase.

## 🚀 Quick Start

### Requisitos previos
- Node.js 18+
- npm o yarn
- Acceso a Supabase

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env.local)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Comandos disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run start    # Inicia servidor de producción
npm run lint     # Ejecuta validaciones de código
```

## 🏗️ Arquitectura del proyecto

### Estructura de carpetas

```
credito-app/
├── app/                    # Rutas y layouts de Next.js
│   ├── api/               # Endpoints API
│   ├── dashboard/         # Panel de administración
│   │   ├── caja/          # Movimientos de caja
│   │   ├── clientes/      # Gestión de clientes
│   │   ├── configuracion/ # Configuración general
│   │   ├── pagos/         # Gestión de pagos
│   │   ├── productos/     # Catálogo de productos
│   │   └── ventas/        # Registro de ventas
│   └── login/             # Autenticación
├── components/            # Componentes React reutilizables
│   ├── calculator/        # Calculadora de créditos
│   ├── cash/              # Componentes de caja
│   ├── customers/         # Componentes de clientes
│   ├── dashboard/         # Componentes del panel
│   ├── payments/          # Componentes de pagos
│   ├── sales/             # Componentes de ventas
│   ├── shared/            # Componentes compartidos
│   └── ui/                # Componentes base de UI
├── lib/                   # Funciones y utilidades del servidor
│   ├── supabase/          # Configuración de Supabase
│   ├── cash/              # Lógica de caja
│   ├── payments/          # Lógica de pagos
│   ├── products/          # Lógica de productos
│   ├── sales/             # Lógica de ventas
│   └── customers.ts       # Funciones de clientes
├── types/                 # Tipos de TypeScript
│   └── database.ts        # Tipos de base de datos
├── docs/                  # Documentación técnica
└── public/                # Archivos estáticos
```

## 📦 Stack tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| Next.js | 16 | Framework de React |
| TypeScript | - | Lenguaje tipado |
| Tailwind CSS | - | Estilos utility-first |
| Supabase | - | Backend PostgreSQL + Auth |
| Vercel | - | Hosting y deployment |

## 🔐 Control de acceso

**Solo desarrolladores y administradores** tienen acceso a:
- Módulos de caja (Caja)
- Dashboards administrativos
- Configuración del sistema
- Datos financieros sensibles

Esta restricción se valida en:
- Middleware de autenticación
- Level de API endpoints
- Validaciones en componentes

## 📊 Estado de módulos

### ✅ Funcionales
- **Productos**: Creación, lectura, actualización y eliminación
- **Clientes**: Gestión completa de cliente

### 🟡 En desarrollo
- **Ventas**: Funcionalidad básica implementada
  - Pendiente: Validaciones avanzadas, reportes
- **Pagos**: Funcionalidad base
  - Tabla: `payments`
- **Cuotas**: Estructura inicial
  - Tablas: `sale_installments`, `installments`
  - Requiere: Validación de tabla oficial
- **Caja**: Funcionalidad básica
  - Tabla: `cash_movements`

### ⏳ Pendientes
- **Inversionistas**: Diseño completo
- **Distribución de utilidades**: Diseño completo
- **Dashboard financiero**: En planificación
- **Sistema de reportes**: En planificación

## 🛠️ Reglas de desarrollo

### TypeScript y código
- ✅ Utilizar TypeScript estricto en todos los archivos
- ✅ Reutilizar componentes existentes antes de crear nuevos
- ✅ No crear archivos duplicados
- ✅ Mantener la estructura actual del proyecto

### Base de datos
- ✅ Supabase PostgreSQL
- ✅ Todos los cambios mediante migraciones SQL
- ✅ Nunca modificar tablas manualmente en producción
- ✅ Todas las consultas deben pasar por funciones reutilizables en `lib/`

### Antes de implementar cambios
1. Analizar impacto en otros módulos
2. Identificar archivos afectados
3. Presentar plan de implementación
4. Implementar cambios
5. Ejecutar `npm run build` y corregir errores

## 📚 Documentación adicional

- [database-schema.md](docs/database-schema.md) - Esquema de base de datos
- [business-rules.md](docs/business-rules.md) - Reglas de negocio
- [project-context.md](docs/project-context.md) - Contexto general del proyecto
- [roadmap.md](docs/roadmap.md) - Hoja de ruta

## 🚀 Deployment

El proyecto está configurado para deployar en **Vercel**. Cada push a la rama principal dispara un build automático.

## 📝 Variables de entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Vercel (automático)
VERCEL_ENV=
VERCEL_GIT_COMMIT_SHA=
```
