# FarmaClínica Verde: prototipo de farmacia en línea

Prototipo navegable para demostración comercial. Funciona con datos de ejemplo y sin backend:
todo el estado (carrito, pedidos, existencias) vive en memoria.

## Demo en línea

https://davidascaniop.github.io/farmaclinica-verde/

Se publica sola con GitHub Pages cada vez que se sube un cambio a la rama `main`.

## Estructura

| Carpeta   | Contenido |
|-----------|-----------|
| `shared/` | Datos simulados (JSON) y lógica común: productos, sucursales, tasa BCV, carrito, pagos y pedidos. La usan la web y la app. |
| `web/`    | Sitio en Next.js (App Router, TypeScript, Tailwind). |
| `app/`    | App móvil en React Native con Expo (TypeScript). |
| `assets/` | Logo de la marca (`logo-fcv.png`). |

## Requisitos

- Node.js 20 o superior.
- Para la app: la aplicación Expo Go en el teléfono (App Store o Google Play), con el teléfono y la computadora en la misma red wifi.

## Instalación (una sola vez)

```bash
npm run instalar
```

## Correr la web

```bash
npm run web
```

Abre http://localhost:3000. El panel interno está en http://localhost:3000/panel.

## Correr la app (Expo Go)

```bash
npm run app
```

Escanea el código QR que aparece en la terminal: en Android desde Expo Go, en iPhone desde la cámara.
Si el teléfono no logra conectarse por la red local, usa el modo túnel:

```bash
cd app && npx expo start --tunnel
```

Para ver la app en el navegador de la computadora (útil para un ensayo rápido):

```bash
cd app && npm run web
```

## Qué cambiar y dónde

| Para cambiar | Archivo |
|--------------|---------|
| Tasa BCV | `shared/tasa-bcv.ts` (único lugar) |
| Productos, precios y existencias por sucursal | `shared/data/productos.json` |
| Sucursales | `shared/data/sucursales.json` |
| Pedidos de ejemplo | `shared/data/pedidos.json` |
| Colores de marca, WhatsApp, costo de envío, datos de pago | `shared/marca.ts` (los colores de la web también en `web/app/globals.css`) |
| Logo | `assets/logo-fcv.png` |

## Guion sugerido para la demo

1. Inicio: cambia de sucursal y muestra cómo cambian las existencias y los agotados.
2. Usa "Repite tu última compra" o agrega Amoxicilina (requiere récipe).
3. En el pago, muestra que no se puede pagar sin adjuntar el récipe. Adjunta una imagen.
4. Paga con Pago Móvil: a los 2 segundos aparece "Pago confirmado". Repite con Zelle: queda "en revisión".
5. Abre `/panel`: aprueba el récipe, confirma el pago Zelle y avanza el estado del pedido.
6. Vuelve a "Mi cuenta" y muestra la línea de tiempo actualizada.

## Notas del prototipo

- La web guarda el estado en el navegador (localStorage) para que la demo sobreviva a una recarga y el
  panel vea los mismos pedidos en otra pestaña. "Reiniciar datos de ejemplo" en `/panel` lo devuelve al inicio.
- La app guarda el estado solo en memoria: al cerrarla vuelve a los datos de ejemplo. La web y la app no
  comparten pedidos entre sí (no hay servidor).
- Los pagos, la confirmación bancaria, los datos de pago y el formulario de contacto son simulados.
