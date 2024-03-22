import { RedirectPath } from '../lib/handleSessionRedirect'
import Button from './Button'

export default function Header({ isLogin }: { isLogin: boolean }) {
  return (
    <header class='flex items-center justify-between'>
      <a href='/' class='-m-1.5 p-1.5'>
        <span class='sr-only'>Latitude example</span>
        <img
          class='h-8 w-auto'
          src='https://cdn.sanity.io/images/n7wdrkrw/production/b30fe3307a21c83de2a955880ee614aa16e60248-79x15.svg'
          alt='Latitude Example'
        />
      </a>
      {isLogin && (
        <div class='flex gap-x-3 items-center'>
          <a href={`${RedirectPath.credentials}?edit=1`} class='text-blue-500 underline'>
            Edit credentials
          </a>
          <form action='/logout' method='POST'>
            <Button type='submit'>Logout</Button>
          </form>
        </div>
      )}
    </header>
  )
}
