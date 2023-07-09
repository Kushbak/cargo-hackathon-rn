export type Roles = "CARRIER" | "SHIPPER"

export type LoginData = {
  login: string
  password: string
}

export type User = {
  id: number
  firstname: string
  lastname: string
  email: string
  role: Roles
  phone: string
}

export type UserTokenedData = {
  email: string
  exp: number
  firstname: string
  iat: number
  id: number
  lastname: string
  phone: string
  role: Roles
}

export type CarrierUser = {
  physical_address: string
  mc_dot_number: string
  company_id: number | string
} & User

export type ShipperUser = {
  billing_address: string
} & User

export type OperatorUser = {
  company_id: number
} & CarrierUser

export type CreateUser = Omit<{
  password: string
} & CarrierUser, 'id'>

export enum OrderStatus {
  not_paid = 'not_paid',
  waiting = 'waiting',
  accepted = 'accepted',
  on_way = 'on_way',
  delivered = 'delivered',
  finished = 'finished',
}

export type Order = {
    id: number
    created_at: Date
    price: number
    currency: string
    pickup_location: string
    destination: string
    origin_latitude: string
    origin_longitude: string
    destination_latitude: string
    destination_longitude: string
    pickup_date: Date
    delivery_date: Date
    weight: number
    type: string
    required_equipment: null,
    special_instructions: null,
    status: OrderStatus
    active: true,
    acceptance_image: null,
    shipper: ShipperUser
    carrier: CarrierUser
}

export type TrimbleLocation = {
  start: string
  end: string
}

export type Company = {
  id: number
  role: string
  name: string
  insurance_id: string
  address: string
  login: string
  email: string
  employees_credential: OperatorUser[]
  carriers: CarrierUser[]
}

export type SelectValue = {
  label: string
  value: number | string
}

export type TOKEN_RESPONSE = {
  access_token: string
}