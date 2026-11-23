import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CATEGORIAS,
  PRODUCTOS,
  formatoBs,
  formatoFecha,
  formatoUsd,
  mensajeRepetir,
  productoPorId,
  repetirPedido,
  stockDe,
  sucursalPorId,
  ultimoPedidoPropio,
} from '../compartido';
import { GrillaProductos, SelectorEntrega, SelectorSucursal } from '../componentes';
import type { Nav } from '../navegacion';
import { useTienda } from '../tienda';
import { Boton, C, Chip, e } from '../ui';

export default function Inicio() {
  const tienda = useTienda();
  const nav = useNavigation<Nav>();
  const [aviso, setAviso] = useState<string | null>(null);
  const sucursal = sucursalPorId(tienda.sucursalId);
  const ultimo = ultimoPedidoPropio(tienda);
  const productos = PRODUCTOS.slice().sort(
    (a, b) => Number(stockDe(tienda, a.id) === 0) - Number(stockDe(tienda, b.id) === 0),
  );
  const agotados = productos.filter((p) => stockDe(tienda, p.id) === 0).length;

  return (
    <ScrollView style={e.pantalla} contentContainerStyle={e.contenido}>
      <SelectorSucursal />
      <SelectorEntrega />
      <Text style={[e.suave, { marginBottom: 12 }]}>
        {tienda.modoEntrega === 'domicilio' ? 'Despachamos desde' : 'Retiras en'} {sucursal.nombre}: {sucursal.direccion}.
      </Text>

      <Pressable
        accessibilityRole="search"
        accessibilityLabel="Buscar productos"
        onPress={() => nav.navigate('Pestanas', { screen: 'Buscar' })}
        style={[e.campo, { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }]}
      >
        <Ionicons name="search" size={18} color={C.textoSuave} />
        <Text style={{ color: C.textoSuave, marginLeft: 8, fontSize: 15 }}>Medicamento, marca o categoría</Text>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, marginBottom: 14 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATEGORIAS.map((c) => (
          <Chip key={c.id} texto={c.nombre} activo={false} onPress={() => nav.navigate('Pestanas', { screen: 'Buscar', params: { categoria: c.id } })} />
        ))}
      </ScrollView>

      {ultimo && (
        <View style={[e.tarjeta, { backgroundColor: C.verdeClaro, borderColor: '#B7DFC3' }]}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.verdeOscuro }}>Repite tu última compra</Text>
          <Text style={[e.suave, { marginTop: 2 }]}>
            Pedido {ultimo.id} del {formatoFecha(ultimo.fecha)}: {formatoUsd(ultimo.totalUsd)} ({formatoBs(ultimo.totalUsd)} hoy)
          </Text>
          <View style={{ marginVertical: 8 }}>
            {ultimo.items.map((i) => (
              <Text key={i.productoId} style={e.texto}>
                {i.cantidad} x {productoPorId(i.productoId)?.nombre}
              </Text>
            ))}
          </View>
          {aviso && <Text style={{ color: C.verdeOscuro, fontWeight: '600', marginBottom: 8 }}>{aviso}</Text>}
          <Boton texto="Agregar todo al carrito" variante="verde" onPress={() => setAviso(mensajeRepetir(repetirPedido(ultimo.id)))} />
        </View>
      )}

      <View style={[e.fila, { marginTop: 6, marginBottom: 8 }]}>
        <Text style={[e.subtitulo, { marginBottom: 0 }]}>Productos</Text>
        <Text style={e.suave}>
          {productos.length} en {sucursal.nombre.replace('Sucursal ', '')}
          {agotados > 0 ? `, ${agotados} agotados` : ''}
        </Text>
      </View>
      <GrillaProductos productos={productos} />
    </ScrollView>
  );
}
