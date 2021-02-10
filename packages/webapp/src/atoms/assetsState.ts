import { useCallback, useEffect } from 'react'
import {
  atom,
  useRecoilState,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'

const assetsState = atom<AssetWeight[]>({
  key: 'assetsState',
  default: [],
})

export type AssetWeight = {
  id: number
  image: string | null
  ticker: string
  weight: number
}

export function useAssetsActions() {
  const set = useSetRecoilState(assetsState)
  const reset = useResetRecoilState(assetsState)

  const append = useCallback(
    (assetWeight: AssetWeight) => {
      set((prev) => prev.concat(assetWeight))
    },
    [set]
  )

  return {
    reset,
    append,
  }
}

export function useAssetsState() {
  return useRecoilState(assetsState)
}

export function useResetAssetsUnmountEffect() {
  const reset = useResetRecoilState(assetsState)
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])
}
