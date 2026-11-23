import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Linking, ScrollView, Text, TextInput, View } from 'react-native';
import { buscarSucursales, elegirSucursal, enlaceMapa } from '../compartido';
import type { Nav } from '../navegacion';
import { useTienda } from '../tienda';
import { Boton, C, Etiqueta, e } from '../ui';

export default function Sucursales() {
  const tienda = useTienda();
  const nav = useNavigation<Nav>();
  const [ciudad, setCiudad] = useState('');
  const lista = buscarSucursales(ciudad);
  return (
    <ScrollView style={e.pantalla} contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
      <Text style={e.titulo}>Sucursales</Text>
      <TextInput
        accessibilityLabel="Buscar por ciudad o zona"
        placeholder="Buscar por ciudad: Caracas, Valencia"
        placeholderTextColor={C.textoSuave}
        value={ciudad}
        onChangeText={setCiudad}
        autoCorrect={false}
        style={[e.campo, { marginVertical: 12 }]}
      />
      {lista.length === 0 && (
        <View style={[e.tarjeta, { alignItems: 'center', padding: 28 }]}>
          <Text style={e.suave}>No tenemos sucursales en esa ciudad todavía.</Text>
        </View>
      )}
      {lista.map((s) => (
        <View key={s.id} style={e.tarjeta}>
          <View style={[e.fila, { alignItems: 'flex-start' }]}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: C.azul }}>{s.nombre}</Text>
            {tienda.sucursalId === s.id && <Etiqueta texto="Tu sucursal" tono="ok" />}
          </View>
          <Text style={{ fontWeight: '600', color: C.texto, marginBottom: 8 }}>
            {s.ciudad}, {s.zona}
          </Text>
          <Text style={e.suave}>Dirección</Text>
          <Text style={[e.texto, { marginBottom: 6 }]}>{s.direccion}</Text>
          <Text style={e.suave}>Horario</Text>
          <Text style={[e.texto, { marginBottom: 6 }]}>{s.horario}</Text>
          <Text style={e.suave}>Teléfono</Text>
          <Text style={[e.texto, { marginBottom: 12 }]}>{s.telefono}</Text>
          <Boton texto="Ver en Google Maps" variante="secundario" onPress={() => Linking.openURL(enlaceMapa(s))} />
          <Boton
            texto="Comprar en esta sucursal"
            style={{ marginTop: 8 }}
            onPress={() => {
              elegirSucursal(s.id);
              nav.navigate('Pestanas', { screen: 'Inicio' });
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
