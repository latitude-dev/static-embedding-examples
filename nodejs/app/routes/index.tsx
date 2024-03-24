import { createRoute } from 'honox/factory'
import { Context } from 'hono'
import Header from '../components/Header'
import {
  getLatitudeCredentials,
  handleSessionRedirect,
} from '../lib/handleSessionRedirect'
import { ValidTokenResponse, signJwt, verifyJWT } from '@latitude-data/jwt'
import LatitudeIframe from '../islands/LatitudeIframe'

function InfoItem({ label, children }: { label: string; children: string }) {
  return (
    <li>
      <span class='font-semibold'>{label}</span>:
      <div className="font-mono max-w-full truncate text-sm text-gray-600">{children}</div>
    </li>
  )
}

function InfoBox({
  siteUrl,
  masterKey,
  token,
  tokenData,
}: {
  siteUrl: string
  masterKey: string
  token: string
  tokenData: ValidTokenResponse
}) {
  return (
    <div class='bg-blue-50 border border-blue-100 p-4 rounded-lg flex flex-col gap-y-4'>
      <h1 class='text-xl font-medium'>Info</h1>
      <ul class='flex flex-col gap-y-2'>
        <InfoItem label='Latitude Data URL' children={siteUrl} />
        <InfoItem label='Master Key' children={masterKey} />
        <InfoItem label='Token' children={token} />
        <InfoItem
          label='Signed params'
          children={JSON.stringify(tokenData.payload)}
        />
      </ul>
    </div>
  )
}

export default createRoute(async (c: Context) => {
  const redirect = handleSessionRedirect({ context: c, redirectIfOk: false })
  if (redirect) return c.redirect(redirect)

  const { siteUrl, secretKey } = getLatitudeCredentials(c)

  const masterKey = secretKey!
  const token = await signJwt({
    payload: { workspace_id: 1 },
    secretKey: masterKey,
  })

  if (token instanceof Error) return c.render(token.message)

  const tokenResolved = await verifyJWT({ secretKey: secretKey!, token })

  if (tokenResolved instanceof Error) return c.render(tokenResolved.message)

  return c.render(
    <>
      <Header isLogin />
      <div class='mt-10 flex flex-col gap-y-4'>
        <InfoBox
          siteUrl={siteUrl!}
          masterKey={masterKey}
          token={token}
          tokenData={tokenResolved}
        />
        <LatitudeIframe siteUrl={siteUrl!} token={token} />
      </div>
    </>,
  )
})
