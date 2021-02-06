import React from 'react'
import { css, SerializedStyles } from '@emotion/react'
import palette from '../../lib/palette'

export type LabSettingsSectionProps = {
  title: string
  children: React.ReactNode
  contentStyle?: SerializedStyles
}

function LabSettingsSection({
  title,
  children,
  contentStyle,
}: LabSettingsSectionProps) {
  return (
    <section css={sectionStyle}>
      <h3>{title}</h3>
      <div css={contentStyle}>{children}</div>
    </section>
  )
}

const sectionStyle = css`
  & + & {
    margin-top: 1.5rem;
  }
  h3 {
    color: ${palette.blueGrey[800]};
    font-size: 1rem;
    line-height: 1.5rem;
    margin-top: 0;
    margin-bottom: 0.75rem;
  }
  & > div {
    position: relative;
  }
`

export default LabSettingsSection
