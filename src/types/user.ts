export type UserRole = 'customer' | 'admin'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}
