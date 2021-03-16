import { css } from '@emotion/react'
import { useHasCreatedAccountState } from '../../atoms/authState'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
import Input from '../Input/Input'
export type RegisterFormProps = {}

function RegisterForm({}: RegisterFormProps) {
  const [hasCreatedAccount, setHasCreatedAccount] = useHasCreatedAccountState()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasCreatedAccount) {
      // TODO: register
      // TODO: username duplicate
      // setHasCreatedAccount(true)
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <Input placeholder="Username" css={inputStyle} />
      <div css={description(true)}>
        Username should be 4 ~ 16 alphanumeric letters without space
      </div>
      <button css={buttonStyle}>REGISTER</button>
      <div css={description(false)}>
        By signing up, I accept to Terms of Use. I have read and understood the
        Privacy Policy and Cookies Policy
      </div>
    </form>
  )
}

const inputStyle = css`
  border: ${palette.blueGrey[300]} 1px solid;
  height: 3rem;
  input {
    font-size: 1.25rem;
  }
`

const description = (alignRight?: boolean) => css`
  color: ${palette.blueGrey[500]};
  font-size: 0.75rem;
  margin-top: 0.5rem;
  line-height: 1.5;
  ${alignRight &&
  css`
    text-align: right;
  `}
`

const buttonStyle = css`
  ${resetButton}
  height: 3rem;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  line-height: 1;
  color: white;
  background: ${palette.blueGrey[800]};
  cursor: pointer;
  &:hover {
    background: ${palette.blueGrey[700]};
  }
  font-weight: bold;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  letter-spacing: 0.0625em;
`

export default RegisterForm
