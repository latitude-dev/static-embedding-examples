import { createRoute } from 'honox/factory'
import { getCookie, setCookie } from 'hono/cookie'
import Header from '../components/Header'
import {
  RedirectPath,
  SessionKey,
  getLatitudeCredentials,
  handleSessionRedirect,
} from '../lib/handleSessionRedirect'

export const POST = createRoute(async (c) => {
  const session = getCookie(c, 'session')
  if (!session) {
    return c.redirect('/login')
  }
  const { site_url, secret_master_key } = await c.req.parseBody<{
    site_url: string
    secret_master_key: string
  }>()

  if (!site_url || !secret_master_key) {
    return c.redirect('/credentials?error=1')
  }

  setCookie(c, 'site_url', site_url)
  setCookie(c, 'secret_master_key', secret_master_key)

  return c.redirect('/')
})

export default createRoute((c) => {
  const error = c.req.query('error')

  const redirect = handleSessionRedirect({ context: c, redirectIfOk: true })

  if (redirect && redirect !== RedirectPath.credentials) {
    return c.redirect(redirect)
  }

  const { siteUrl, secretKey } = getLatitudeCredentials(c)

  return c.render(
    <>
      <Header isLogin />
      <div class='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div class='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
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
            <form class='space-y-4 md:space-y-6' method='POST'>
              <div>
                <label
                  for={SessionKey.siteUrl}
                  class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Site URL
                </label>
                <input
                  type='text'
                  name={SessionKey.siteUrl}
                  id={SessionKey.siteUrl}
                  class='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Ex.: http://localhost:3000'
                  value={siteUrl}
                  required
                />
              </div>
              <div>
                <label
                  for={SessionKey.secretMaster}
                  class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Secret Master Key
                </label>
                <input
                  type='text'
                  name={SessionKey.secretMaster}
                  id={SessionKey.secretMaster}
                  placeholder='Put here your LATITUDE_MASTER_KEY found in .env file'
                  class='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                  value={secretKey}
                />
              </div>
              <button
                type='submit'
                class='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800'
              >
                Store credentials
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
  )
})
