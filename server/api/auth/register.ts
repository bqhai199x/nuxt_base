import { createApiRouter } from '~/server/utils/api.router'
import { userService } from '~/server/services/user.service'
import { serverJWT } from '~/server/utils/jwt'
import { 
  validateBody, 
  validationSchemas, 
  createApiError, 
  createSuccessResponse, 
  setSecureCookie, 
  handleAsync
} from '~/server/utils/api.helpers'
import { ERROR_MESSAGES, STATUS_CODES } from '~/shared/constants'

const router = createApiRouter()

// POST /api/auth/register
router.post(async (event) => {
  return await handleAsync(async () => {
    const userData = await validateBody(event, validationSchemas.register)
    
    try {
      // Check if user already exists
      const existingUser = await userService.getUserByUsername(userData.username)
      if (existingUser) {
        throw createApiError(
          STATUS_CODES.CONFLICT,
          ERROR_MESSAGES.USER_ALREADY_EXISTS
        )
      }
      
      // Create user
      const user = await userService.createUser({
        username: userData.username,
        name: userData.name,
        password: userData.password,
      })
      
      // Generate JWT token
      const token = await serverJWT.generateToken({
        id: user.id,
        username: user.username,
        role: user.role
      })
      
      // Set secure HTTP-only cookie
      setSecureCookie(event, 'auth-token', token, {
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      // Return success response
      return createSuccessResponse(event, {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      }, 'Registration successful')
      
    } catch (error: any) {
      // Handle database constraint errors
      if (error.code === 'P2002') {
        throw createApiError(
          STATUS_CODES.CONFLICT,
          ERROR_MESSAGES.USER_ALREADY_EXISTS
        )
      }
      
      // Re-throw known API errors
      if (error.statusCode) {
        throw error
      }
      
      // Handle unexpected errors
      throw createApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.REGISTRATION_FAILED
      )
    }
  })
})

export default defineEventHandler(router.handler())
