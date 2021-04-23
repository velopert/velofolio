import { css } from '@emotion/react'
import { useEffect, useMemo, useRef } from 'react'
import { undrawNotFound } from '../../assets/images'
import useBacktestsQuery from '../../hooks/query/useBacktestsQuery'
import media from '../../lib/styles/media'
import BacktestsGridItem from '../BacktestsGridItem'
import BacktestsGridItemSkeleton from '../BacktestsGridItemSkeleton'
import ImageWithDescription from '../ImageWithDescription'
export type BacktestsGridProps = {
  userId?: number
}

function BacktestsGrid({ userId }: BacktestsGridProps) {
  const { data, hasNextPage, fetchNextPage } = useBacktestsQuery(userId)
  const items = useMemo(() => {
    if (!data) return null
    return data.pages.flat()
  }, [data])
  const ref = useRef<HTMLDivElement>(null)

  const observer = useMemo(
    () =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchNextPage()
          }
        })
      }),
    [fetchNextPage]
  )

  useEffect(() => {
    if (!items) return
    if (!ref.current) return
    const el = ref.current
    observer.observe(el)
    return () => {
      observer.unobserve(el)
    }
  }, [observer, items])

  if (items && items.length === 0) {
    return (
      <div css={wrapper}>
        <ImageWithDescription
          image={undrawNotFound}
          description="List is empty"
        />
      </div>
    )
  }

  return (
    <div css={block}>
      <div css={grid}>
        {items
          ? items.map((item) => (
              <BacktestsGridItem key={item.id} backtest={item} />
            ))
          : Array.from({ length: 10 }).map((_, i) => (
              <BacktestsGridItemSkeleton key={i} />
            ))}
        {/* <div ref={ref} /> */}
        {hasNextPage &&
          Array.from({ length: 10 }).map((_, i) => (
            <BacktestsGridItemSkeleton
              key={i}
              ref={i === 0 ? ref : undefined}
            />
          ))}
      </div>
    </div>
  )
}

const block = css`
  width: 100%;
  padding-right: 2rem;
  display: flex;
  justify-content: center;
`
const grid = css`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 4rem 2rem;
  ${media.xxxlarge} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${media.xxlarge} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${media.xlarge} {
    width: auto;
    grid-template-columns: repeat(2, 1fr);
  }
  ${media.custom(1050)} {
    width: 100%;
    grid-template-columns: 1fr;
  }
`

const wrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
  top: 0;
  width: calc(100% - 16.25rem);
`

export default BacktestsGrid
