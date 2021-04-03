import { useEffect, useLayoutEffect } from 'react'
import { useLabLoadingState, useLabSettingSync } from '../atoms/labSettingState'
import useBacktestQuery from './query/useBacktestQuery'

export default function useBacktestLoad(id: number) {
  const [loading, setLoading] = useLabLoadingState()

  const { data } = useBacktestQuery(id, { enabled: id !== 0 })
  const sync = useLabSettingSync()

  useLayoutEffect(() => {
    if (id !== 0) {
      console.log('loadme')
      setLoading(true)
    }
  }, [id, setLoading])

  useEffect(() => {
    if (!data) return
    sync(data)
  }, [data, sync])

  return {
    loading,
  }
}
