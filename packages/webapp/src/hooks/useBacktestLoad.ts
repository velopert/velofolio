import { useEffect, useLayoutEffect } from 'react'
import { useLabLoadingState, useLabSettingSync } from '../atoms/labSettingState'
import useBacktestQuery from './query/useBacktestQuery'

export default function useBacktestLoad(id: number) {
  const [loading, setLoading] = useLabLoadingState()

  useLayoutEffect(() => {
    if (id !== 0) {
      setLoading(true)
    }
  }, [id, setLoading])
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
