import { authService } from '~/server/services/auth.service'
import { createApiError } from '~/server/utils/api.helpers'
import { getCookie, getHeader } from 'h3'
import { ERROR_MESSAGES, STATUS_CODES, USER_ROLES } from '~/shared/constants'

// Enhanced authentication middleware
export const requireAuth = async (event: any, options: {
  requiredRole?: number
  allowCookie?: boolean
  allowHeader?: boolean
} = {}) => {
  const {
    requiredRole,
    allowCookie = true,
    allowHeader = true
  } = options

  // Get token from cookie or Authorization header
  let token: string | null = null
  
  if (allowCookie) {
    token = getCookie(event, 'auth-token') || null
  }
  
  if (!token && allowHeader) {
    const authHeader = getHeader(event, 'authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }
  
  if (!token) {
    throw createApiError(
      STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.MISSING_TOKEN
    )
  }

  // Validate token and get user
  const result = await authService.validateToken(token)
  
  if (!result.success) {
    throw createApiError(
      result.code,
      result.message
    )
  }

  const user = result.data

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    throw createApiError(
      STATUS_CODES.FORBIDDEN,
      ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS
    )
  }

  // Add user to event context
  event.context.user = user
  
  return user
}

// Admin role requirement middleware
export const requireAdmin = async (event: any) => {
  return await requireAuth(event, { requiredRole: USER_ROLES.ADMIN })
}

// User role requirement middleware  
export const requireUser = async (event: any) => {
  return await requireAuth(event, { requiredRole: USER_ROLES.USER })
}

// Optional auth middleware (doesn't throw if no token)
export const optionalAuth = async (event: any) => {
  try {
    return await requireAuth(event)
  } catch (error) {
    // Return null if authentication fails
    return null
  }
}
