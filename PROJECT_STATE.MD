# Estado del Proyecto - PLG Capital

Última actualización: 2026-08-15

## 📊 Resumen General

PLG Capital es una aplicación de gestión de crédito que integra módulos de productos, clientes, ventas, pagos y caja. La aplicación está en desarrollo activo con módulos básicos funcionales y otros en fase de consolidación.

**Porcentaje de completitud**: ~45%

## ✅ Módulos Completos

### Productos

**Estado**: Funcional ✅

**Características**:
- ✅ Crear nuevos productos
- ✅ Listar productos con filtros
- ✅ Editar información del producto
- ✅ Eliminar productos
- ✅ Gestión de precios
- ✅ Categorización

**Archivos clave**:
- `app/dashboard/productos/page.tsx` - Listado
- `app/dashboard/productos/nuevo/page.tsx` - Crear
- `app/dashboard/productos/[id]/page.tsx` - Detalle/Editar
- `lib/products/` - Lógica de servidor

**Base de datos**:
- Tabla: `products`
- Campos completos: nombre, descripción, precio, estado

---

### Clientes

**Estado**: Funcional ✅

**Características**:
- ✅ Crear nuevos clientes
- ✅ Listar clientes con búsqueda
- ✅ Editar información de cliente
- ✅ Eliminar clientes
- ✅ Gestión de contacto (email, teléfono)
- ✅ Dirección y datos personales

**Archivos clave**:
- `app/dashboard/clientes/page.tsx` - Listado
- `app/dashboard/clientes/nuevo/page.tsx` - Crear
- `lib/customers.ts` - Funciones de servidor

**Base de datos**:
- Tabla: `customers`
- Campos: nombre, email, teléfono, dirección, DNI, estado

---

## 🟡 Módulos en Desarrollo

### Ventas

**Estado**: Parcial 🟡 (~60%)

**Implementado**:
- ✅ Crear venta
- ✅ Listar ventas
- ✅ Ver detalles de venta
- ✅ Asignar cliente a venta
- ✅ Seleccionar productos
- ✅ Calcular monto total

**Pendiente**:
- ⏳ Validaciones completas (montos, stock)
- ⏳ Generación de cuotas automática
- ⏳ Reportes de ventas
- ⏳ Auditoría de cambios
- ⏳ Aprobación de ventas

**Archivos clave**:
- `app/dashboard/ventas/page.tsx` - Listado
- `components/sales/` - Componentes
- `lib/sales/` - Lógica de servidor

**Base de datos**:
- Tabla: `sales`
- Campos: cliente_id, fecha, monto_total, estado

**Notas técnicas**:
- El cálculo de cuotas está parcialmente integrado en la calculadora
- Falta integración oficial entre ventas y cuotas

---

### Pagos

**Estado**: Parcial 🟡 (~50%)

**Implementado**:
- ✅ Registrar pago
- ✅ Listar pagos
- ✅ Filtros por fecha/cliente
- ✅ Monto del pago
- ✅ Método de pago

**Pendiente**:
- ⏳ Aplicar pago a cuota específica
- ⏳ Validar saldo de cliente
- ⏳ Generar comprobante
- ⏳ Reportes de cobranza
- ⏳ Estado de parcialidades

**Archivos clave**:
- `app/dashboard/pagos/page.tsx` - Listado
- `components/payments/` - Componentes
- `lib/payments/` - Lógica de servidor

**Base de datos**:
- Tabla: `payments`
- Campos: cliente_id, monto, fecha, método

---

### Cuotas / Instalaciones

**Estado**: Inicial 🟡 (~30%)

**Problema identificado**: Existen dos tablas potencialmente redundantes:
- `sale_installments` - Cuotas generadas por venta
- `installments` - Tabla de instalaciones

**Implementado**:
- ✅ Estructura de tabla básica
- ✅ Relación con ventas

**Pendiente**:
- ⚠️ **Clarificar tabla oficial** (sale_installments vs installments)
- ⏳ Cálculo automático de cuotas según venta
- ⏳ Seguimiento de estado (pagada, pendiente, vencida)
- ⏳ Intereses y recargos
- ⏳ Avisos de vencimiento

**Archivos clave**:
- `lib/payments/` - Lógica relacionada

**Base de datos**:
- Tablas: `sale_installments`, `installments`
- ⚠️ Requiere decisión de consolidación

**Recomendación**:
```sql
-- Opción A: Usar sale_installments como tabla oficial
-- Opción B: Consolidar installments en sale_installments
-- Opción C: sale_installments como referencias a installments
```

---

### Caja

**Estado**: Básico 🟡 (~40%)

**Implementado**:
- ✅ Registrar movimiento de caja
- ✅ Listar movimientos
- ✅ Filtros por fecha
- ✅ Diferenciación entrada/salida
- ✅ Saldo actual

**Pendiente**:
- ⏳ Conciliación de caja
- ⏳ Cuadre de caja
- ⏳ Cierre de caja
- ⏳ Reportes de movimientos
- ⏳ Integración con pagos
- ⏳ Auditoría completa

**Archivos clave**:
- `app/dashboard/caja/page.tsx`
- `components/cash/` - Componentes
- `lib/cash/` - Lógica de servidor

**Base de datos**:
- Tabla: `cash_movements`
- Campos: tipo (entrada/salida), monto, descripción, fecha

**Restricción de acceso**: ✅ Solo admin/dev

---

## ⏳ Módulos Pendientes (Por diseñar)

### Inversionistas

**Estado**: Por diseñar ⏳

**Concepto**: Gestión de inversionistas y participación en utilidades

**Características esperadas**:
- Registro de inversionistas
- Porcentaje de participación
- Cálculo de distribución
- Historial de pagos
- Reportes de retorno

**Pendientes**:
- ⏳ Diseño completo de modelo
- ⏳ Reglas de negocio
- ⏳ Tablas de base de datos
- ⏳ Componentes UI

---

### Distribución de Utilidades

**Estado**: Por diseñar ⏳

**Concepto**: Cálculo y distribución automática de ganancias

**Características esperadas**:
- Cálculo de ganancias netas
- Distribución entre inversionistas
- Cálculo de comisión de administración
- Generación de reportes
- Integración con caja

**Pendientes**:
- ⏳ Fórmulas de cálculo
- ⏳ Reglas de distribución
- ⏳ Validaciones
- ⏳ Integración con módulos existentes

---

### Dashboard Financiero

**Estado**: Por diseñar ⏳

**Concepto**: Panel de análisis y KPIs

**Características esperadas**:
- Resumen de ingresos/egresos
- Gráficos de tendencias
- Estado de cuentas
- Análisis de clientes morosos
- Proyecciones
- Indicadores clave (ROI, rentabilidad)

**Pendientes**:
- ⏳ Definición de KPIs
- ⏳ Diseño de gráficos
- ⏳ Cálculos financieros
- ⏳ Integración de datos

---

### Sistema de Reportes

**Estado**: Por diseñar ⏳

**Concepto**: Generación de reportes integrales del sistema

**Características esperadas**:
- Reporte de ventas
- Reporte de pagos
- Reporte de cobranza
- Reporte de clientes morosos
- Reporte financiero general
- Exportación a PDF/Excel
- Programación de reportes

**Pendientes**:
- ⏳ Definición de reportes
- ⏳ Templates
- ⏳ Motor de generación
- ⏳ Integración con librerías

---

## 🔧 Configuración

**Estado**: Básico 🟡

**Implementado**:
- ✅ Página de configuración
- ✅ Cálculo de comisión por producto

**Pendiente**:
- ⏳ Otros parámetros del sistema
- ⏳ Validaciones de configuración
- ⏳ Auditoría de cambios

---

## 🔐 Restricciones de Acceso

| Módulo | Público | Usuario | Admin | Dev |
|--------|---------|---------|-------|-----|
| Login | ✅ | - | - | - |
| Productos | ✅ | ✅ | ✅ | ✅ |
| Clientes | - | ✅ | ✅ | ✅ |
| Ventas | - | ✅ | ✅ | ✅ |
| Pagos | - | ✅ | ✅ | ✅ |
| **Caja** | - | - | ✅ | ✅ |
| **Configuración** | - | - | ✅ | ✅ |
| **Dashboard Admin** | - | - | ✅ | ✅ |

---

## 📈 Próximos Pasos Recomendados

### Corto plazo (1-2 sprints)
1. Consolidar tabla de cuotas (sale_installments vs installments)
2. Completar validaciones en ventas
3. Integrar pagos con cuotas
4. Implementar comprobantes de pago

### Mediano plazo (3-4 sprints)
1. Dashboard financiero básico
2. Reportes de ventas y pagos
3. Sistema de alertas (vencimientos)
4. Integración caja-pagos

### Largo plazo (5+ sprints)
1. Módulo de inversionistas
2. Distribución automática de utilidades
3. Reportes avanzados
4. Análisis predictivo

---

## 📝 Notas Técnicas

- El proyecto usa Supabase como base de datos principal
- Todos los cambios en BD deben ser mediante migraciones SQL
- TypeScript estricto en todo el código
- Componentes reutilizables en `lib/` y `components/`
- Restricciones de acceso validadas en middleware

---

## 🐛 Problemas Conocidos

1. **Ambigüedad de tablas de cuotas**: Necesita clarificación urgente
2. **Falta validación en ventas**: Montos y stock
3. **Integración incompleta**: Pagos ↔ Cuotas ↔ Caja

---

## 📞 Contacto / Consultas

Para dudas sobre el estado del proyecto o cambios de prioridad, consultar con el equipo de desarrollo.
