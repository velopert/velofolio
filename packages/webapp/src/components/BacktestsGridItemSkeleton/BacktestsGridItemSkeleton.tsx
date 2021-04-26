import { css, keyframes } from '@emotion/react'
import { forwardRef } from 'react'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'
export type BacktestsGridItemSkeletonProps = {}

function BacktestsGridItemSkeleton(
  {}: BacktestsGridItemSkeletonProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} css={card}>
      <div css={imageWrapper}></div>
      <div css={userBadgeWrapper}>
        <div css={userBadge}>
          <div className="circle" />
        </div>
      </div>
      <div css={content}>
        <div css={[skeleton, titleSkeleton]} />
        <div css={rows}></div>
        <div css={[skeleton, rowSkeleton]} />
        <div css={[skeleton, rowSkeleton]} />
        <div css={[skeleton, rowSkeleton]} />
      </div>
    </div>
  )
}

const shining = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`

const card = css`
  width: 21.625rem;
  height: 26rem;
  box-shadow: 0px 1rem 1rem rgba(67, 67, 67, 0.03);
  border-radius: 2rem;
  ${media.xlarge} {
    width: 100%;
    /* grid-template-columns: 1fr; */
  }
`

const imageWrapper = css`
  position: relative;
  background: ${palette.grey[50]};
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  padding-top: 2rem;
  padding-bottom: 1rem;
  height: 13.8125rem;
  animation: ${shining} 1s ease-in-out infinite;
`

const userBadgeWrapper = css`
  display: flex;
  width: 100%;
  padding-right: 1rem;
  justify-content: flex-end;
`

const userBadge = css`
  width: 5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0px 0.125rem 0.3125rem rgba(0, 0, 0, 0.06);
  display: flex;
  padding-left: 0.25rem;
  padding-right: 0.5rem;
  align-items: center;
  transform: translateY(-0.75rem);

  .circle {
    display: block;
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    background: ${palette.blueGrey[50]};
    animation: ${shining} 1s ease-in-out infinite;
  }
`

const content = css`
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  h3 {
    line-height: 1.5;
    margin: 0;
    font-size: 1.25rem;
    font-weight: bold;
    color: ${palette.blueGrey[900]};
    margin-bottom: 0.5rem;
  }
`

const skeleton = css`
  background: ${palette.blueGrey[50]};
  border-radius: 0.25rem;
  animation: ${shining} 1s ease-in-out infinite;
`

const titleSkeleton = css`
  height: 1.25rem;
  width: 10rem;
  margin-top: 0.3125rem;
  margin-bottom: 0.3125rem;
`

const rows = css`
  margin-top: 2.5625rem;
`

const rowSkeleton = css`
  width: 100%;
  height: 0.75rem;
  margin-top: 0.1875rem;
  margin-bottom: 0.1875rem;

  & + & {
    margin-top: 0.4375rem;
  }
`

export default forwardRef<HTMLDivElement, BacktestsGridItemSkeletonProps>(
  BacktestsGridItemSkeleton
)
