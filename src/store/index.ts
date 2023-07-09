import { createStoreon, StoreonStore } from 'storeon'
import profileStore, { AuthEvents, AuthState } from './auth'
import ordersStore, { OrdersEvents, OrdersState } from './orders'

export type States = AuthState & OrdersState
export type Events = AuthEvents & OrdersEvents

export const store = createStoreon<States, Events>([profileStore, ordersStore])

export type StoreType = StoreonStore<typeof store>
