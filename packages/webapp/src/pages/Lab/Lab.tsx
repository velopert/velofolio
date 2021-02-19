import { css } from '@emotion/react'
import LabSettings from '../../components/LabSettings'
import Report from '../../components/Report/Report'

export type LabProps = {}

function Lab({}: LabProps) {
  return (
    <div css={pageStyle}>
      <LabSettings />
      <div css={contentStyle}>
        <Report />
      </div>
    </div>
  )
}

const pageStyle = css``

const contentStyle = css`
  padding-left: 22.5rem;
`

export default Lab
