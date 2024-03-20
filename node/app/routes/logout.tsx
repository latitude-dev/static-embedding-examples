import { createRoute } from 'honox/factory'
import { deleteCookie } from 'hono/cookie'

export const POST = createRoute(async (c) => {
  deleteCookie(c, 'session')
  return c.redirect('/login')
})
