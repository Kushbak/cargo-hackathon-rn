import { OrderStatus } from "./store/types"

export const Screens = {
  login: 'Login',
  register: 'Register',
  home: 'Home',
  ordersList: 'OrdersList',
  orderDetail: 'OrderDetails',
  profile: 'Profile',
  chatList: 'ChatList',
  chatItem: 'ChatItem',
  cameraScreen: 'CameraScreen',
  activeOrderMap: 'ActiveOrderMap'
} as const

export const INDIVIDUAL_CARRIER_SELECT_DATA = {
  label: 'Individual Carrier',
  value: "-1"
}

export const SOCKET_EVENTS = {
  getRoomMessages: 'orders:get-room-messages',
  receiveRoomMessages: 'orders:receive-room-messages',
  sendMessage: 'orders:send-message',
  receiveMessage: 'orders:receive-message',
  createOrder: 'orders:create-order',
}

export const ACTIVE_ORDER_STATUSES = [
  OrderStatus.accepted,
  OrderStatus.on_way,
  OrderStatus.delivered,
]

export const ORDER_STATUSES_WITH_MAP_PREVIEW = [
  OrderStatus.waiting,
  OrderStatus.accepted,
  OrderStatus.on_way,
]