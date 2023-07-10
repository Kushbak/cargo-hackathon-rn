import axios from "axios";
import jwtDecode from 'jwt-decode'
import Toast from 'react-native-toast-message'
import { CarrierUser, CreateUser, LoginData, Order, ShipperUser, TOKEN_RESPONSE, TrimbleLocation, TrimbleRouteCoordinates, User, UserTokenedData } from "../store/types";
import { getToken, getUserData, removeToken, removeUserData, saveToken, saveUserData } from "../utils/asyncStorage";
import { store } from '../store'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
  ? process.env.EXPO_PUBLIC_PROD_API 
  : process.env.EXPO_PUBLIC_DEV_API,
  headers: {
    "Content-Type": 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return new Promise((resolve, reject) => {
      if (error.response?.status === 401) {
        authApi.logout()
          .then(() => {
            Toast.show({ type: 'error', text1: 'No Authorized' })
            store.dispatch('profile/clear')
          })
      } else if (error.response) {
        if (error.response?.status >= 500) {
          Toast.show({
            type: 'error',
            text1: 'Server Error. Please try again later',
            text2: process.env.NODE_ENV === 'development' ? error.response.message : undefined
          })
          console.log('error response not 401', )
        }
        reject(error.response.data);
      } else {
        console.log('just error', error.status, { error, config: error.config })
        reject(error);
      }
    });
  },
);

// SERVICES

export const authApi = {
  login: async (data: LoginData) => {
    const res = await instance.post<TOKEN_RESPONSE>('auth/login', data)
    authApi.setToken(res.data.access_token)
    return res.data
  },
  logout: async () => {
    await authApi.clearTokenStorage()
  },
  getProfile: async () => {
    const userData = await authApi._getUserData()
    if(userData?.id) {
      const res = await usersApi.getUserById(userData?.id)
      return res
    }
    await authApi.logout()
    store.dispatch('profile/clear')
  },
  setToken: async (token: string) => {
    try {
      const userData = jwtDecode<UserTokenedData>(token)
      await Promise.all([saveUserData(userData), saveToken(token)])
      instance.defaults.headers.Authorization = 'Bearer ' + token
      return true
    } catch (error) {
      return false
    }
  },
  getToken: async () => {
    try {
      const token = await getToken()
      if (!token) return await authApi.logout()
      await authApi.setToken(token)
      return token
    } catch (error) {
      await authApi.logout()
    }
  },
  _getUserData: async () => {
    const userData: UserTokenedData = await getUserData()
    if (!userData) {
      await authApi.logout()
    }
    return userData
  },
  clearTokenStorage: async () => {
    try {
      await Promise.all([removeToken(), removeUserData()])
      return true
    } catch (error) {
      return false
    }
  }
}

export const usersApi = {
  createCarrierUser: async (data: CreateUser) => {
    const res = await instance.post<CarrierUser>('users/carrier', data)
    return res.data
  },
  createShipperUser: async (data: CreateUser) => {
    const res = await instance.post<ShipperUser>('users/shipper', data)
    return res.data
  },
  getAllUsers: async () => {
    const res = await instance.get<User[]>('users')
    return res.data
  },
  getUserById: async (id: number) => {
    const res = await instance.get<User>(`users/${id}`)
    return res.data
  },
  deleteUser: async (id: number) => {
    const res = await instance.delete(`users/${id}`)
    return res.data
  }
}

export const companiesApi = {
  getAllCompanies: async () => {
    const res = await instance.get('companies')
    return res.data
  },
  createCompany: async () => {
    const res = await instance.get('companies/create-company')
    return res.data
  },
  addEmployee: async () => {
    const res = await instance.get('companies/add-employee')
    return res.data
  },
  deleteCompany: async (id: number) => {
    const res = await instance.get(`companies/${id}`)
    return res.data
  },
}

export const ordersApi = {
  getAllOrders: async () => {
    const res = await instance.get<Order[]>('orders')
    return res.data
  },
  getMyOrders: async () => {
    const res = await instance.get<Order[]>('orders/my-orders')
    return res.data
  },
  getOrderById: async (id: number) => {
    const res = await instance.get<Order>(`orders/${id}`)
    return res.data
  },
  getEstimatedPriceForShipping: async () => {
    const res = await instance.get('orders/price-estimate')
    return res.data
  },
  createOrder: async (data: Order) => {
    const res = await instance.post<Order>('orders/create-order', data)
    return res.data
  },
  acceptOrder: async (orderId: number) => {
    const res = await instance.put(`orders/accept-order/${orderId}`)
    return res.data
  },
  startShipping: async (orderId: number) => {
    const res = await instance.put(`orders/start-shipping/${orderId}`)
    return res.data
  },
  deliveredShipping: async (orderId: number) => {
    const res = await instance.put(`orders/delivered-shipping/${orderId}`)
    return res.data
  },
  finishShipping: async (orderId: number, data: FormData) => {
    console.log({ orderId, data })
    
    const res = await instance.put(
      `orders/finish-shipping/${orderId}`,
      data,
      {
        headers: { "Content-Type": 'multipart/form-data' }
      }
    )
    return res.data
  },
  enableOrder: async (id: number) => {
    const res = await instance.get(`orders/enalbe-order/${id}`)
    return res.data
  },
  disableOrder: async (id: number) => {
    const res = await instance.get(`orders/disable-order/${id}`)
    return res.data
  },
}

export const trimbleApi = {
  getLocation: async (params: TrimbleLocation) => {
    const res = await instance.get<TrimbleRouteCoordinates>('trimble/location', { params })
    return res.data
  }
}

// const mapboxApi = {
//   getDistance: async () => {
//     try {
//       const res = await instance.get('mapbox/distance')
//     } catch (e: any) {

//     }
//   }
// }