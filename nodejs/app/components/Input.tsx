export default function Input({
  id,
  name,
  label,
  value,
  placeholder,
  required
}: Hono.InputHTMLAttributes & { label?: string }
) {
  return (
    <div class='w-full'>
      {label && (
        <label
          for={name}
          class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
        >
          {label}{required && ' *'}
        </label>
      )}
      <input
        required={required}
        type='text'
        name={name}
        id={id ?? name}
        class='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        placeholder={placeholder}
        value={value}
      />
    </div>
  )
}
