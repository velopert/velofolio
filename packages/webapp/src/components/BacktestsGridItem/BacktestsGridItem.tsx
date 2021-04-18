import { css } from '@emotion/react'
import { useMemo } from 'react'
import { Backtest } from '../../lib/api/backtests/types'
import chartColors from '../../lib/chartColors'
import palette from '../../lib/palette'
import media from '../../lib/styles/media'
import { convertToPercentage } from '../../lib/utils/calculateIndicators'
import { intervalToDuration, formatDuration } from 'date-fns'
import { Link } from 'react-router-dom'
import { useSetLabLoading } from '../../atoms/labSettingState'
export type BacktestsGridItemProps = {
  backtest: Backtest
}

function BacktestsGridItem({ backtest }: BacktestsGridItemProps) {
  const setLoading = useSetLabLoading()
  const startLoading = () => {
    setLoading(true)
  }
  const duration = useMemo(() => {
    const d = intervalToDuration({
      start: new Date(backtest.end_date),
      end: new Date(backtest.start_date),
    })
    return formatDuration({
      years: d.years,
      months: d.months,
    })
  }, [backtest])
  return (
    <Link
      css={card}
      to={`/backtests/${backtest.id}`}
      onMouseDown={startLoading}
    >
      <div css={imageWrapper}>
        <div className="duration">{duration}</div>
        <img src={backtest.thumbnail} alt={`${backtest.title} chart`} />
      </div>
      <div css={userBadgeWrapper}>
        <div css={userBadge}>
          <img
            src={backtest.user.photo_url!}
            alt={backtest.user.display_name}
          />
          <div className="name">{backtest.user.username}</div>
        </div>
      </div>
      <section css={content}>
        <h3>{backtest.title}</h3>
        <div css={tableHead}>
          <div className="name">NAME</div>
          <div className="cagr">CAGR</div>
          <div className="sharpe">SHARPE</div>
        </div>
        <div css={rows}>
          {backtest.portfolios.slice(0, 3).map((portfolio, index) => (
            <div key={portfolio.id} className="row">
              <div css={colorCircle(chartColors[index])} />
              <div className="name">{portfolio.name}</div>
              <div className="cagr">
                {portfolio.cagr ? convertToPercentage(portfolio.cagr) : 'N/A'}
              </div>
              <div className="sharpe">
                {portfolio.sharpe ? portfolio.sharpe.toFixed(2) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
        {backtest.portfolios.length > 3 && (
          <div css={indicateMore}>
            ... and {backtest.portfolios.length - 3} more portfolios
          </div>
        )}
      </section>
    </Link>
  )
}

const card = css`
  display: block;
  width: 21.625rem;
  height: 26rem;
  box-shadow: 0px 1rem 1rem rgba(67, 67, 67, 0.03);
  border-radius: 2rem;
  text-decoration: none;
  transition: all ease-in 0.125s;
  &:hover {
    transform: translate3d(0, -0.25rem, 0);
    box-shadow: 0px 1.125rem 1.125rem rgba(67, 67, 67, 0.08);
  }

  ${media.custom(1050)} {
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
  img {
    width: 100%;
    height: 100%;
  }
  .duration {
    color: ${palette.blueGrey[300]};
    font-size: 0.75rem;
    line-height: 1.5;
    position: absolute;
    left: 1.25rem;
    top: 1.25rem;
  }
`

const userBadgeWrapper = css`
  display: flex;
  width: 100%;
  padding-right: 1rem;
  justify-content: flex-end;
`

const userBadge = css`
  height: 1.5rem;
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0px 0.125rem 0.3125rem rgba(0, 0, 0, 0.06);
  display: flex;
  padding-left: 0.25rem;
  padding-right: 0.5rem;
  align-items: center;

  img {
    display: block;
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    border-radius: 0.5rem;
  }
  .name {
    font-size: 0.75rem;
    font-weight: bold;
    color: ${palette.blueGrey[900]};
    line-height: 1.5;
  }

  transform: translateY(-0.75rem);
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

const tableHead = css`
  width: 100%;
  padding-left: 1.25rem;
  display: flex;
  font-size: 0.625rem;
  font-weight: bold;
  line-height: 1.5;
  color: ${palette.blueGrey[700]};
  margin-bottom: 0.5rem;
  .name {
    flex: 1;
  }
  .cagr {
    text-align: center;
    width: 4rem;
    margin-right: 0.5rem;
  }
  .sharpe {
    text-align: center;
    width: 2.5rem;
  }
`

const rows = css`
  .row {
    align-items: center;
    display: flex;
    color: ${palette.blueGrey[600]};
    font-size: 0.75rem;
    line-height: 1.5;
    .name {
      flex: 1;
    }
    .cagr {
      text-align: center;
      width: 4rem;
      margin-right: 0.5rem;
    }
    .sharpe {
      text-align: center;
      width: 2.5rem;
    }
  }

  .row + .row {
    margin-top: 0.25rem;
  }
`

const colorCircle = (color: string) => css`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.375rem;
  margin-right: 0.625rem;
  background: ${color};
`

const indicateMore = css`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${palette.blueGrey[300]};
`

export default BacktestsGridItem
