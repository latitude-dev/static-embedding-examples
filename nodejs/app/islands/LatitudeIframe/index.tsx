import { useState } from 'hono/jsx'
import Button from '../../components/Button'

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
    <>
      <div class='flex mb-2'>
        <Button type='button' onClick={() => setUseToken(!usingToken)}>
          {usingToken ? 'Remove token' : 'Add token'}
        </Button>
      </div>
      <iframe
        src={url}
        style={{ width: '100%', height: '2500px' }}
        class='rounded-lg overflow-hidden'
      />
    </>
  )
}
