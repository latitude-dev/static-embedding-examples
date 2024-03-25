import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang='en'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{title}</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />

        {import.meta.env.PROD ? (
          <link href='/static/assets/styles.css' rel='stylesheet' />
        ) : (
          <link href='/app/styles.css' rel='stylesheet' />
        )}
        <Script src='/app/client.ts' />
      </head>
      <body class='bg-gray-50 dark:bg-gray-900 container mx-auto gap-y-4 p-6'>
        <main>{children}</main>
      </body>
    </html>
  )
})
