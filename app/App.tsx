import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { resumenCarrito } from './src/compartido';
import { Cabecera } from './src/componentes';
import type { Pestanas, Rutas } from './src/navegacion';
import Buscar from './src/pantallas/Buscar';
import Carrito from './src/pantallas/Carrito';
import Inicio from './src/pantallas/Inicio';
import Pago from './src/pantallas/Pago';
import Pedido from './src/pantallas/Pedido';
import Pedidos from './src/pantallas/Pedidos';
import Producto from './src/pantallas/Producto';
import Sucursales from './src/pantallas/Sucursales';
import { useTienda } from './src/tienda';
import { BotonWhatsApp, C } from './src/ui';

const Tab = createBottomTabNavigator<Pestanas>();
const Stack = createNativeStackNavigator<Rutas>();

const ICONOS: Record<keyof Pestanas, keyof typeof Ionicons.glyphMap> = {
  Inicio: 'home-outline',
  Buscar: 'search-outline',
  Carrito: 'cart-outline',
  Pedidos: 'receipt-outline',
  Sucursales: 'location-outline',
};

// Envuelve cada pestaña para mostrar el boton flotante de ayuda por WhatsApp.
function conAyuda(Pantalla: React.ComponentType) {
  return function PantallaConAyuda() {
    return (
      <View style={{ flex: 1 }}>
        <Pantalla />
        <BotonWhatsApp abajo={16} />
      </View>
    );
  };
}

const InicioTab = conAyuda(Inicio);
const BuscarTab = conAyuda(Buscar);
const CarritoTab = conAyuda(Carrito);
const PedidosTab = conAyuda(Pedidos);
const SucursalesTab = conAyuda(Sucursales);

function PestanasInferiores() {
  const unidades = resumenCarrito(useTienda()).unidades;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Cabecera />,
        tabBarActiveTintColor: C.azul,
        tabBarInactiveTintColor: C.textoSuave,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONOS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioTab} />
      <Tab.Screen name="Buscar" component={BuscarTab} />
      <Tab.Screen
        name="Carrito"
        component={CarritoTab}
        options={{ tabBarBadge: unidades > 0 ? unidades : undefined, tabBarBadgeStyle: { backgroundColor: C.verde, color: '#fff' } }}
      />
      <Tab.Screen name="Pedidos" component={PedidosTab} />
      <Tab.Screen name="Sucursales" component={SucursalesTab} />
    </Tab.Navigator>
  );
}

const tema = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: C.azul, background: C.fondo, text: C.texto, border: C.borde } };

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={tema}>
        <Stack.Navigator screenOptions={{ headerTintColor: C.azul, headerTitleStyle: { color: C.texto }, headerBackTitle: 'Volver' }}>
          <Stack.Screen name="Pestanas" component={PestanasInferiores} options={{ headerShown: false }} />
          <Stack.Screen name="Producto" component={Producto} options={{ title: 'Producto' }} />
          <Stack.Screen name="Pago" component={Pago} options={{ title: 'Pago' }} />
          <Stack.Screen name="Pedido" component={Pedido} options={{ title: 'Estado del pedido' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
