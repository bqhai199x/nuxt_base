export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAdmin, getCurrentUser } = useAuth()
  
  // Ensure user is loaded
  if (!user.value) {
    await getCurrentUser()
  }
  
  // Check admin permissions
  if (!isAdmin.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Bạn không có quyền truy cập trang này'
    })
  }
})
