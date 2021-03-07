import { css } from '@emotion/react'
export type DoubleSectionsProps = {
  children: React.ReactNode
}

function DoubleSections({ children }: DoubleSectionsProps) {
  return <div css={style}>{children}</div>
}

const style = css`
  section + & {
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
`

export default DoubleSections
