import { useAuthStore } from '@/stores/auth'

export async function authGuard(to, from, next) {
  const authStore = useAuthStore()

  // AUTENTIKASI-ROLE
  if (to.name === 'Login' && authStore.isAuthenticated)
    return next({ path: '/' })

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) return next({ name: 'Login' })
    if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role))
      return next({ name: 'Unauthorized' })
  }

  // COOKIE CONSENT
  const protectedPages = ['Question', 'Finish'] // halaman survey sensitif
  const consent = localStorage.getItem('cookie_consent')

  if (protectedPages.includes(to.name) && !consent) {
    return next({ name: 'Start Survey' }) // redirect ke welcome / cookie
  }

  next()
}
