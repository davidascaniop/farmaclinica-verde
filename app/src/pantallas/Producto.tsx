import { useRoute, type RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SUCURSALES, categoriaPorId, elegirSucursal, productoPorId, stockDe } from '../compartido';
import { BotonAgregar } from '../componentes';
import type { Rutas } from '../navegacion';
import { useTienda } from '../tienda';
import { C, Etiqueta, ImagenProducto, Precio, Stepper, Tarjeta, e } from '../ui';

export default function Producto() {
  const { id } = useRoute<RouteProp<Rutas, 'Producto'>>().params;
  const tienda = useTienda();
  const [cantidad, setCantidad] = useState(1);
  const producto = productoPorId(id);
  if (!producto) {
    return (
      <View style={[e.pantalla, { padding: 16 }]}>
        <Text style={e.suave}>Producto no encontrado.</Text>
      </View>
    );
  }
  const stock = stockDe(tienda, producto.id);
  const tope = Math.max(1, stock);
  const elegida = Math.min(cantidad, tope);
  return (
    <ScrollView style={e.pantalla} contentContainerStyle={[e.contenido, { paddingBottom: 32 }]}>
      <ImagenProducto producto={producto} alto={200} />
      <Text style={[e.suave, { marginTop: 14 }]}>
        {categoriaPorId(producto.categoria).nombre} · {producto.laboratorio}
      </Text>
      <Text style={e.titulo}>{producto.nombre}</Text>
      <Text style={e.suave}>{producto.presentacion}</Text>
      {producto.requiere_recipe && (
        <View style={{ backgroundColor: C.alertaClaro, borderRadius: 10, padding: 12, marginTop: 12 }}>
          <Text style={{ color: C.alerta, fontSize: 14 }}>
            <Text style={{ fontWeight: '700' }}>Requiere récipe médico. </Text>
            Deberás adjuntar una foto del récipe al pagar. Un farmacéutico lo valida antes de despachar.
          </Text>
        </View>
      )}
      <View style={{ marginVertical: 14 }}>
        <Precio usd={producto.precioUsd} grande />
      </View>
      <Text style={[e.texto, { marginBottom: 16 }]}>{producto.descripcion}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Stepper cantidad={elegida} max={tope} onCambiar={(n) => setCantidad(Math.max(1, Math.min(tope, n)))} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <BotonAgregar producto={producto} cantidad={elegida} />
        </View>
      </View>

      <Tarjeta>
        <Text style={e.subtitulo}>Disponibilidad por sucursal</Text>
        {SUCURSALES.map((s) => {
          const n = stockDe(tienda, producto.id, s.id);
          const activa = s.id === tienda.sucursalId;
          return (
            <View key={s.id} style={[e.fila, { minHeight: 48, borderTopWidth: 1, borderTopColor: C.borde }]}>
              <View style={{ flex: 1 }}>
                <Text style={e.texto}>{s.nombre}</Text>
                <Text style={{ fontSize: 12, color: C.textoSuave }}>{s.ciudad}</Text>
              </View>
              <Etiqueta texto={n > 0 ? `${n} disponibles` : 'Agotado'} tono={n > 0 ? 'ok' : 'error'} />
              <Pressable
                accessibilityRole="button"
                disabled={activa}
                onPress={() => elegirSucursal(s.id)}
                style={{ minHeight: 44, width: 84, justifyContent: 'center', alignItems: 'flex-end' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.azul, textDecorationLine: activa ? 'none' : 'underline' }}>
                  {activa ? 'Tu sucursal' : 'Cambiar'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </Tarjeta>
    </ScrollView>
  );
}
