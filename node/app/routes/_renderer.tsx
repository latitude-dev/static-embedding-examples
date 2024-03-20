import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import Button from '../components/Button'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" async />
        {import.meta.env.PROD ? (
          <link href='/static/assets/style.css' rel='stylesheet' />
        ) : (
          <link href='/app/style.css' rel='stylesheet' />
        )}
      </head>
      <body class="bg-gray-50 dark:bg-gray-900 container mx-auto gap-y-4 p-6">
        <main>{children}</main>
      </body>
    </html>
  )
})
