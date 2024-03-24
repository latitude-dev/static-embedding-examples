import { createRoute } from 'honox/factory'
import { getCookie, setCookie } from 'hono/cookie'
import Header from '../components/Header'
import {
  RedirectPath,
  SessionKey,
  getLatitudeCredentials,
  handleSessionRedirect,
} from '../lib/handleSessionRedirect'
import Input from '../components/Input'
import Button from '../components/Button'
import SignedParams from '../islands/SignedParams'

export const POST = createRoute(async (c) => {
  const session = getCookie(c, 'session')

  if (!session) return c.redirect('/login')

  const formData = await c.req.parseBody<{
    site_url: string
    secret_master_key: string
    'signed_keys[]': string[]
    'signed_values[]': string[]
  }>()
  const siteUrl = formData[SessionKey.siteUrl]
  const masterKey = formData[SessionKey.secretMaster]
  const keyParam = formData['signed_keys[]'] || []
  const valueParam = formData['signed_values[]']
  const keys = Array.isArray(keyParam) ? keyParam : [keyParam]
  const values = Array.isArray(valueParam) ? valueParam : [valueParam]
  const signedParams = keys.reduce(
    (obj, key, index) => {
      obj[key] = values[index]
      return obj
    },
    {} as Record<string, string>,
  )

  if (!siteUrl || !masterKey) {
    return c.redirect('/credentials?error=1')
  }

  setCookie(c, SessionKey.siteUrl, siteUrl)
  setCookie(c, SessionKey.secretMaster, masterKey)
  setCookie(c, SessionKey.SignedParams, JSON.stringify(signedParams))

  return c.redirect('/')
})

export default createRoute((c) => {
  const error = c.req.query('error')

  const redirect = handleSessionRedirect({ context: c, redirectIfOk: true })

  if (redirect && redirect !== RedirectPath.credentials) {
    return c.redirect(redirect)
  }

  const { siteUrl, secretKey, signedParams } = getLatitudeCredentials(c)

  return c.render(
    <>
      <Header isLogin />
      <div class='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div class='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div class='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 class='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              Set your Latitude credentials
            </h1>
            {error && (
              <div>
                <p class='text-sm font-medium text-red-500 dark:text-red-400'>
                  Wrong site URL or secret master key. Please define both
                </p>
              </div>
            )}
            <form class='space-y-6' method='POST'>
              <Input
                required
                name={SessionKey.siteUrl}
                label='Site URL'
                value={siteUrl}
                placeholder='Ex.: http://localhost:3000'
              />
              <Input
                required
                name={SessionKey.secretMaster}
                label='Site URL'
                value={secretKey}
                placeholder='Put your LATITUDE_MASTER_KEY'
              />
              <div>
                <SignedParams signedParams={signedParams} />
              </div>
              <Button type='submit'>Store credentials</Button>
            </form>
          </div>
        </div>
      </div>
    </>,
  )
})
