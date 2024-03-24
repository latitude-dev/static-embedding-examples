import { Context } from 'hono'
import { getCookie } from 'hono/cookie'

export enum SessionKey {
  session = 'session',
  siteUrl = 'site_url',
  secretMaster = 'secret_master_key',
  SignedParams = 'signed_params',
}
export enum RedirectPath {
  login = '/login',
  credentials = '/credentials',
  home = '/',
}

function signedParamsToJSON(context: Context): Record<string, unknown> {
  const signedParams = getCookie(context, SessionKey.SignedParams)
  if (!signedParams) return {}

  try {
    return JSON.parse(signedParams, (_, value) => {
      return typeof value === 'string' && !isNaN(Number(value))
        ? Number(value)
        : value
    })
  } catch {
    return {}
  }
}
export function getLatitudeCredentials(context: Context) {
  const siteUrl = getCookie(context, SessionKey.siteUrl)
  const secretKey = getCookie(context, SessionKey.secretMaster)
  const signedParams = signedParamsToJSON(context)

  return { siteUrl, secretKey, signedParams }
}

export function handleSessionRedirect({
  context,
  redirectIfOk,
}: {
  context: Context
  redirectIfOk: boolean
}) {
  const session = getCookie(context, SessionKey.session)
  const edit = context.req.query('edit') === '1'
  const path = context.req.path
  const isEditing = edit && path === RedirectPath.credentials

  if (!session) {
    return '/login'
  }

  const { siteUrl, secretKey } = getLatitudeCredentials(context)

  if (!siteUrl || !secretKey || isEditing) {
    return '/credentials'
  }

  if (redirectIfOk) {
    return '/'
  }
}
