# Forno & Farina · Cliente

Frontend del flujo de cliente de la pizzería: menú, carrito, checkout,
confirmación, seguimiento, ubicación y cuenta.

## Comandos

```bash
cd client
npm install
npm run dev -- --port 5173
npm run lint
npm run build
```

## Datos mock o API

Por defecto la app usa datos de ejemplo y no necesita el servidor ni MongoDB:

```env
VITE_DATA_SOURCE=mock
```

Para consumir el backend (cuando los endpoints estén integrados en `develop`):

```env
VITE_DATA_SOURCE=api
VITE_API_URL=/api
```

Los datos de ejemplo viven en `src/data/` y los adaptadores en
`src/services/`. Si la API cambia los nombres de sus campos, se normalizan en
esos servicios sin tocar las pantallas.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/menu` | Menú abierto/cerrado y carrito |
| `/checkout` | Datos de contacto, pago simulado y resumen |
| `/pedido/:id` | Confirmación del pedido y comprobante imprimible |
| `/seguimiento` | Seguimiento por código y estado del pedido |
| `/ubicacion` | Dirección, horarios y mapa de referencia |
| `/cuenta` | Cuenta demo, historial y herramientas de demostración |
| `/mostrador`, `/cocina`, `/admin` | Rutas de otros módulos (sin cambios) |

## Demostración

- Pedido de ejemplo: `FF-4892`.
- Cuenta demo: Ana Sofía Martínez.
- En `Cuenta > Modo demostración` se puede simular la tienda cerrada.
- Los pedidos nuevos avanzan automáticamente cada 40 segundos.
- El pago es simulado: no se procesa ningún cargo y no se guardan datos de
  tarjeta.
- En la confirmación, **Comprobante PDF** abre el diálogo de impresión para
  guardarlo como PDF.

## Pendientes de integración

- Registro e inicio de sesión reales (faltan las vistas de Figma).
- Menú real (`GET /api/menu`, PR pendiente).
- Consulta de pedido por ID en el servidor; por ahora el cliente guarda el
  último pedido en `localStorage` para la confirmación y el seguimiento.
- Correo de confirmación, pasarela de pago, seguimiento en vivo y mapa
  interactivo.
- Los estados usan los valores oficiales: `PENDIENTE`, `EN_PREPARACION`,
  `LISTO`, `ENTREGADO`.
