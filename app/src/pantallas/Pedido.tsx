import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { formatoTasa, pedidoPorId, repetirPedido, sucursalPorId } from '../compartido';
import { CabeceraPedido, ItemsPedido } from '../componentes';
import type { Nav, Rutas } from '../navegacion';
import { useTienda } from '../tienda';
import { Boton, C, LineaTiempo, Tarjeta, abrirWhatsApp, e } from '../ui';

export default function Pedido() {
  const { id } = useRoute<RouteProp<Rutas, 'Pedido'>>().params;
  const nav = useNavigation<Nav>();
  const tienda = useTienda();
  const pedido = pedidoPorId(tienda, id);
  if (!pedido) {
    return (
      <View style={[e.pantalla, { padding: 16 }]}>
        <Text style={e.suave}>No encontramos el pedido {id}.</Text>
      </View>
    );
  }
  const sucursal = sucursalPorId(pedido.sucursalId);
  return (
    <ScrollView style={e.pantalla} contentContainerStyle={[e.contenido, { paddingBottom: 32 }]}>
      <Tarjeta>
        <CabeceraPedido pedido={pedido} />
      </Tarjeta>
      <Tarjeta>
        <Text style={[e.subtitulo, { marginBottom: 14 }]}>Seguimiento</Text>
        <LineaTiempo pedido={pedido} />
      </Tarjeta>
      <Tarjeta>
        <Text style={e.subtitulo}>Productos</Text>
        <ItemsPedido pedido={pedido} />
        <Text style={{ fontSize: 12, color: C.textoSuave, marginTop: 10 }}>
          Tasa BCV aplicada: {formatoTasa(pedido.tasaBcv)} por USD. Referencia: {pedido.referencia}
        </Text>
      </Tarjeta>
      <Tarjeta>
        <Text style={e.subtitulo}>{pedido.modoEntrega === 'domicilio' ? 'Entrega' : 'Retiro'}</Text>
        <Text style={e.texto}>{pedido.cliente.nombre}</Text>
        <Text style={e.suave}>
          {pedido.modoEntrega === 'domicilio' ? pedido.cliente.direccion : `${sucursal.nombre}: ${sucursal.direccion}`}
        </Text>
        <Text style={[e.suave, { marginTop: 6 }]}>Responsable en sucursal: {pedido.responsable}</Text>
      </Tarjeta>
      <Boton
        texto="Repetir pedido"
        onPress={() => {
          repetirPedido(pedido.id);
          nav.navigate('Pestanas', { screen: 'Carrito' });
        }}
      />
      <Boton
        texto="Ayuda por WhatsApp"
        variante="secundario"
        style={{ marginTop: 8 }}
        onPress={() => abrirWhatsApp(`Hola, necesito ayuda con mi pedido ${pedido.id}`)}
      />
    </ScrollView>
  );
}
