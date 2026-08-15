# PLG Capital - Guía para Desarrollo

Este archivo contiene las instrucciones y contexto para desarrollar en PLG Capital.

## 📌 Visión general

PLG Capital es una aplicación Next.js 16 que administra:
- **Productos**: Catálogo de artículos a crédito
- **Clientes**: Base de datos de compradores
- **Ventas**: Registro de transacciones a crédito
- **Cuotas/Pagos**: Gestión de cobranza
- **Caja**: Movimientos de efectivo
- **Reportes**: Análisis financieros (pendiente)

Stack: Next.js 16, TypeScript, Tailwind CSS, Supabase PostgreSQL, Vercel.

## 🔐 Seguridad

**IMPORTANTE**: Solo desarrolladores y administradores pueden acceder a:
- Módulos de caja
- Dashboards administrativos
- Configuración del sistema
- Datos financieros

Esta validación ocurre en middleware, API endpoints y componentes.

## 🗂️ Estructura del proyecto

Analiza el README.md para ver la estructura completa. Puntos clave:

- `app/` - Rutas de Next.js y layout
- `components/` - Componentes reutilizables organizados por dominio
- `lib/` - Todas las funciones del servidor y lógica de BD
- `types/database.ts` - Tipos de Supabase
- `docs/` - Documentación técnica

## ✅ Reglas de desarrollo

1. **TypeScript estricto**: Todo debe estar tipado
2. **Reutilización**: Antes de crear componentes nuevos, busca existentes
3. **No duplicar**: Evita archivos redundantes
4. **Funciones reutilizables**: Todas las consultas BD en `lib/`
5. **Estructura**: Mantén la organización actual

## 🗄️ Base de datos

### Tecnología
- Supabase (PostgreSQL)
- Service Role Key para operaciones sensitivas
- Anon Key para operaciones de usuario

### Reglas
- Los cambios en tablas SIEMPRE mediante migraciones SQL
- No modificar manualmente en producción
- Todas las queries pasar por funciones en `lib/`

### Archivos clave
- `lib/supabase/client.ts` - Cliente del navegador
- `lib/supabase-admin.ts` - Admin para servidor
- `lib/supabase-browser.ts` - Operaciones del navegador
- `types/database.ts` - Tipos generados de Supabase

## 🔄 Workflow de cambios

Antes de implementar:
1. Analiza impacto en otros módulos
2. Identifica archivos afectados
3. Presentar plan
4. Implementa cambios
5. Ejecuta `npm run build` y corrige errores

## 📊 Estado de módulos

Ver [PROJECT_STATE.MD](PROJECT_STATE.MD) para detalles:

- ✅ **Productos**: Completo
- ✅ **Clientes**: Completo  
- 🟡 **Ventas**: Básico (falta validaciones, reportes)
- 🟡 **Pagos**: Básico
- 🟡 **Cuotas**: Inicial (necesita claridad en tablas)
- 🟡 **Caja**: Básico
- ⏳ **Inversionistas**: Por diseñar
- ⏳ **Reportes**: Por diseñar
- ⏳ **Dashboard financiero**: Por diseñar

## 🚀 Comandos

```bash
npm install     # Dependencias
npm run dev     # Desarrollo
npm run build   # Compilar producción
npm run lint    # Validar código
```

## 🌍 Documentación técnica

- [database-schema.md](docs/database-schema.md)
- [business-rules.md](docs/business-rules.md)
- [domain-model.md](docs/domain-model.md)
- [financial-source-of-truth.md](docs/financial-source-of-truth.md)

## 📋 Checklist antes de hacer cambios

- [ ] ¿Existen componentes similares?
- [ ] ¿Hay archivos duplicados?
- [ ] ¿Los tipos están definidos?
- [ ] ¿Las queries están en `lib/`?
- [ ] ¿Se han ejecutado validaciones?
- [ ] ¿El build compila sin errores?
