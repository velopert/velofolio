import React from 'react'
import { css } from '@emotion/react'
import palette from '../../lib/palette'

export type LabSettingsSectionProps = {
  title: string
  children: React.ReactNode
}

function LabSettingsSection({ title, children }: LabSettingsSectionProps) {
  return (
    <section css={sectionStyle}>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

const sectionStyle = css`
  h3 {
    color: ${palette.blueGrey[800]};
    font-size: 1rem;
    line-height: 1.5rem;
    margin-top: 0;
    margin-bottom: 0.75rem;
  }
`
const contentStyle = css``

export default LabSettingsSection
