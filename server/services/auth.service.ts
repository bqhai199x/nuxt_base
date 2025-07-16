import { userService } from './user.service'
import { serverJWT } from '~/server/utils/jwt'
import { createApiError } from '~/server/utils/api.helpers'
import { ERROR_MESSAGES, STATUS_CODES } from '~/shared/constants'
import type { LoginInput, UserResponse, ApiResponse, ErrorResponse } from '~/shared/types'

export class AuthService {
  private static instance: AuthService
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Rate limiting helper
  private checkRateLimit(identifier: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now()
    const userLimit = this.rateLimitMap.get(identifier)

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (userLimit.count >= limit) {
      return false
    }

    userLimit.count++
    return true
  }

  async login(credentials: LoginInput, clientIp: string): Promise<{
    user: UserResponse
    token: string
  }> {
    try {
      // Rate limiting
      if (!this.checkRateLimit(clientIp)) {
        throw createApiError(STATUS_CODES.TOO_MANY_REQUESTS, ERROR_MESSAGES.RATE_LIMIT_EXCEEDED)
      }

      // Validate credentials
      const user = await userService.verifyPassword(credentials.username, credentials.password)
      
      if (!user) {
        throw createApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS)
      }

      // Check if user is active
      if (!user.isActive) {
        throw createApiError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.ACCOUNT_DISABLED)
      }

      // Generate JWT token
      const token = await serverJWT.generateToken({
        id: user.id,
        username: user.username,
        role: user.role
      })

      return {
        user,
        token
      }
    } catch (error) {
      console.error('AuthService.login error:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error
      }
      throw createApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
    }
  }

  async validateToken(token: string): Promise<UserResponse> {
    try {
      const decoded = await serverJWT.verifyToken(token)
      if (!decoded) {
        throw createApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN)
      }

      const user = await userService.getUserById(decoded.userId)
      if (!user || !user.isActive) {
        throw createApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      }

      return user
    } catch (error) {
      console.error('AuthService.validateToken error:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error
      }
      throw createApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.TOKEN_VALIDATION_ERROR)
    }
  }
}

export const authService = AuthService.getInstance()

