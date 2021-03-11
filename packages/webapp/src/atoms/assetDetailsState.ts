import produce from 'immer'
import { useMemo } from 'react'
import {
  atom,
  selector,
  DefaultValue,
  selectorFamily,
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil'
import { getAsset } from '../lib/api/assets/getAsset'
import { Asset } from '../lib/api/assets/types'
import { loadableHandlers, LoadableState } from '../lib/LoadableState'

type AssetDetailLoadable = LoadableState<Asset>

type AssetDetailsState = Record<string, AssetDetailLoadable | undefined>

const assetDetailsState = atom<AssetDetailsState>({
  key: 'assetDetailsState',
  default: {},
})

const assetDetailState = selectorFamily<AssetDetailLoadable, string>({
  key: 'assetDetailState',
  get: (ticker: string) => ({ get }) => {
    const details = get(assetDetailsState)
    const selectedAssetDetail: LoadableState<Asset, any> =
      details[ticker] ?? loadableHandlers.initial<Asset>()
    return selectedAssetDetail
  },
  set: (ticker: string) => ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return newValue
    set(assetDetailsState, (prevState) => ({
      ...prevState,
      [ticker]: newValue,
    }))
  },
})

const assetDetailsReady = selector({
  key: 'loadingAssetDetails',
  get: ({ get }) => {
    const assetDetails = get(assetDetailsState)
    const values = Object.values(assetDetails)
    return values.every((value) => value?.data)
  },
})

export function useAssetDetailsActions() {
  const loadTicker = useRecoilCallback(
    ({ set, snapshot }) => async (ticker: string) => {
      const assetDetail = await snapshot.getPromise(assetDetailState(ticker))
      if (assetDetail.data) return assetDetail.data
      set(assetDetailState(ticker), loadableHandlers.load())
      try {
        const asset = await getAsset(ticker)
        set(assetDetailState(ticker), loadableHandlers.success(asset))
        return asset
      } catch (e) {
        set(assetDetailState(ticker), loadableHandlers.error(e))
        throw e
      }
    }
  )

  return useMemo(() => ({ loadTicker }), [loadTicker])
}

export function useAssetDetailsReadyValue() {
  return useRecoilValue(assetDetailsReady)
}

export function useAssetDetailsValue() {
  return useRecoilValue(assetDetailsState)
}
