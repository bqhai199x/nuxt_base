import { createApiRouter } from '~/server/utils/api.router'
import { 
  createSuccessResponse,
  handleAsync
} from '~/server/utils/api.helpers'
import { getCookie, setCookie } from 'h3'

const router = createApiRouter()

// POST /api/auth/logout
router.post(async (event) => {
  return await handleAsync(async () => {
    // Get current token from cookie
    const currentToken = getCookie(event, 'auth-token')
    
    // Clear auth cookie
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Immediately expire
    })
    
    // Return success response
    return createSuccessResponse(event, {}, 'Logout successful')
  })
})

export default defineEventHandler(router.handler())
