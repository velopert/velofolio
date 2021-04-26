import { css } from '@emotion/react'
import media from '../../lib/styles/media'
export type DoubleSectionsProps = {
  children: React.ReactNode
}

function DoubleSections({ children }: DoubleSectionsProps) {
  return <div css={style}>{children}</div>
}

const style = css`
  section + &,
  & + section {
    margin-top: 2rem;
  }
  display: flex;
  & > section {
    flex: 1;
  }

  & > section + section {
    margin-top: 0 !important;
    margin-left: 2rem;
  }

  ${media.large} {
    flex-direction: column;
    & > section + section {
      margin-top: 2rem;
      margin-left: 0;
    }
  }
`

export default DoubleSections
