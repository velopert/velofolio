import { css } from '@emotion/react'
import palette from '../../lib/palette'
import LabSettingsSection from '../LabSettingsSection'

export type LabSettingsProps = {}

function LabSettings({}: LabSettingsProps) {
  return (
    <div css={blockStyle}>
      <LabSettingsSection title="Test Period">asdfs</LabSettingsSection>
    </div>
  )
}

const blockStyle = css`
  position: fixed;
  background: ${palette.grey[100]};
  border-radius: 2rem;
  width: 22.5rem;
  height: calc(100% - 6rem);
  padding: 2rem;
`

export default LabSettings
