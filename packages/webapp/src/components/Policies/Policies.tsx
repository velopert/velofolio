import { css } from '@emotion/react'
import palette from '../../lib/palette'
export type PoliciesProps = {}

function Policies({}: PoliciesProps) {
  return (
    <div css={wrapper}>
      <div css={styles}>
        <a href="/policy/terms">Terms of use</a>
        <a href="/policy/privacy">Privacy</a>
        <a href="/policy/cookies">Cookies</a>
        <a href="mailto:contact.velofolio@gmail.com">Contact</a>
      </div>
    </div>
  )
}

const wrapper = css`
  position: relative;
`
const styles = css`
  position: absolute;
  width: 15rem;
  height: 2rem;
  margin-top: 1rem;
  display: flex;

  font-size: 0.75rem;

  a {
    text-decoration: none;
    color: ${palette.grey[500]};
    &:hover {
      text-decoration: underline;
      color: ${palette.grey[600]};
    }
  }
  a + a {
    margin-left: 0.5rem;
  }
`

export default Policies
