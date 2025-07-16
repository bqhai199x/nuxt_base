import type { H3Event } from 'h3'
import { z } from 'zod'
import { ERROR_MESSAGES, STATUS_CODES } from '~/shared/constants'

// Enhanced validation with better error messages
export const validationSchemas = {
  login: z.object({
    username: z.string()
      .min(1, 'Username cannot be empty'),
    password: z.string()
      .min(1, 'Password cannot be empty')
      .max(100, 'Password cannot exceed 100 characters')
  }),

  register: z.object({
    username: z.string()
      .min(4, 'Username must be at least 4 characters')
      .max(50, 'Username cannot exceed 50 characters'),
    name: z.string()
      .max(50, 'Name cannot exceed 50 characters')
      .optional(),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters')
  })
}

// Enhanced error factory
export const createApiError = (code: number, message: string) => {
  return createError({
    statusCode: code,
    statusMessage: message,
  })
}

// Get client IP address
export const getClientIp = (event: H3Event): string => {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const real = getHeader(event, 'x-real-ip')
  const cloudflare = getHeader(event, 'cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (real) {
    return real
  }
  
  if (cloudflare) {
    return cloudflare
  }
  
  return event.node.req.socket.remoteAddress || '127.0.0.1'
}

// Enhanced body validation
export const validateBody = async <T>(event: H3Event, schema: z.ZodSchema<T>) => {
  try {
    const body = await readBody(event)
    
    if (!body) {
      throw createApiError(
        STATUS_CODES.BAD_REQUEST,
        ERROR_MESSAGES.MISSING_BODY
      )
    }

    const result = schema.safeParse(body)
    
    if (!result.success) {
      const firstError = result.error.issues[0]
      throw createApiError(
        STATUS_CODES.BAD_REQUEST,
        firstError.message,
      )
    }
    
    return result.data
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createApiError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_JSON
    )
  }
}

// Enhanced response helper
export const createSuccessResponse = <T>(event: H3Event, data: T, message?: string, statusCode = STATUS_CODES.OK) => {
  setResponseStatus(event, statusCode)
  return {
    success: true,
    data,
    message: message || 'Success'
  }
}

// Set secure cookie helper
export const setSecureCookie = (event: H3Event, name: string, value: string, options: any = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...options
  }
  
  setCookie(event, name, value, defaultOptions)
}

// Handle async operations with proper error handling
export const handleAsync = async <T>(
  operation: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    if (errorHandler) {
      errorHandler(error)
    }
    throw error
  }
}
