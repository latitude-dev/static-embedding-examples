import { jsxRenderer } from 'hono/jsx-renderer'
import { HasIslands } from 'honox/server'
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
          <HasIslands>
            <script type='module' src='/static/client.js'></script>
          </HasIslands>
        ) : (
          <script type='module' src='/app/client.ts'></script>
        )}

        {import.meta.env.PROD ? (
          <link href='/static/assets/style.css' rel='stylesheet' />
        ) : (
          <link href='/app/style.css' rel='stylesheet' />
        )}
      </head>
      <body class='bg-gray-50 dark:bg-gray-900 container mx-auto gap-y-4 p-6'>
        <main>{children}</main>
      </body>
    </html>
  )
})
