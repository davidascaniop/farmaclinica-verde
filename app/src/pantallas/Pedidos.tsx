import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CLIENTE_DEMO, mensajeRepetir, pedidosPropios, repetirPedido } from '../compartido';
import { CabeceraPedido, ItemsPedido } from '../componentes';
import type { Nav } from '../navegacion';
import { useTienda } from '../tienda';
import { Boton, C, e } from '../ui';

export default function Pedidos() {
  const tienda = useTienda();
  const nav = useNavigation<Nav>();
  const [aviso, setAviso] = useState<{ id: string; texto: string } | null>(null);
  return (
    <ScrollView style={e.pantalla} contentContainerStyle={e.contenido}>
      <Text style={e.titulo}>Mis pedidos</Text>
      <Text style={[e.suave, { marginBottom: 14 }]}>
        {CLIENTE_DEMO.nombre} · {CLIENTE_DEMO.telefono}
      </Text>
      {pedidosPropios(tienda).map((p) => (
        <View key={p.id} style={e.tarjeta}>
          <CabeceraPedido pedido={p} />
          <View style={{ borderTopWidth: 1, borderTopColor: C.borde, marginTop: 10, paddingTop: 10 }}>
            <ItemsPedido pedido={p} />
          </View>
          {aviso?.id === p.id && <Text style={{ color: C.verdeOscuro, fontWeight: '600', marginTop: 10 }}>{aviso.texto}</Text>}
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Boton texto="Ver estado" variante="secundario" style={{ flex: 1, marginRight: 8 }} onPress={() => nav.navigate('Pedido', { id: p.id })} />
            <Boton
              texto="Repetir pedido"
              style={{ flex: 1 }}
              onPress={() => setAviso({ id: p.id, texto: mensajeRepetir(repetirPedido(p.id)) })}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
