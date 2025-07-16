// User model type definition
export interface User {
  id: number
  username: string
  name: string | null
  password?: string
  role: number
  isActive: boolean
  createdAt: Date
}

// User creation input type
export interface CreateUserInput {
  username: string
  name?: string | null
  password: string
}

// User login input type
export interface LoginInput {
  username: string
  password: string
}

// User register input type
export interface RegisterInput {
  username: string
  password: string
}

// User response type (without password)
export interface UserResponse {
  id: number
  username: string
  name: string | null
  role: number
}
