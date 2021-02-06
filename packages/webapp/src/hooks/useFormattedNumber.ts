import { useCallback, useState } from 'react'

export default function useFormattedNumber(defaultValue: number) {
  const [value, setValue] = useState(defaultValue.toLocaleString())
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const number = parseInt(e.target.value.replace(/[^\d]+/g, ''), 10)
    if (isNaN(number)) {
      setValue('0')
      return
    }
    setValue(number.toLocaleString())
  }, [])

  return [value, onChange, setValue] as const
}
