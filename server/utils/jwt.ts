import jwt, { SignOptions } from 'jsonwebtoken'

export const serverJWT = {
  generateToken: (user: { id: number; username: string; role: number }): string => {
    const config = useRuntimeConfig()
    
    // Ensure JWT_SECRET is available
    if (!config.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    
    const secret = config.jwtSecret as string
    const expiresIn = (config.jwtExpiresIn as string) || '7d'
    
    const options: SignOptions = {
      expiresIn: expiresIn as any
    }
    
    return jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      secret,
      options
    )
  },

  verifyToken: async (token: string): Promise<any> => {
    try {
      const config = useRuntimeConfig()
      return jwt.verify(token, config.jwtSecret as string)
    } catch (error) {
      return null
    }
  },

  getTokenFromHeader: (authHeader: string): string | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  },

  getCurrentUser: async (token: string): Promise<{ userId: number; username: string; role: string } | null> => {
    const decoded = await serverJWT.verifyToken(token)
    if (!decoded) return null
    
    return {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    }
  }
}
