import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CLIENTE_DEMO,
  DATOS_PAGO,
  METODOS_PAGO,
  formatoBs,
  formatoUsd,
  nombreMetodo,
  nombreModo,
  pagar,
  resumenCarrito,
  sucursalPorId,
  validarCheckout,
  type MetodoPago,
  type Pedido,
} from '../compartido';
import { Resumen } from '../componentes';
import type { Nav } from '../navegacion';
import { useTienda } from '../tienda';
import { Boton, C, Campo, Tarjeta, e } from '../ui';

type Fase = 'formulario' | 'verificando' | 'confirmado' | 'revision';

export default function Pago() {
  const tienda = useTienda();
  const nav = useNavigation<Nav>();
  const resumen = resumenCarrito(tienda);
  const sucursal = sucursalPorId(tienda.sucursalId);
  const [cliente, setCliente] = useState(CLIENTE_DEMO);
  const [metodo, setMetodo] = useState<MetodoPago>('pago_movil');
  const [referencia, setReferencia] = useState('');
  const [recipe, setRecipe] = useState<string | null>(null);
  const [fase, setFase] = useState<Fase>('formulario');
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);

  const datos = { metodoPago: metodo, referencia, cliente, recipeImagen: recipe };
  const faltaRecipe = resumen.requiereRecipe && !recipe;

  const adjuntar = async (desdeCamara: boolean) => {
    setError(null);
    try {
      if (desdeCamara) {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
          setError('Activa el permiso de cámara para fotografiar el récipe.');
          return;
        }
      }
      const opciones: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.6 };
      const r = desdeCamara
        ? await ImagePicker.launchCameraAsync(opciones)
        : await ImagePicker.launchImageLibraryAsync(opciones);
      if (!r.canceled && r.assets[0]) setRecipe(r.assets[0].uri);
    } catch {
      setError('No pudimos abrir la imagen. Intenta de nuevo.');
    }
  };

  const enviar = async () => {
    const problema = validarCheckout(tienda, datos);
    if (problema) {
      setError(problema);
      return;
    }
    setError(null);
    try {
      const final = await pagar(datos, (creado) => {
        setPedido(creado);
        setFase(metodo === 'zelle' ? 'revision' : 'verificando');
      });
      setPedido(final);
      if (metodo !== 'zelle') setFase('confirmado');
    } catch (err) {
      setFase('formulario');
      setError(err instanceof Error ? err.message : 'No pudimos procesar el pago.');
    }
  };

  if (fase !== 'formulario' && pedido) {
    return (
      <View style={[e.pantalla, { padding: 16, justifyContent: 'center' }]}>
        <View style={[e.tarjeta, { alignItems: 'center', padding: 24 }]} accessibilityLiveRegion="polite">
          {fase === 'verificando' && <ActivityIndicator size="large" color={C.azul} />}
          {fase === 'confirmado' && <Ionicons name="checkmark-circle" size={56} color={C.verde} />}
          {fase === 'revision' && <Ionicons name="time" size={56} color={C.alerta} />}
          <Text style={[e.titulo, { marginTop: 14, textAlign: 'center', color: fase === 'confirmado' ? C.verdeOscuro : C.texto }]}>
            {fase === 'verificando' ? 'Verificando tu pago con el banco' : fase === 'confirmado' ? 'Pago confirmado' : 'Pago en revisión'}
          </Text>
          <Text style={[e.suave, { textAlign: 'center', marginTop: 4 }]}>
            {fase === 'verificando' && `Consultando la referencia ${pedido.referencia} por ${nombreMetodo(pedido.metodoPago)}.`}
            {fase === 'confirmado' &&
              `El banco confirmó tu ${nombreMetodo(pedido.metodoPago)} por ${formatoBs(pedido.totalUsd, pedido.tasaBcv)} (${formatoUsd(pedido.totalUsd)}).`}
            {fase === 'revision' && 'Recibimos tu pedido. Los pagos por Zelle se verifican manualmente; te avisaremos cuando quede confirmado.'}
          </Text>
          <Text style={[e.texto, { textAlign: 'center', marginTop: 12 }]}>
            Pedido {pedido.id}
            {pedido.recipe ? '. Tu récipe será validado por un farmacéutico antes del despacho.' : ''}
          </Text>
          {fase !== 'verificando' && (
            <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
              <Boton
                texto="Ver estado del pedido"
                onPress={() =>
                  nav.reset({ index: 1, routes: [{ name: 'Pestanas', params: { screen: 'Pedidos' } }, { name: 'Pedido', params: { id: pedido.id } }] })
                }
              />
              <Boton
                texto="Seguir comprando"
                variante="secundario"
                style={{ marginTop: 8 }}
                onPress={() => nav.reset({ index: 0, routes: [{ name: 'Pestanas', params: { screen: 'Inicio' } }] })}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  if (resumen.lineas.length === 0) {
    return (
      <View style={[e.pantalla, { padding: 16 }]}>
        <Text style={e.suave}>No hay productos para pagar.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView style={e.pantalla} contentContainerStyle={[e.contenido, { paddingBottom: 32 }]} keyboardShouldPersistTaps="handled">
        <Tarjeta>
          <Text style={e.subtitulo}>1. Entrega</Text>
          <Text style={[e.suave, { marginBottom: 12 }]}>
            {nombreModo(tienda.modoEntrega)} desde {sucursal.nombre}, {sucursal.ciudad}.
          </Text>
          <Campo etiqueta="Nombre y apellido" value={cliente.nombre} onChangeText={(t) => setCliente({ ...cliente, nombre: t })} />
          <Campo etiqueta="Teléfono" keyboardType="phone-pad" value={cliente.telefono} onChangeText={(t) => setCliente({ ...cliente, telefono: t })} />
          {tienda.modoEntrega === 'domicilio' ? (
            <Campo etiqueta="Dirección de entrega" value={cliente.direccion} onChangeText={(t) => setCliente({ ...cliente, direccion: t })} />
          ) : (
            <Text style={e.suave}>
              Retiras en: {sucursal.direccion}. {sucursal.horario}
            </Text>
          )}
        </Tarjeta>

        {resumen.requiereRecipe && (
          <Tarjeta style={{ borderColor: faltaRecipe ? '#F0B429' : C.verde }}>
            <Text style={e.subtitulo}>2. Récipe médico</Text>
            <Text style={[e.suave, { marginBottom: 12 }]}>
              Requerido para:{' '}
              {resumen.lineas
                .filter((l) => l.producto.requiere_recipe)
                .map((l) => l.producto.nombre)
                .join(', ')}
              .
            </Text>
            {recipe && (
              <Image source={{ uri: recipe }} accessibilityLabel="Récipe adjunto" style={{ width: 110, height: 110, borderRadius: 10, marginBottom: 12 }} />
            )}
            <Boton texto={recipe ? 'Cambiar imagen' : 'Elegir foto del récipe'} variante="secundario" onPress={() => adjuntar(false)} />
            <Boton texto="Tomar foto" variante="secundario" style={{ marginTop: 8 }} onPress={() => adjuntar(true)} />
            <Text style={{ marginTop: 10, fontSize: 14, color: recipe ? C.verdeOscuro : C.alerta }}>
              {recipe ? 'Récipe adjunto. Puedes continuar con el pago.' : 'No podrás pagar hasta adjuntar el récipe.'}
            </Text>
          </Tarjeta>
        )}

        <Tarjeta>
          <Text style={e.subtitulo}>{resumen.requiereRecipe ? '3' : '2'}. Método de pago</Text>
          {METODOS_PAGO.map((m) => {
            const activo = metodo === m.id;
            return (
              <Pressable
                key={m.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: activo }}
                onPress={() => setMetodo(m.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  minHeight: 56,
                  borderWidth: 1,
                  borderColor: activo ? C.azul : C.borde,
                  backgroundColor: activo ? C.azulClaro : '#fff',
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Ionicons name={activo ? 'radio-button-on' : 'radio-button-off'} size={22} color={activo ? C.azul : C.textoSuave} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: C.texto }}>{m.nombre}</Text>
                  <Text style={{ fontSize: 12, color: C.textoSuave }}>{m.detalle}</Text>
                </View>
              </Pressable>
            );
          })}
          <View style={{ backgroundColor: C.fondo, borderRadius: 10, padding: 12, marginVertical: 8 }}>
            <Text style={{ fontWeight: '700', color: C.texto, marginBottom: 6 }}>
              Paga {metodo === 'zelle' ? formatoUsd(resumen.totalUsd) : formatoBs(resumen.totalUsd)} a estos datos:
            </Text>
            {DATOS_PAGO[metodo].map(([k, v]) => (
              <View key={k} style={[e.fila, { marginBottom: 2, alignItems: 'flex-start' }]}>
                <Text style={e.suave}>{k}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.texto, flex: 1, textAlign: 'right', marginLeft: 12 }}>{v}</Text>
              </View>
            ))}
          </View>
          <Campo
            etiqueta="Número de referencia o confirmación"
            placeholder="Ej.: 00123456"
            value={referencia}
            onChangeText={setReferencia}
            autoCorrect={false}
          />
        </Tarjeta>

        <Resumen resumen={resumen} />
        {error && (
          <View style={{ backgroundColor: C.errorClaro, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <Text style={{ color: C.error }}>{error}</Text>
          </View>
        )}
        <Boton
          texto={faltaRecipe ? 'Adjunta el récipe para pagar' : `Pagar ${formatoUsd(resumen.totalUsd)}`}
          variante="verde"
          disabled={faltaRecipe}
          onPress={enviar}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
