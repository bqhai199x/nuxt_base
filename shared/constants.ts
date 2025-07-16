// User roles
export const USER_ROLES = {
  USER: 0,
  ADMIN: 1
} as const

// Default user role
export const DEFAULT_USER_ROLE = USER_ROLES.USER

// Password hash salt rounds
export const BCRYPT_SALT_ROUNDS = 10

export const ERROR_MESSAGES = {
  MISSING_BODY: 'Request data cannot be empty',
  VALIDATION_ERROR: 'Validation failed',
  INVALID_JSON: 'Invalid JSON data',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  INVALID_CONTENT_TYPE: 'Content-Type must be application/json',
  MISSING_TOKEN: 'Authentication token was not provided',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this resource',
  RATE_LIMIT_EXCEEDED: 'Too many login attempts. Please try again later.',
  INVALID_CREDENTIALS: 'Email or password is incorrect',
  ACCOUNT_DISABLED: 'Account has been disabled',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User does not exist or has been disabled',
  INTERNAL_SERVER_ERROR: 'An error occurred during login',
  TOKEN_VALIDATION_ERROR: 'An error occurred during token validation',
  USER_ALREADY_EXISTS: 'This username is already taken',
  REGISTRATION_FAILED: 'An error occurred during registration',
} as const

export const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
} as const