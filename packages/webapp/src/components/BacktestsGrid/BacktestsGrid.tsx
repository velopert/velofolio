import { css } from '@emotion/react'
import useBacktestsQuery from '../../hooks/query/useBacktestsQuery'
export type BacktestsGridProps = {
  userId?: number
}

function BacktestsGrid({ userId }: BacktestsGridProps) {
  const { data, hasNextPage, fetchNextPage } = useBacktestsQuery(userId)
  return <div>BacktestsGrid</div>
}

export default BacktestsGrid
