import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLabLoadingState, useLabSettingSync } from '../atoms/labSettingState'
import useBacktestQuery from './query/useBacktestQuery'

export default function useBacktestLoad(id: number) {
  const [loading, setLoading] = useLabLoadingState()
  const mountedRef = useRef(false)

  useLayoutEffect(() => {
    if (id !== 0 && !mountedRef.current) {
      setLoading(true)
    }
  }, [id, setLoading])

  useEffect(() => {
    mountedRef.current = true
  }, [])

  const { data } = useBacktestQuery(id, { enabled: id !== 0 })
  const sync = useLabSettingSync()

  useEffect(() => {
    if (!data) return
    sync(data)
  }, [data, sync])

  return {
    loading,
  }
}
