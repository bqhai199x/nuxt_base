import { createApiRouter } from '~/server/utils/api.router'
import { authService } from '~/server/services/auth.service'
import { 
  createApiError, 
  createSuccessResponse,
  handleAsync
} from '~/server/utils/api.helpers'
import { ERROR_MESSAGES, STATUS_CODES } from '~/shared/constants'
import { getCookie, getHeader } from 'h3'

const router = createApiRouter()

// GET /api/auth/me
router.get(async (event) => {
  return await handleAsync(async () => {
    // Get token from cookie or Authorization header
    let token = getCookie(event, 'auth-token')
    
    if (!token) {
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
    
    // Return user data
    return createSuccessResponse(event, result, 'User information retrieved successfully')
  })
})

export default defineEventHandler(router.handler())
