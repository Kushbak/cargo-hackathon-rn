import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Order, TrimbleRouteCoordinates } from "../store/types"

export type StackRoutes = {
  Login: undefined
  Register: undefined
  Home: undefined
  OrdersList: undefined
  OrderDetails: { orderId: number }
  Profile: undefined
  Map: undefined
  ActiveOrderMap: { order: Order, mapCoords: TrimbleRouteCoordinates | null }
  ChatList: undefined
  ChatItem: { orderId: number }
  CameraScreen: { orderId: number }
}

export type LoginScreenProps = NativeStackScreenProps<StackRoutes, 'Login'>
export type RegisterScreenProps = NativeStackScreenProps<StackRoutes, 'Register'>
export type HomeScreenProps = NativeStackScreenProps<StackRoutes, 'Home'>
export type OrdersListScreenProps = NativeStackScreenProps<StackRoutes, 'OrdersList'>
export type OrderDetailsListScreenProps = NativeStackScreenProps<StackRoutes, 'OrderDetails'>
export type ProfileScreenProps = NativeStackScreenProps<StackRoutes, 'Profile'>
export type ActiveOrderMapScreenProps = NativeStackScreenProps<StackRoutes, 'ActiveOrderMap'>
export type ChatListScreenProps = NativeStackScreenProps<StackRoutes, 'ChatList'>
export type ChatItemScreenProps = NativeStackScreenProps<StackRoutes, 'ChatItem'>
export type CameraScreenProps = NativeStackScreenProps<StackRoutes, 'CameraScreen'>