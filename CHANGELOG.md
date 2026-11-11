# Changelog

Registro de cambios grandes (arquitectura, dependencias, pantallas, modelo de datos).
Lo más reciente va arriba.

## 2026-11-11 - iOS: parche de WatermelonDB para RN 0.88

- RN 0.88 eliminó `RCTCxxBridge`; WatermelonDB 0.28 aún lo usa para instalar JSI.
- Parche con `patch-package` (`patches/@nozbe+watermelondb+0.28.0.patch`) que expone `-runtime` del bridge y define el alias. Se aplica en `postinstall`.
- Quitar el parche cuando WatermelonDB publique soporte oficial.

## 2026-11-11 - Historial, abonos y detalles

- Pantalla Historial en el menú: ventas por fecha descendente con filtros de estado, rango de fechas y cliente.
- Detalle de venta (partidas, pagos, cambio) y registro de abonos; al cubrir el total la venta pasa a pagada (`useAddPayment`).
- Detalle de cliente con compras, total gastado, deudas y saldo.
- Historial de movimientos de stock por producto (`useGetProductHistory`).
- Sin cambios de schema (sigue en v1). Layout de tablet pospuesto.

## 2026-11-11 - Carrito y flujo de venta

- Carrito global (`CartContext`): agregar desde el home, +/-, eliminar, nota y total. La cantidad no supera el stock.
- FAB con contador en el home que abre el carrito.
- Pantalla `Checkout` (stack sobre el drawer): venta pagada (monto recibido y cambio) o en deuda (cliente obligatorio).
- Al confirmar usa `useCreateSale`: crea venta, partidas y pago, descuenta stock y registra historial.

## 2026-11-11 - Android: configuración de WatermelonDB

- Módulo JSI (`watermelondb-jsi`) incluido en `settings.gradle` y `app/build.gradle`, y registrado en `MainApplication`.
- `buildConfig` habilitado para `nozbe_watermelondb` (AGP ya no lo genera por defecto) y regla de ProGuard.
- `assembleDebug` compila. Falta probar en dispositivo o emulador.

## 2026-11-11 - App base de punto de venta

- Onboarding de primer uso: bienvenida (nombre del negocio), categorías (omitible) y productos (omitible).
- Menú lateral (`@react-navigation/drawer`) con Venta, Productos, Categorías y Clientes.
- Home de venta: búsqueda por nombre/SKU, chips de categorías y lista de productos. Aún sin carrito ni cobro.
- Pantallas de alta, edición y baja lógica para productos, categorías y clientes.
- Modelo de datos en WatermelonDB (schema v1): stores, categories, products, product_histories, customers, sales, sale_items, payments. Un solo negocio por instalación (sin `store_id`).
- Capa de consultas con `@tanstack/react-query` en `src/hooks/` (`useGetProducts`, `useCreateCategory`, `useCreateSale`, etc.).
- Fuente Rubik enlazada en iOS y Android con `react-native-asset`.
- Nuevas dependencias nativas: reanimated 4, worklets, gesture-handler. Pendiente validar en dispositivo.

## 2026-11-11 - Proyecto inicial

- Proyecto React Native 0.88 con TypeScript.
- Navegación (`@react-navigation/native`, native-stack), WatermelonDB, `@gorhom/portal` e i18n (`i18next`, `react-i18next`, `react-native-localize`).
- Componentes base al estilo Ant Design: Button, Checkbox, Input, Icon, Modal.
- Repositorio público en GitHub, trabajando en `main`.
