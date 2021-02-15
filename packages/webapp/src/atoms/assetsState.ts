import { useCallback, useEffect } from 'react'
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import produce from 'immer'

export const assetsState = atom<AssetWeight[]>({
  key: 'assetsState',
  default: [],
})

export const assetsWeightSum = selector({
  key: 'assetsWeightSum',
  get: ({ get }) => {
    const assets = get(assetsState)
    return assets.reduce((acc, current) => acc + current.weight, 0)
  },
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
      set((prev) => {
        const exist = prev.find((aw) => aw.id === assetWeight.id)
        return exist ? prev : prev.concat(assetWeight)
      })
    },
    [set]
  )

  const updateWeight = useCallback(
    (id: number, weight: number) => {
      set((prev) =>
        produce(prev, (draft) => {
          const asset = draft.find((a) => a.id === id)
          if (!asset) return
          asset.weight = weight
        })
      )
    },
    [set]
  )

  const remove = useCallback(
    (id: number) => {
      set((prev) => prev.filter((asset) => asset.id !== id))
    },
    [set]
  )

  return {
    set,
    reset,
    append,
    updateWeight,
    remove,
  }
}

export function useAssetsState() {
  return useRecoilState(assetsState)
}

export function useAssetsWeightSum() {
  return useRecoilValue(assetsWeightSum)
}

export function useResetAssetsUnmountEffect() {
  const reset = useResetRecoilState(assetsState)
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])
}
