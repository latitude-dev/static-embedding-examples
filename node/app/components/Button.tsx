export default function Button({
  children,
  type = 'submit',
}: {
  children: string
  type: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      class='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800'
    >
      {children}
    </button>
  )
}
