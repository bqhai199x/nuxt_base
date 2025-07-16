import { createApiRouter } from '~/server/utils/api.router'
import { authService } from '~/server/services/auth.service'
import { 
  validateBody, 
  validationSchemas, 
  createApiError, 
  createSuccessResponse, 
  setSecureCookie, 
  getClientIp,
  handleAsync
} from '~/server/utils/api.helpers'

const router = createApiRouter()

// POST /api/auth/login
router.post(async (event) => {
  return await handleAsync(async () => {
    // Validate and parse request body
    const credentials = await validateBody(event, validationSchemas.login)
    
    // Get client IP for rate limiting
    const clientIp = getClientIp(event)
    
    // Authenticate user using service layer
    const result = await authService.login(credentials, clientIp)
    
    const { user, token } = result
    
    // Set secure HTTP-only cookie
    setSecureCookie(event, 'auth-token', token, {
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    // Return success response with user data
    return createSuccessResponse(event, {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    }, 'Login successful')
  })
})

export default defineEventHandler(router.handler())
