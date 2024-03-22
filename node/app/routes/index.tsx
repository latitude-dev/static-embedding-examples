import { createRoute } from 'honox/factory'
import { Context } from 'hono'
import Header from '../components/Header'
import {
  getLatitudeCredentials,
  handleSessionRedirect,
} from '../lib/handleSessionRedirect'
import { signJwt, verifyJWT } from '../lib/jwt'


export default createRoute(async (c: Context) => {
  const redirect = handleSessionRedirect({ context: c, redirectIfOk: false })
  if (redirect) return c.redirect(redirect)

  const { siteUrl, secretKey } = getLatitudeCredentials(c)

  const token = await signJwt({ payload: { company_id: 33 }, secretKey: secretKey! })

  if (token instanceof Error) return c.render(token.message)

  const tokenResolved = await verifyJWT({ secretKey: secretKey!, token })

  if (tokenResolved instanceof Error) return c.render(tokenResolved.message)

  return c.render(
    <>
      <Header isLogin />
      <h1>Data</h1>
      Site URL: {siteUrl}
      <br />
      Secret Key: {secretKey}
      <br />
      <br />
      <br />
      Token: {token}
      <br />
      Token Resolved: {JSON.stringify(tokenResolved.payload)}
      <br />
      Token Metadata: {JSON.stringify(tokenResolved.metadata)}
      <br />
      Token protectedHeader: {JSON.stringify(tokenResolved.protectedHeader)}
    </>,
  )
})
