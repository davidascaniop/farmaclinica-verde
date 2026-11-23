import { useRoute, type RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { CATEGORIAS, buscarProductos, stockDe } from '../compartido';
import { GrillaProductos } from '../componentes';
import type { Pestanas } from '../navegacion';
import { useTienda } from '../tienda';
import { C, Chip, e } from '../ui';

export default function Buscar() {
  const tienda = useTienda();
  const ruta = useRoute<RouteProp<Pestanas, 'Buscar'>>();
  const [consulta, setConsulta] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);

  useEffect(() => {
    if (ruta.params?.categoria) setCategoria(ruta.params.categoria);
  }, [ruta.params?.categoria]);

  const productos = buscarProductos(consulta, categoria)
    .slice()
    .sort((a, b) => Number(stockDe(tienda, a.id) === 0) - Number(stockDe(tienda, b.id) === 0));

  return (
    <ScrollView style={e.pantalla} contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
      <TextInput
        accessibilityLabel="Buscar productos"
        placeholder="Medicamento, marca o categoría"
        placeholderTextColor={C.textoSuave}
        value={consulta}
        onChangeText={setConsulta}
        returnKeyType="search"
        autoCorrect={false}
        style={[e.campo, { marginBottom: 12 }]}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, marginBottom: 14 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <Chip texto="Todas" activo={categoria === null} onPress={() => setCategoria(null)} />
        {CATEGORIAS.map((c) => (
          <Chip key={c.id} texto={c.nombre} activo={categoria === c.id} onPress={() => setCategoria(c.id)} />
        ))}
      </ScrollView>
      <Text style={[e.suave, { marginBottom: 8 }]}>
        {productos.length} {productos.length === 1 ? 'resultado' : 'resultados'}
      </Text>
      {productos.length === 0 ? (
        <View style={[e.tarjeta, { alignItems: 'center', padding: 28 }]}>
          <Text style={e.suave}>No encontramos productos con esa búsqueda.</Text>
        </View>
      ) : (
        <GrillaProductos productos={productos} />
      )}
    </ScrollView>
  );
}
