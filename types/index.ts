export interface User {
  id: string
  name: string
  email: string
  role: "guest" | "super_admin"
}

export interface Transaction {
  id: string
  name: string
  amount: number
  date: string
  description?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface TransactionFilter {
  date?: string
  name?: string
}
