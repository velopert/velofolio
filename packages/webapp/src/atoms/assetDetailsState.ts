import produce from 'immer'
import { useMemo } from 'react'
import {
  atom,
  DefaultValue,
  selectorFamily,
  useRecoilCallback,
  useSetRecoilState,
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

export function useAssetDetailsActions() {
  const loadTicker = useRecoilCallback(({ set }) => async (ticker: string) => {
    set(assetDetailState(ticker), loadableHandlers.load())
    try {
      const asset = await getAsset(ticker)
      set(assetDetailState(ticker), loadableHandlers.success(asset))
    } catch (e) {
      set(assetDetailState(ticker), loadableHandlers.error(e))
    }
  })

  return useMemo(() => ({ loadTicker }), [loadTicker])
}
