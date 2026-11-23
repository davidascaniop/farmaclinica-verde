import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SUCURSALES,
  agregarAlCarrito,
  elegirModoEntrega,
  elegirSucursal,
  etiquetaEstado,
  etiquetaPago,
  formatoBs,
  formatoFecha,
  formatoTasa,
  formatoUsd,
  nombreMetodo,
  nombreModo,
  productoPorId,
  stockDe,
  sucursalPorId,
  type ModoEntrega,
  type Pedido,
  type Producto,
  type ResumenCarrito,
} from './compartido';
import type { Nav } from './navegacion';
import { useTienda } from './tienda';
import { Boton, C, Etiqueta, ImagenProducto, Precio, Tarjeta, e } from './ui';

const logo = require('../../assets/logo-fcv.png');

// Cabecera de las pestañas: aviso de prototipo, logo y tasa BCV.
export function Cabecera() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: C.borde, paddingTop: insets.top }}>
      <View style={{ backgroundColor: C.azulOscuro, paddingVertical: 5, paddingHorizontal: 16 }}>
        <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>Prototipo con datos de ejemplo</Text>
      </View>
      <View style={[e.fila, { paddingHorizontal: 16, paddingVertical: 8 }]}>
        <Image source={logo} accessibilityLabel="FarmaClínica Verde" resizeMode="contain" style={{ width: 152, height: 38 }} />
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: C.textoSuave }}>Tasa BCV</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.azul }}>{formatoTasa()}</Text>
        </View>
      </View>
    </View>
  );
}

export function SelectorSucursal() {
  const tienda = useTienda();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={e.campoEtiqueta}>Sucursal</Text>
      <View style={{ flexDirection: 'row' }}>
        {SUCURSALES.map((s, i) => (
          <Pressable
            key={s.id}
            accessibilityRole="button"
            accessibilityState={{ selected: tienda.sucursalId === s.id }}
            onPress={() => elegirSucursal(s.id)}
            style={[
              {
                flex: 1,
                minHeight: 52,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: C.borde,
                borderRadius: 10,
                backgroundColor: '#fff',
                marginLeft: i === 0 ? 0 : 8,
              },
              tienda.sucursalId === s.id && { backgroundColor: C.azul, borderColor: C.azul },
            ]}
          >
            <Text style={{ fontWeight: '700', color: tienda.sucursalId === s.id ? '#fff' : C.texto }}>
              {s.nombre.replace('Sucursal ', '')}
            </Text>
            <Text style={{ fontSize: 12, color: tienda.sucursalId === s.id ? '#fff' : C.textoSuave }}>{s.ciudad}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const MODOS: { id: ModoEntrega; texto: string }[] = [
  { id: 'domicilio', texto: 'A domicilio' },
  { id: 'retiro', texto: 'Retiro en tienda' },
];

export function SelectorEntrega() {
  const tienda = useTienda();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={e.campoEtiqueta}>Forma de entrega</Text>
      <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: C.borde, padding: 4 }}>
        {MODOS.map((m) => {
          const activo = tienda.modoEntrega === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityState={{ selected: activo }}
              onPress={() => elegirModoEntrega(m.id)}
              style={{ flex: 1, minHeight: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: activo ? C.azul : '#fff' }}
            >
              <Text style={{ fontWeight: '700', color: activo ? '#fff' : C.textoSuave }}>{m.texto}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function BotonAgregar({ producto, cantidad = 1, texto = 'Agregar al carrito' }: { producto: Producto; cantidad?: number; texto?: string }) {
  const tienda = useTienda();
  const [aviso, setAviso] = useState<string | null>(null);
  if (stockDe(tienda, producto.id) === 0) return <Boton texto="Agotado" variante="secundario" disabled onPress={() => {}} />;
  return (
    <Boton
      texto={aviso ?? texto}
      variante="verde"
      onPress={() => {
        setAviso(agregarAlCarrito(producto.id, cantidad) > 0 ? 'Agregado' : 'Máximo disponible');
        setTimeout(() => setAviso(null), 1400);
      }}
    />
  );
}

export function TarjetaProducto({ producto }: { producto: Producto }) {
  const tienda = useTienda();
  const nav = useNavigation<Nav>();
  const stock = stockDe(tienda, producto.id);
  const agotado = stock === 0;
  return (
    <View style={{ width: '50%', padding: 5 }}>
      <View style={[e.tarjeta, { padding: 10, marginBottom: 0, flex: 1 }]}>
        <Pressable accessibilityRole="button" onPress={() => nav.navigate('Producto', { id: producto.id })}>
          <ImagenProducto producto={producto} tenue={agotado} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.texto, marginTop: 8 }} numberOfLines={2}>
            {producto.nombre}
          </Text>
          <Text style={{ fontSize: 13, color: C.textoSuave }} numberOfLines={1}>
            {producto.presentacion}
          </Text>
        </Pressable>
        <View style={{ minHeight: 26, marginTop: 6 }}>
          {agotado ? (
            <Etiqueta texto="Agotado" tono="error" />
          ) : producto.requiere_recipe ? (
            <Etiqueta texto="Requiere récipe" tono="pendiente" />
          ) : null}
        </View>
        <View style={{ flex: 1 }} />
        <Precio usd={producto.precioUsd} />
        <Text style={{ fontSize: 12, color: agotado ? C.error : C.verdeOscuro, marginVertical: 6 }}>
          {agotado ? 'Sin existencia aquí' : `${stock} disponibles`}
        </Text>
        <BotonAgregar producto={producto} texto="Agregar" />
      </View>
    </View>
  );
}

export function GrillaProductos({ productos }: { productos: Producto[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -5 }}>
      {productos.map((p) => (
        <TarjetaProducto key={p.id} producto={p} />
      ))}
    </View>
  );
}

export function Resumen({ resumen }: { resumen: ResumenCarrito }) {
  return (
    <Tarjeta>
      <View style={[e.fila, { marginBottom: 6 }]}>
        <Text style={e.suave}>Subtotal</Text>
        <Text style={e.texto}>{formatoUsd(resumen.subtotalUsd)}</Text>
      </View>
      <View style={[e.fila, { marginBottom: 10 }]}>
        <Text style={e.suave}>Envío</Text>
        <Text style={e.texto}>{resumen.envioUsd > 0 ? formatoUsd(resumen.envioUsd) : 'Sin costo'}</Text>
      </View>
      <View style={[e.fila, { borderTopWidth: 1, borderTopColor: C.borde, paddingTop: 10, alignItems: 'flex-start' }]}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: C.texto }}>Total</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: C.texto }}>{formatoUsd(resumen.totalUsd)}</Text>
          <Text style={e.suave}>{formatoBs(resumen.totalUsd)}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 12, color: C.textoSuave, marginTop: 6 }}>Tasa BCV: {formatoTasa()} por USD</Text>
    </Tarjeta>
  );
}

export function CabeceraPedido({ pedido }: { pedido: Pedido }) {
  const estado = etiquetaEstado(pedido);
  const pago = etiquetaPago(pedido.estadoPago);
  return (
    <View>
      <View style={[e.fila, { alignItems: 'flex-start' }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.texto }}>Pedido {pedido.id}</Text>
          <Text style={e.suave}>{formatoFecha(pedido.fecha, true)}</Text>
          <Text style={e.suave}>
            {nombreModo(pedido.modoEntrega)} · {sucursalPorId(pedido.sucursalId).nombre}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.texto }}>{formatoUsd(pedido.totalUsd)}</Text>
          <Text style={{ fontSize: 12, color: C.textoSuave }}>{formatoBs(pedido.totalUsd, pedido.tasaBcv)}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
        <Text style={[e.suave, { marginRight: 8 }]}>{nombreMetodo(pedido.metodoPago)}</Text>
        {pedido.estadoPago !== 'confirmado' && (
          <View style={{ marginRight: 8 }}>
            <Etiqueta texto={`Pago: ${pago.texto.toLowerCase()}`} tono={pago.tono} />
          </View>
        )}
        <Etiqueta texto={estado.texto} tono={estado.tono} />
      </View>
    </View>
  );
}

export function ItemsPedido({ pedido }: { pedido: Pedido }) {
  return (
    <View>
      {pedido.items.map((i) => (
        <View key={i.productoId} style={[e.fila, { marginBottom: 4 }]}>
          <Text style={[e.texto, { flex: 1 }]}>
            {i.cantidad} x {productoPorId(i.productoId)?.nombre ?? i.productoId}
          </Text>
          <Text style={e.suave}>{formatoUsd(i.precioUsd * i.cantidad)}</Text>
        </View>
      ))}
      {pedido.envioUsd > 0 && (
        <View style={e.fila}>
          <Text style={e.texto}>Envío</Text>
          <Text style={e.suave}>{formatoUsd(pedido.envioUsd)}</Text>
        </View>
      )}
    </View>
  );
}
