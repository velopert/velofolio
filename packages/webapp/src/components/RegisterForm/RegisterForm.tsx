import { css, keyframes } from '@emotion/react'
import { useState } from 'react'
import useGoogleSignup from '../../hooks/useGoogleSignup'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
import Input from '../Input/Input'
import VeloIcon from '../VeloIcon'
export type RegisterFormProps = {}

function RegisterForm({}: RegisterFormProps) {
  const [username, setUsername] = useState('')
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value)
  const { signup, loading, error } = useGoogleSignup()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signup(username)
    } catch (e) {
      setUsername('')
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <Input
        placeholder="Username"
        css={inputStyle}
        value={username}
        onChange={onChange}
      />
      <div css={description(true)}>
        Username should be 4 ~ 16 alphanumeric letters without space
      </div>
      {error && <div css={description(true, true)}>{error}</div>}
      <button css={buttonStyle} disabled={loading}>
        {loading ? <VeloIcon name="spinner" /> : 'REGISTER'}
      </button>
      <div css={description(false)}>
        By signing up, I accept to Terms of Use. I have read and understood the
        <a href="/policy" target="_blank" rel="external nofollow noopener">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="/policy/cookies"
          target="_blank"
          rel="external nofollow noopener"
        >
          Cookies Policy
        </a>
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

const description = (alignRight?: boolean, error?: boolean) => css`
  color: ${palette.blueGrey[500]};
  font-size: 0.75rem;
  margin-top: 0.5rem;
  line-height: 1.5;
  ${alignRight &&
  css`
    text-align: right;
  `}

  ${error &&
  css`
    margin-top: 0;
    color: ${palette.red[500]};
  `}
`

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
}
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
  &:hover:enabled {
    background: ${palette.blueGrey[700]};
  }
  font-weight: bold;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  letter-spacing: 0.0625em;
  &:disabled {
    cursor: default;
    background: ${palette.blueGrey[600]};
    color: ${palette.grey[100]};
  }

  svg {
    animation: ${rotateAnimation} 1.25s ease-in-out infinite;
  }
`

export default RegisterForm
