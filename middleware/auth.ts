export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getCurrentUser, isAuthenticated } = useAuth()

  // Check if user is already authenticated
  if (!isAuthenticated.value) {
    const user = await getCurrentUser()
    
    // Redirect to login if authentication fails
    if (!user) {
      return navigateTo('/login')
    }
  }
})
