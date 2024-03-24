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
    <div>
      <span class='font-semibold'>{label}</span>:
      <div className='font-mono max-w-full truncate text-sm text-gray-600'>
        {children}
      </div>
    </div>
  )
}

function InfoWrapper({ children }: { children: JSX.IntrinsicElements['div'] }) {
  return (
    <div class='bg-blue-50 border border-blue-100 p-4 rounded-lg flex flex-col gap-y-4'>
      {children}
    </div>
  )
}

function InfoBox({
  siteUrl,
  masterKey,
  tokenData,
}: {
  siteUrl: string
  masterKey: string
  tokenData: ValidTokenResponse
}) {
  return (
    <InfoWrapper>
      <h1 class='text-xl font-medium'>Credentials</h1>
      <div class='flex flex-col gap-y-2'>
        <InfoItem label='Latitude Data URL' children={siteUrl} />
        <InfoItem label='Master Key' children={masterKey} />
        <InfoItem
          label='Signed params'
          children={JSON.stringify(tokenData.payload)}
        />
      </div>
    </InfoWrapper>
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
          tokenData={tokenResolved}
        />
        <InfoWrapper>
          <InfoItem label='Generated [TOKEN]' children={token} />
        </InfoWrapper>
        <LatitudeIframe siteUrl={siteUrl!} token={token} />
      </div>
    </>,
  )
})
