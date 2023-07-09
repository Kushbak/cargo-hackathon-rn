import { StoreonModule } from 'storeon'
import { Order } from '../types'

export type OrdersState = {
  activeOrder: Order | null
}

export type OrdersEvents = {
  'orders/setActiveOrder': Order | null
  'orders/editActiveOrder': Order
}

const ordersStore: StoreonModule<OrdersState, OrdersEvents> = (store) => {
  store.on('@init', () => {
    return {
      activeOrder: null
    }
  })
  store.on('orders/setActiveOrder', (state, data) => {
    console.log('store', { data })
    return {
      ...state,
      activeOrder: data
    }
  })
  store.on('orders/editActiveOrder', (_, data) => {
    return {
      activeOrder: data
    }
  })
}

export default ordersStore