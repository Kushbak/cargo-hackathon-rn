import { StoreonModule } from 'storeon'
import { User } from '../types'

export type AuthState = {
  profileData: User | null
}

export type AuthEvents = {
  'profile/save': User
  'profile/clear': undefined
}

const profileStore: StoreonModule<AuthState, AuthEvents> = (store) => {
  store.on('@init', () => {
    return {
      profileData: null
    }
  })
  store.on('profile/save', (state, data) => {
    return {
      ...state,
      profileData: data
    }
  })
  store.on('profile/clear', () => {
    return {
      profileData: null
    }
  })
}

export default profileStore