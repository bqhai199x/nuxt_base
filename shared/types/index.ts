// Export all types from here for centralized management
export * from './user'

// Export constants
export * from '../constants'

// Common API response types
export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ErrorResponse {
  success: false
  error: string
  message: string
  statusCode: number
}
