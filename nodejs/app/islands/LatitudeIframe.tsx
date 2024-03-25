import { useState } from 'hono/jsx'
import Button from '../components/Button'

export default function LatitudeIframe({
  siteUrl,
  token,
}: {
  siteUrl: string
  token: string
}) {
  const [usingToken, setUseToken] = useState(false)
  const url = usingToken ? `${siteUrl}?__token=${token}` : siteUrl
  return (
    <div class='flex flex-col gap-y-3'>
      <div class='flex mb-2'>
        <Button type='button' onClick={() => setUseToken(!usingToken)}>
          {usingToken ? 'Remove token' : 'Add token'}
        </Button>
      </div>
      <pre class='bg-white p-4 rounded-lg shadow'>
        <code class='text-blue-500 font-mono text-ms'>{`<iframe src=${url} />`}</code>
      </pre>
      <iframe
        src={url}
        style={{ width: '100%', height: '2500px' }}
        class='rounded-lg overflow-hidden'
      />
    </div>
  )
}
