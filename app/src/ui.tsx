import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import {
  CONTACTO,
  MARCA,
  categoriaPorId,
  formatoBs,
  formatoUsd,
  lineaDeTiempo,
  type Pedido,
  type Producto,
  type Tono,
} from './compartido';

export const C = MARCA;

type Variante = 'primario' | 'verde' | 'secundario' | 'peligro';

export function Boton({
  texto,
  onPress,
  variante = 'primario',
  disabled = false,
  style,
}: {
  texto: string;
  onPress: () => void;
  variante?: Variante;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const fondo = { primario: C.azul, verde: C.verde, secundario: '#fff', peligro: '#fff' }[variante];
  const color = { primario: '#fff', verde: '#fff', secundario: C.azul, peligro: C.error }[variante];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        e.boton,
        { backgroundColor: fondo, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        (variante === 'secundario' || variante === 'peligro') && { borderWidth: 1, borderColor: C.borde },
        style,
      ]}
    >
      <Text style={[e.botonTexto, { color }]}>{texto}</Text>
    </Pressable>
  );
}

const TONOS: Record<Tono, { fondo: string; color: string }> = {
  ok: { fondo: C.verdeClaro, color: C.verdeOscuro },
  pendiente: { fondo: C.alertaClaro, color: C.alerta },
  error: { fondo: C.errorClaro, color: C.error },
  neutro: { fondo: C.fondo, color: C.textoSuave },
};

export function Etiqueta({ texto, tono = 'neutro' }: { texto: string; tono?: Tono }) {
  return (
    <View style={[e.etiqueta, { backgroundColor: TONOS[tono].fondo }]}>
      <Text style={[e.etiquetaTexto, { color: TONOS[tono].color }]}>{texto}</Text>
    </View>
  );
}

export function Precio({ usd, tasa, grande = false }: { usd: number; tasa?: number; grande?: boolean }) {
  return (
    <View>
      <Text style={{ fontSize: grande ? 28 : 17, fontWeight: '700', color: C.texto }}>{formatoUsd(usd)}</Text>
      <Text style={{ fontSize: grande ? 15 : 12, color: C.textoSuave }}>{formatoBs(usd, tasa)}</Text>
    </View>
  );
}

export function ImagenProducto({ producto, alto = 96, tenue = false }: { producto: Producto; alto?: number; tenue?: boolean }) {
  const c = categoriaPorId(producto.categoria);
  return (
    <View style={[e.imagen, { height: alto, backgroundColor: c.color + '14', opacity: tenue ? 0.4 : 1 }]}>
      <Ionicons name="medkit-outline" size={Math.round(alto * 0.45)} color={c.color} />
    </View>
  );
}

export function Campo({ etiqueta, ...props }: TextInputProps & { etiqueta: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={e.campoEtiqueta}>{etiqueta}</Text>
      <TextInput accessibilityLabel={etiqueta} placeholderTextColor={C.textoSuave} style={e.campo} {...props} />
    </View>
  );
}

export function Tarjeta({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[e.tarjeta, style]}>{children}</View>;
}

export function Chip({ texto, activo, onPress }: { texto: string; activo: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      onPress={onPress}
      style={[e.chip, activo && { backgroundColor: C.azul, borderColor: C.azul }]}
    >
      <Text style={{ fontWeight: '600', fontSize: 14, color: activo ? '#fff' : C.texto }}>{texto}</Text>
    </Pressable>
  );
}

export function Stepper({
  cantidad,
  onCambiar,
  max,
}: {
  cantidad: number;
  onCambiar: (n: number) => void;
  max: number;
}) {
  return (
    <View style={e.stepper}>
      <Pressable accessibilityLabel="Restar" style={e.stepperBoton} onPress={() => onCambiar(cantidad - 1)}>
        <Ionicons name="remove" size={20} color={C.azul} />
      </Pressable>
      <Text style={{ width: 32, textAlign: 'center', fontWeight: '700', color: C.texto }}>{cantidad}</Text>
      <Pressable
        accessibilityLabel="Sumar"
        style={[e.stepperBoton, cantidad >= max && { opacity: 0.35 }]}
        disabled={cantidad >= max}
        onPress={() => onCambiar(cantidad + 1)}
      >
        <Ionicons name="add" size={20} color={C.azul} />
      </Pressable>
    </View>
  );
}

export function LineaTiempo({ pedido }: { pedido: Pedido }) {
  const pasos = lineaDeTiempo(pedido);
  const colorPunto = { hecho: C.verde, actual: C.azul, pendiente: C.borde, error: C.error };
  return (
    <View accessibilityLabel="Estado del pedido">
      {pasos.map((p, i) => (
        <View key={p.clave} style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', width: 24 }}>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: colorPunto[p.estado],
                backgroundColor: p.estado === 'hecho' || p.estado === 'error' ? colorPunto[p.estado] : '#fff',
              }}
            />
            {i < pasos.length - 1 && (
              <View style={{ flex: 1, width: 2, backgroundColor: pasos[i + 1].estado === 'hecho' ? C.verde : C.borde }} />
            )}
          </View>
          <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 18 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: p.estado === 'pendiente' ? '400' : '700',
                color: p.estado === 'error' ? C.error : p.estado === 'pendiente' ? C.textoSuave : C.texto,
              }}
            >
              {p.titulo}
              {p.estado === 'actual' ? '  (en curso)' : ''}
            </Text>
            <Text style={{ fontSize: 13, color: C.textoSuave }}>{p.detalle}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function abrirWhatsApp(mensaje = 'Hola, necesito ayuda con mi compra') {
  Linking.openURL(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`);
}

export function BotonWhatsApp({ abajo }: { abajo: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ayuda por WhatsApp"
      onPress={() => abrirWhatsApp()}
      style={({ pressed }) => [e.whatsapp, { bottom: abajo, opacity: pressed ? 0.85 : 1 }]}
    >
      <Ionicons name="logo-whatsapp" size={22} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6 }}>Ayuda</Text>
    </Pressable>
  );
}

export const e = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo },
  contenido: { padding: 16, paddingBottom: 96 },
  titulo: { fontSize: 22, fontWeight: '700', color: C.texto, marginBottom: 4 },
  subtitulo: { fontSize: 17, fontWeight: '700', color: C.texto, marginBottom: 8 },
  suave: { fontSize: 14, color: C.textoSuave },
  texto: { fontSize: 15, color: C.texto },
  boton: { minHeight: 48, borderRadius: 10, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  botonTexto: { fontSize: 15, fontWeight: '700' },
  etiqueta: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  etiquetaTexto: { fontSize: 12, fontWeight: '700' },
  imagen: { borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  campoEtiqueta: { fontSize: 14, fontWeight: '600', color: C.texto, marginBottom: 4 },
  campo: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 15,
    color: C.texto,
  },
  tarjeta: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: C.borde, padding: 14, marginBottom: 12 },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.borde,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.borde, borderRadius: 10, backgroundColor: '#fff' },
  stepperBoton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  whatsapp: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1FA855',
    borderRadius: 999,
    paddingHorizontal: 16,
    minHeight: 48,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
