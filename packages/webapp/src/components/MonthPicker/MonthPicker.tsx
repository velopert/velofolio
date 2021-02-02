import { css } from '@emotion/react'
import { useMemo, useRef, useState } from 'react'
import palette from '../../lib/palette'
import VeloIcon from '../VeloIcon'
import useOnClickOutside from 'use-onclickoutside'
import { MonthYearValue } from '../../types/MonthYearValue'

export type MonthPickerProps = {
  minimum?: MonthYearValue
  maximum?: MonthYearValue
  visible: boolean
  value: MonthYearValue
  onChange(value: MonthYearValue): void
  onClose: Parameters<typeof useOnClickOutside>[1]
}

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function getMonthDisabled(
  current: MonthYearValue,
  i: number,
  min?: MonthYearValue,
  max?: MonthYearValue
) {
  if (current.year === min?.year) {
    return i + 1 < min.month
  } else if (current.year === max?.year) {
    return i + 1 > max.month
  } else {
    return false
  }
}
function MonthPicker({
  value,
  onChange,
  onClose,
  visible,
  minimum,
  maximum,
}: MonthPickerProps) {
  const [localValue, setLocalValue] = useState(value)
  const onClickPrev = () => {
    if (localValue.year === minimum?.year) return
    setLocalValue({ ...localValue, year: localValue.year - 1 })
  }
  const onClickNext = () => {
    if (localValue.year === maximum?.year) return
    setLocalValue({ ...localValue, year: localValue.year + 1 })
  }
  const ref = useRef<HTMLDivElement>(null)

  const years = useMemo(() => {
    const { year: minYear } = minimum || { year: 1950 }
    const { year: maxYear } = maximum || { year: new Date().getFullYear() + 50 }
    return Array.from({ length: maxYear - minYear + 1 }).map(
      (_, i) => minYear + i
    )
  }, [])

  useOnClickOutside(ref, onClose)

  if (!visible) return null

  return (
    <div css={block} ref={ref}>
      <div css={header}>
        <button
          css={arrowButton}
          onClick={onClickPrev}
          disabled={localValue.year === minimum?.year}
        >
          <VeloIcon name="arrow_left" />
        </button>
        <select
          name="year"
          value={localValue.year}
          onChange={(e) => {
            setLocalValue({
              ...localValue,
              year: parseInt(e.target.value, 10),
            })
          }}
          css={year}
        >
          {years.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          css={arrowButton}
          onClick={onClickNext}
          disabled={localValue.year === maximum?.year}
        >
          <VeloIcon name="arrow_right" />
        </button>
      </div>
      <div css={monthsStyle}>
        {months.map((month, i) => {
          return (
            <button
              css={monthItem(
                localValue.year === value.year &&
                  months[value.month - 1] === month
              )}
              key={month}
              onClick={() => {
                onChange({
                  month: i + 1,
                  year: localValue.year,
                })
              }}
              disabled={getMonthDisabled(localValue, i, minimum, maximum)}
            >
              {month}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const block = css`
  bottom: -0.0625rem;
  width: 16rem;

  position: absolute;
  background: white;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.07);
  border-radius: 0.5rem;
  transform: translate3d(0, 100%, 0);
  z-index: 5;
  overflow: hidden;
`

const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const arrowButton = css`
  background: none;
  border: none;
  outline: none;
  padding: 0.5rem;
  display: flex;

  &:enabled {
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  color: ${palette.blueGrey[900]};
  &:disabled {
    color: ${palette.blueGrey[200]};
  }
`

const year = css`
  line-height: 1.5;
  font-size: 1rem;
  font-weight: bold;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  color: inherit;
  outline: none;
  &:focus-visible {
    background: rgba(0, 0, 0, 0.05);
  }
  background: none;
  &:focus {
    background: none;
  }
  cursor: pointer;
`

const monthsStyle = css`
  display: flex;
  flex-wrap: wrap;
  color: ${palette.blueGrey[600]};
`
const monthItem = (active?: boolean) => css`
  border: none;
  background: none;
  color: inherit;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  width: 33.3333%;
  font-size: 0.875rem;
  user-select: none;
  outline: none;
  &:enabled {
    cursor: pointer;
    &:hover {
      background: ${active ? palette.teal[400] : 'rgba(0, 0, 0, 0.05)'};
    }
    ${active &&
    css`
      background: ${palette.teal[500]};
      color: white;
      font-weight: bold;
    `}
  }
  &:disabled {
    color: ${palette.blueGrey[100]};
  }

  &:focus-visible {
    background: rgba(0, 0, 0, 0.05);
  }
`

export default MonthPicker
