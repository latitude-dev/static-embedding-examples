import { createRoute } from 'honox/factory'
import { getCookie, setCookie } from 'hono/cookie'
import Header from '../components/Header'

const DUMMY_USER = 'latitude'
const DUMMY_PASSWORD = 'latitude_secret'
export const POST = createRoute(async (c) => {
  const { username, password } = await c.req.parseBody<{
    username: string
    password: string
  }>()
  if (username !== DUMMY_USER || password !== DUMMY_PASSWORD) {
    return c.redirect('/login?error=1')
  }

  setCookie(c, 'session', '1') // Hardcode session user ID 1
  return c.redirect('/login')
})

export default createRoute((c) => {
  const error = c.req.query('error')
  const session = getCookie(c, 'session')

  if (session === '1') {
    return c.redirect('/')
  }

  return c.render(
    <>
      <Header isLogin={false} />
      <div class='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div class='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div class='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 class='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              My secret Dashboard
            </h1>
            {error && (
              <div>
                <p class='text-sm font-medium text-red-500 dark:text-red-400'>
                  Wrong username or password
                </p>
                <p class='text-sm font-medium text-red-500 dark:text-red-400'>
                  Psss use <strong>{DUMMY_USER}</strong> as username and{' '}
                  <strong>{DUMMY_PASSWORD}</strong> as password
                </p>
              </div>
            )}
            <form class='space-y-4 md:space-y-6' method='POST'>
              <div>
                <label
                  for='username'
                  class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Username
                </label>
                <input
                  type='text'
                  name='username'
                  id='username'
                  class='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder={DUMMY_USER}
                  required
                />
              </div>
              <div>
                <label
                  for='password'
                  class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  class='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
              </div>
              <button
                type='submit'
                class='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800'
              >
                Login
              </button>
              <p class='text-sm font-light text-gray-500 dark:text-gray-400'>
                Use <strong>{DUMMY_USER}</strong> as username and{' '}
                <strong>{DUMMY_PASSWORD}</strong> as password
              </p>
            </form>
          </div>
        </div>
      </div>
    </>,
  )
})
