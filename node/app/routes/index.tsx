import { createRoute } from 'honox/factory'
import { Context } from 'hono'
import Header from '../components/Header'
import { getLatitudeCredentials, handleSessionRedirect } from '../lib/handleSessionRedirect'

export default createRoute((c: Context) => {
  const redirect = handleSessionRedirect({ context: c, redirectIfOk: false })
  if (redirect) return c.redirect(redirect)

  const { siteUrl, secretKey } = getLatitudeCredentials(c)

  return c.render(
    <>
      <Header isLogin />
      <h1>Data</h1>
      Site URL: {siteUrl}
      <br />
      Secret Key: {secretKey}
    </>,
  )
})
