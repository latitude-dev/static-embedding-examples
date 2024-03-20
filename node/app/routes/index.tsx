import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { Context } from 'hono'
import Header from '../components/Header'

export default createRoute((c: Context) => {
  const session = getCookie(c, 'session')

  if (!session) return c.redirect('/login')

  return c.render(
    <>
      <Header isLogin />
      <h1>Hello World</h1>
    </>,
  )
})
