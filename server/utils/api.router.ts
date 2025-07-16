import type { H3Event } from 'h3'
import { createApiError } from '~/server/utils/api.helpers'
import { ERROR_MESSAGES, STATUS_CODES } from '~/shared/constants'

// HTTP method enum
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

// Route handler type
export type RouteHandler = (event: H3Event) => Promise<any>

// Route configuration
export interface RouteConfig {
  method: HttpMethod
  handler: RouteHandler
  middleware?: ((event: H3Event) => Promise<void>)[]
}

// API Router class for better route management
export class ApiRouter {
  private routes: Map<HttpMethod, RouteHandler> = new Map()
  private middleware: ((event: H3Event) => Promise<void>)[] = []

  // Add route handler for specific method
  method(method: HttpMethod, handler: RouteHandler): this {
    this.routes.set(method, handler)
    return this
  }

  // Convenience methods
  get(handler: RouteHandler): this {
    return this.method(HttpMethod.GET, handler)
  }

  post(handler: RouteHandler): this {
    return this.method(HttpMethod.POST, handler)
  }

  put(handler: RouteHandler): this {
    return this.method(HttpMethod.PUT, handler)
  }

  delete(handler: RouteHandler): this {
    return this.method(HttpMethod.DELETE, handler)
  }

  patch(handler: RouteHandler): this {
    return this.method(HttpMethod.PATCH, handler)
  }

  // Add middleware
  use(middleware: (event: H3Event) => Promise<void>): this {
    this.middleware.push(middleware)
    return this
  }

  // Create the event handler
  handler(): RouteHandler {
    return async (event: H3Event) => {
      const method = event.node.req.method as HttpMethod
      
      // Check if method is supported
      if (!this.routes.has(method)) {
        const allowedMethods = Array.from(this.routes.keys()).join(', ')
        throw createApiError(
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.METHOD_NOT_ALLOWED,
        )
      }

      // Execute middleware
      for (const middleware of this.middleware) {
        await middleware(event)
      }

      // Execute route handler
      const handler = this.routes.get(method)!
      return await handler(event)
    }
  }
}

// Factory function to create router
export const createApiRouter = (): ApiRouter => {
  return new ApiRouter()
}

// Common middleware functions
export const commonMiddleware = {
  // CORS middleware
  cors: (origin = '*') => async (event: H3Event) => {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    if (event.node.req.method === 'OPTIONS') {
      setResponseStatus(event, 200)
      return null
    }
  },

  // Request logging middleware
  logging: async (event: H3Event) => {
    const timestamp = new Date().toISOString()
    const method = event.node.req.method
    const url = event.node.req.url
    console.log(`[${timestamp}] ${method} ${url}`)
  },

  // Content-Type validation
  jsonOnly: async (event: H3Event) => {
    const method = event.node.req.method
    if (method && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = getHeader(event, 'content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw createApiError(
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.INVALID_CONTENT_TYPE,
        )
      }
    }
  }
}
