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

## API o datos mock

Por defecto la app consume el backend real con Axios. Copia `.env.example` a
`.env` y ajusta la URL si el servidor corre en otro puerto:

```env
VITE_DATA_SOURCE=api
VITE_API_URL=http://localhost:5000/api
```

Endpoints usados:

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/menu` | Menú; solo se muestran productos `PIZZA` |
| GET | `/api/store/status` | `tienda_abierta` y ubicación |
| GET | `/api/orders/wait-time` | Pedidos activos y minutos estimados |
| GET | `/api/orders/:id` | Pedido completo y estado (con respaldo local) |
| POST | `/api/auth/register` | Registro idempotente por correo |
| POST | `/api/orders` | Crear pedido con `metodo_pago` `ANTICIPADO` o `TIENDA` |

La tienda se considera cerrada hasta que `GET /api/store/status` confirme lo
contrario (fail-closed). El estado se consulta cada 15 segundos y también al
recuperar el foco o volver a la pestaña. Con la tienda cerrada se muestra el
banner de tienda cerrada y se bloquean catálogo, carrito y checkout.

Para trabajar sin backend:

```env
VITE_DATA_SOURCE=mock
```

En modo mock los datos viven en `src/data/` y se conservan las herramientas de
demostración (cuenta demo, historial de ejemplo y switch de tienda cerrada).

Los adaptadores están en `src/services/`. Si la API cambia los nombres de sus
campos, se normalizan ahí sin tocar las pantallas.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/menu` | Menú abierto/cerrado y carrito |
| `/checkout` | Datos de contacto, pago simulado y resumen |
| `/pedido/:id` | Confirmación del pedido y comprobante imprimible |
| `/seguimiento` | Seguimiento por folio o ID completo |
| `/ubicacion` | Dirección, horarios y mapa de referencia |
| `/cuenta` | Historial guardado en el dispositivo |
| `/mostrador`, `/cocina`, `/admin` | Rutas de otros módulos (sin cambios) |

## Folio y estados

- El folio visible es `#` + los últimos 4 caracteres del `_id` de Mongo.
- El ID completo se usa para `GET /api/orders/:id` y los enlaces internos.
- Los estados oficiales son `PENDIENTE`, `EN_PREPARACION`, `LISTO` y
  `ENTREGADO`.
- El pago es simulado: no se procesa ningún cargo y no se guardan datos de
  tarjeta.
- En la confirmación, **Comprobante PDF** abre el diálogo de impresión para
  guardarlo como PDF.

## Estado real del pedido

La confirmación y el seguimiento consultan `GET /api/orders/:id` y
`GET /api/orders/wait-time` periódicamente. Si la API no responde, se conserva
el último snapshot local y se muestra el error correspondiente. El estado del
pedido ya no se modifica desde el cliente.

## Pendientes de integración

- `POST /api/orders` todavía no valida el estado de la tienda en el servidor;
  el bloqueo de tienda cerrada es del cliente.
- El backend no almacena teléfono ni notas; el checkout de API los omite y solo
  se muestran en modo mock.
- Registro con contraseña, correo de confirmación, pasarela de pago real y
  mapa interactivo.
