import { StoreonModule } from 'storeon'
import { Order } from '../types'

export type OrdersState = {
  activeOrder: Order | null
  orders: Order[],
  pictureUri: any | null 
}

export type OrdersEvents = {
  'orders/setActiveOrder': Order | null,
  'orders/setOrders': Order[]
  'orders/updateOneOrder': Order
  'orders/setPictureUri': any
}

const ordersStore: StoreonModule<OrdersState, OrdersEvents> = (store) => {
  store.on('@init', () => {
    return {
      activeOrder: null,
      orders: []
    }
  })
  store.on('orders/setActiveOrder', (state, data) => {
    return {
      ...state,
      activeOrder: data
    }
  }),
  store.on('orders/setOrders', (state, data) => {
    return {
      ...state,
      orders: data
    }
  }),
  store.on('orders/updateOneOrder', (state, data) => {
    return {
      ...state,
      orders: state.orders.filter(item => item.id !== data.id)
    }
  }),
  store.on('orders/setPictureUri', (state, data) => {
    return {
      ...state,
      pictureUri: data
    }
  })
}

export default ordersStore