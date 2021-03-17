import { css } from '@emotion/react'
import { undrawWelcoming } from '../../assets/images'
import palette from '../../lib/palette'
import Input from '../../components/Input'
import RegisterForm from '../../components/RegisterForm/RegisterForm'

export type RegisterProps = {}

function Register({}: RegisterProps) {
  return (
    <div css={block}>
      <div css={whiteBox}>
        <h1>Welcome!</h1>
        <img src={undrawWelcoming} alt="welcome" />
        <h2>Create your new account</h2>
        <RegisterForm />
      </div>
    </div>
  )
}

const block = css`
  width: 100%;
  height: 100%;
  background: linear-gradient(111.85deg, #00acc1 0%, #22747e 94.6%);

  display: flex;
  align-items: center;
  justify-content: center;
`

const whiteBox = css`
  background: white;
  width: 30rem;
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: 0px 1rem 1rem 0.25rem rgb(0 68 77 / 16%);
  h1 {
    color: ${palette.blueGrey[900]};
    margin: 0;
    font-size: 3rem;
  }
  h2 {
    color: ${palette.blueGrey[900]};
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 0.5rem;
    line-height: 1.5;
    /* font-weight: normal; */
  }
  & > img {
    display: block;
    margin-top: 3rem;
    margin-bottom: 2rem;
    width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
`

export default Register
