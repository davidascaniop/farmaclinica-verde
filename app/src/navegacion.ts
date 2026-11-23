import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Pestanas = {
  Inicio: undefined;
  Buscar: { categoria?: string } | undefined;
  Carrito: undefined;
  Pedidos: undefined;
  Sucursales: undefined;
};

export type Rutas = {
  Pestanas: NavigatorScreenParams<Pestanas> | undefined;
  Producto: { id: string };
  Pago: undefined;
  Pedido: { id: string };
};

export type Nav = NativeStackNavigationProp<Rutas>;
