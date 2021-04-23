import { css } from '@emotion/react'
import palette from '../../lib/palette'

export type ReportSectionProps = {
  title: string
  children: React.ReactNode
}

function ReportSection({ title, children }: ReportSectionProps) {
  return (
    <section css={sectionStyle}>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

const sectionStyle = css`
  h3 {
    margin: 0;
    font-size: 1.125rem;
    color: ${palette.blueGrey[800]};
    margin-bottom: 1rem;
  }

  & + & {
    margin-top: 2rem;
  }
`

export default ReportSection
