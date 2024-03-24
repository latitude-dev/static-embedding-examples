import { useState } from 'hono/jsx'
import Input from '../components/Input'

export default function SignedParams({
  signedParams,
}: {
  signedParams: Record<string, unknown>
}) {
  const [params, setParams] = useState<[string, unknown | string][]>(() => {
    const initial = Object.entries(signedParams)
    return initial.length === 0 ? [['', '']] : initial
  })

  function removeParam(index: number) {
    setParams((params) => [
      ...params.slice(0, index),
      ...params.slice(index + 1),
    ])
  }
  return (
    <fieldset class='border border-gray-300 rounded-lg p-4'>
      <legend class='text-lg font-medium'>Signed Params</legend>
      <div class='flex flex-col gap-y-4 w-full'>
        <div class='flex flex-col gap-y-2 w-full'>
          {params.map(([key, value], index) => (
            <div key={key} class='flex items-center gap-x-2 w-full'>
              <Input
                id={`key-${key}-${index}`}
                name='signed_keys[]'
                value={key}
                placeholder='key Ex.: company_id'
              />
              <Input
                id={`value-${value}-${index}`}
                name='signed_values[]'
                value={String(value)}
                placeholder='Value Ex.: 52'
              />
              <button
                className='rounded-lg border border-gray-200 hover:border-red-200 py-1 px-2.5 text-xs text-gray-500 hover:text-red-500 font-medium uppercase tracking-wider disabled:text-gray-300 hover:disabled:text-gray-300 disabled:border-gray-50 hover:disabled:border-gray-50'
                onClick={() => removeParam(index)}
                disabled={params.length < 2}
              >
                delete
              </button>
            </div>
          ))}
        </div>
        <button
          class='text-left text-blue-500'
          type='button'
          onClick={() => setParams([...params, ['', '']])}
        >
          + <span class='underline'>Add Param</span>
        </button>
      </div>
    </fieldset>
  )
}
