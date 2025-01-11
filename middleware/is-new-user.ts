export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser()

  if (user.value?.last_sign_in_at) {
    return navigateTo('/')
  }
})