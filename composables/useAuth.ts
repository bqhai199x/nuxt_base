import { USER_ROLES, type LoginInput, type UserResponse } from "~/shared/types"

export const useAuth = () => {
  const user = useState<UserResponse | null>('auth.user', () => null)

  const login = async (credentials: LoginInput) => {
    const { data, error } = await useFetch<{data: UserResponse}>('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    
    if (error.value) {
      throw createError({
        statusCode: error.value.statusCode || 401,
        message: error.value.data?.message || 'Đăng nhập thất bại'
      })
    }
    
    if (data.value) {
      user.value = data.value.data
    }
    
    return user.value
  }

  const logout = async () => {
    const { error } = await useFetch('/api/auth/logout', { 
      method: 'POST'
    })
    
    if (error.value) {
      console.error('Logout error:', error.value)
    }
    
    user.value = null
    await navigateTo('/login')
  }

  const getCurrentUser = async () => {
    const { data, error } = await useFetch<{data: UserResponse}>('/api/auth/me')
    
    if (error.value) {
      user.value = null
    } else if (data.value) {
      user.value = data.value.data
    }
    
    return user.value
  }

  const isAuthenticated = computed(() => {
    return !!user.value
  })

  const isAdmin = computed(() => {
    return user.value?.role === USER_ROLES.ADMIN
  })

  const initialize = async () => {
    if (import.meta.client && !user.value) {
      const route = useRoute()
      if (!['/login', '/register'].includes(route.path)) {
        await getCurrentUser()
      }
    }
  }

  if (import.meta.client) {
    initialize()
  }

  return {
    user: readonly(user),
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin
  }
}
