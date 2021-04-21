import { useEffect } from 'react'
import useResetLab from './useResetLab'

export default function useResetLabEffect() {
  const reset = useResetLab(true)
  useEffect(() => {
    reset()
  }, [reset])
}
