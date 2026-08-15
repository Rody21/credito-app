# AGENTS.md - Configuración del Proyecto PLG Capital

## 📌 Descripción del Proyecto

**PLG Capital** es una aplicación web empresarial para administración completa de:
- Ventas a crédito
- Clientes y deudores
- Pagos e instalaciones
- Movimientos de caja
- Inversionistas y distribución de utilidades
- Reportes financieros

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Next.js | 16 |
| Lenguaje | TypeScript | Latest |
| Estilos | Tailwind CSS | Latest |
| Base de Datos | Supabase (PostgreSQL) | Cloud |
| Autenticación | Supabase Auth | Cloud |
| Hosting | Vercel | Cloud |
| Control de versiones | Git | Latest |

## 📁 Estructura del Proyecto

### Raíz
- `CLAUDE.md` - Guía para desarrollo con IA
- `AGENTS.md` - Este archivo
- `README.md` - Documentación de usuario
- `PROJECT_STATE.MD` - Estado actual de módulos
- `tsconfig.json` - Configuración de TypeScript
- `next.config.ts` - Configuración de Next.js
- `tailwind.config.js` - Configuración de Tailwind
- `middleware.ts` - Middleware de Next.js

### Directorios principales

**`app/`** - Rutas de Next.js y API
- `layout.tsx` - Layout raíz
- `page.tsx` - Landing page
- `login/` - Autenticación
- `dashboard/` - Panel administrativo
  - `caja/` - Módulo de caja
  - `clientes/` - Módulo de clientes
  - `configuracion/` - Configuración
  - `pagos/` - Módulo de pagos
  - `productos/` - Módulo de productos
  - `ventas/` - Módulo de ventas
- `api/` - Endpoints API

**`components/`** - Componentes React reutilizables
- `ui/` - Componentes base (Button, Input, Card, etc.)
- `shared/` - Componentes compartidos
- `dashboard/` - Componentes del panel
- `customers/` - Componentes de clientes
- `products/` - Componentes de productos
- `sales/` - Componentes de ventas
- `payments/` - Componentes de pagos
- `cash/` - Componentes de caja
- `calculator/` - Calculadora de créditos
- `landing/` - Componentes de landing

**`lib/`** - Lógica y funciones del servidor
- `supabase/` - Configuración de Supabase
  - `client.ts` - Cliente Supabase
  - `migrations/` - Migraciones SQL
- `auth.ts` - Funciones de autenticación
- `customers.ts` - Operaciones de clientes
- `products/` - Lógica de productos
- `sales/` - Lógica de ventas
- `payments/` - Lógica de pagos
- `cash/` - Lógica de caja
- `server.ts` - Utilidades de servidor
- `utils.ts` - Funciones generales

**`types/`** - Definiciones de tipos
- `database.ts` - Tipos generados de Supabase

**`docs/`** - Documentación técnica
- `database-schema.md` - Esquema de BD
- `business-rules.md` - Reglas de negocio
- `domain-model.md` - Modelo de dominio
- `financial-source-of-truth.md` - Fuente única de verdad
- `project-context.md` - Contexto del proyecto
- `roadmap.md` - Hoja de ruta

## 🔐 Reglas Generales de Desarrollo

### TypeScript y Código
- ✅ **Tipado estricto**: Todos los archivos deben usar TypeScript estricto
- ✅ **Reutilización**: Busca componentes existentes antes de crear nuevos
- ✅ **No duplicar**: Evita archivos y funciones redundantes
- ✅ **Estructura**: Mantén la organización actual del proyecto
- ✅ **Nomenclatura**: Usa nombres descriptivos en inglés para código

### Base de Datos Supabase
- ✅ **SQL únicamente**: Cambios en tablas SIEMPRE mediante migraciones SQL
- ✅ **Nunca manual**: No modificar tablas manualmente en producción
- ✅ **Funciones reutilizables**: Todas las consultas deben pasar por funciones en `lib/`
- ✅ **Tipos autogenerados**: Actualiza tipos de Supabase después de cambios en BD
- ✅ **Transacciones**: Usa transacciones para operaciones críticas

### Seguridad y Acceso
- ✅ **Autenticación**: Todas las rutas requieren validación de usuario
- ✅ **Autorización**: Validar roles/permisos (solo admin, desarrollador)
- ✅ **Datos sensibles**: Caja y reportes solo para personal autorizado
- ✅ **Servidor**: Las operaciones críticas siempre en el servidor

### Eliminar Funcionalidades
- ⛔ **Prohibido**: No eliminar funcionalidades existentes sin aprobación previa
- ⚠️ **Cambios breaking**: Documentar cualquier cambio en API o datos

## 🔄 Proceso de Implementación

### Antes de hacer cambios

1. **Análisis de impacto**
   - ¿Qué módulos se ven afectados?
   - ¿Qué componentes se reutilizan?
   - ¿Hay datos en la BD que cambien?

2. **Identificar archivos**
   - Lista de archivos a modificar
   - Dependencias entre cambios
   - Orden de implementación

3. **Plan de implementación**
   - Descripción de cambios
   - Migraciones SQL necesarias
   - Componentes nuevos o modificados

4. **Implementar cambios**
   - Seguir las reglas de código
   - Hacer commits descriptivos
   - Validar tipos de TypeScript

5. **Validar compilación**
   ```bash
   npm run build    # Debe compilar sin errores
   npm run lint     # No debe tener warnings
   npm run dev      # Debe iniciar correctamente
   ```

## 📊 Estado Actual de Módulos

Ver [PROJECT_STATE.MD](PROJECT_STATE.MD) para detalles completos.

### ✅ Funcionales (Completos)
- **Productos**: Crear, leer, editar, eliminar
- **Clientes**: Gestión completa

### 🟡 En Desarrollo (Parciales)
- **Ventas**: Registro básico → Falta: validaciones, reportes
- **Pagos**: Estructura base → Falta: integraciones, reportes
- **Cuotas**: Tablas identificadas → Falta: clarificar tabla oficial
- **Caja**: Movimientos básicos → Falta: conciliación, reportes

### ⏳ Pendientes (Por diseñar)
- **Inversionistas**: Modelo completo pendiente
- **Distribución de utilidades**: Lógica completa pendiente
- **Dashboard financiero**: Análisis y KPIs
- **Sistema de reportes**: Reportes generales

## 🚀 Comandos Esenciales

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev          # Inicia en http://localhost:3000

# Producción
npm run build        # Compila para prod
npm run start        # Inicia servidor compilado

# Validación
npm run lint         # Valida el código

# Base de datos
# Usar Supabase Dashboard para migraciones SQL
```

## 🌍 Documentación Adicional

- **[README.md](README.md)** - Guía de inicio rápido
- **[CLAUDE.md](CLAUDE.md)** - Instrucciones para desarrollo con IA
- **[database-schema.md](docs/database-schema.md)** - Esquema completo de BD
- **[business-rules.md](docs/business-rules.md)** - Reglas de negocio del sistema
- **[domain-model.md](docs/domain-model.md)** - Modelo de dominio
- **[project-context.md](docs/project-context.md)** - Contexto y objetivos
- **[roadmap.md](docs/roadmap.md)** - Plan de desarrollo

## 📋 Objetivo Actual

Construir el sistema completo de:
1. ✅ Productos
2. ✅ Clientes
3. 🟡 Ventas (en curso)
4. 🟡 Pagos (en curso)
5. 🟡 Cuotas (en curso)
6. 🟡 Caja (en curso)
7. ⏳ Inversionistas
8. ⏳ Distribución de utilidades
9. ⏳ Dashboard financiero
10. ⏳ Reportes integrales

## 🔒 Control de Acceso

| Módulo | Público | Usuario | Admin | Dev |
|--------|---------|---------|-------|-----|
| Login | ✅ | - | - | - |
| Productos | ✅ | ✅ | ✅ | ✅ |
| Clientes | - | ✅ | ✅ | ✅ |
| Ventas | - | ✅ | ✅ | ✅ |
| Pagos | - | ✅ | ✅ | ✅ |
| **Caja** | - | - | ✅ | ✅ |
| **Dashboard Admin** | - | - | ✅ | ✅ |
| **Configuración** | - | - | ✅ | ✅ |
| Inversionistas | - | - | ✅ | ✅ |

**Nota**: Módulos en negrita tienen restricciones especiales.
