import { Context } from 'hono'
import { getCookie } from 'hono/cookie'

export enum SessionKey {
  session = 'session',
  siteUrl = 'site_url',
  secretMaster = 'secret_master_key',
}
export enum RedirectPath {
  login = '/login',
  credentials = '/credentials',
  home = '/',
}

export function getLatitudeCredentials(context: Context) {
  const siteUrl = getCookie(context, SessionKey.siteUrl)
  const secretKey = getCookie(context, SessionKey.secretMaster)

  return { siteUrl, secretKey }
}

export function handleSessionRedirect({
  context,
  redirectIfOk,
}: {
  context: Context
  redirectIfOk: boolean
}) {
  const session = getCookie(context, SessionKey.session)
  const edit = context.req.query('edit') === "1"
  const path = context.req.path
  const isEditing = edit && path === RedirectPath.credentials
  console.log("IS_EDIdTING", isEditing)

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
