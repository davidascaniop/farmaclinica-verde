import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { cambiarCantidad, formatoBs, formatoUsd, quitarDelCarrito, resumenCarrito, sucursalPorId } from '../compartido';
import { Resumen, SelectorEntrega, SelectorSucursal } from '../componentes';
import type { Nav } from '../navegacion';
import { useTienda } from '../tienda';
import { Boton, C, Etiqueta, ImagenProducto, Stepper, e } from '../ui';

export default function Carrito() {
  const tienda = useTienda();
  const nav = useNavigation<Nav>();
  const resumen = resumenCarrito(tienda);
  const sucursal = sucursalPorId(tienda.sucursalId);

  if (resumen.lineas.length === 0) {
    return (
      <View style={[e.pantalla, { padding: 16 }]}>
        <View style={[e.tarjeta, { alignItems: 'center', padding: 28 }]}>
          <Text style={[e.suave, { marginBottom: 14 }]}>Tu carrito está vacío.</Text>
          <Boton texto="Ver productos" onPress={() => nav.navigate('Pestanas', { screen: 'Inicio' })} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={e.pantalla} contentContainerStyle={e.contenido}>
      <SelectorSucursal />
      <SelectorEntrega />
      {resumen.requiereRecipe && (
        <View style={{ backgroundColor: C.alertaClaro, borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <Text style={{ color: C.alerta, fontSize: 14 }}>
            Tu carrito incluye medicamentos con récipe. Deberás adjuntar una foto del récipe médico al pagar.
          </Text>
        </View>
      )}
      {resumen.lineas.map((l) => (
        <View key={l.producto.id} style={[e.tarjeta, { flexDirection: 'row' }]}>
          <View style={{ width: 64 }}>
            <ImagenProducto producto={l.producto} alto={64} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={[e.fila, { alignItems: 'flex-start' }]}>
              <Pressable style={{ flex: 1 }} onPress={() => nav.navigate('Producto', { id: l.producto.id })}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.texto }}>{l.producto.nombre}</Text>
                <Text style={{ fontSize: 13, color: C.textoSuave }}>{l.producto.presentacion}</Text>
              </Pressable>
              <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                <Text style={{ fontWeight: '700', color: C.texto }}>{formatoUsd(l.subtotalUsd)}</Text>
                <Text style={{ fontSize: 12, color: C.textoSuave }}>{formatoBs(l.subtotalUsd)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {l.producto.requiere_recipe && (
                <View style={{ marginRight: 6, marginBottom: 4 }}>
                  <Etiqueta texto="Requiere récipe" tono="pendiente" />
                </View>
              )}
              {!l.disponible && (
                <Etiqueta
                  texto={l.stock === 0 ? `Agotado en ${sucursal.nombre}` : `Solo ${l.stock} en ${sucursal.nombre}`}
                  tono="error"
                />
              )}
            </View>
            <View style={[e.fila, { marginTop: 8 }]}>
              <Stepper cantidad={l.cantidad} max={l.stock} onCambiar={(n) => cambiarCantidad(l.producto.id, n)} />
              <Pressable
                accessibilityRole="button"
                onPress={() => quitarDelCarrito(l.producto.id)}
                style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}
              >
                <Text style={{ color: C.error, fontWeight: '700' }}>Quitar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
      <Resumen resumen={resumen} />
      {resumen.hayNoDisponibles && (
        <Text style={{ color: C.error, marginBottom: 10 }}>
          Ajusta o quita los productos sin existencia en esta sucursal para continuar.
        </Text>
      )}
      <Boton texto="Continuar al pago" disabled={resumen.hayNoDisponibles} onPress={() => nav.navigate('Pago')} />
    </ScrollView>
  );
}
