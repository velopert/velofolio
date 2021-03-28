import { css } from '@emotion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGoogleSignin from '../../hooks/useGoogleSignin'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
import VeloIcon from '../VeloIcon'
export type GoogleLoginButtonProps = {}

function GoogleLoginButton({}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const signin = useGoogleSignin()

  const onSuccess = useCallback(
    (googleUser: any) => {
      signin(googleUser?.getAuthResponse(true).access_token)
    },
    [signin]
  )

  const onFailure = useCallback((e: any) => {}, [])
  useEffect(() => {
    window.gapi.load('auth2', function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      const auth2 = window.gapi.auth2.init({
        client_id:
          '264165978187-voo3h1pn3dj62o4rqfp4vs2qhjf14rpr.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      })

      auth2.attachClickHandler(buttonRef.current, {}, (googleUser: any) => {
        onSuccess(googleUser)
      })
    })
  }, [onSuccess, onFailure])
  return (
    <button css={buttonStyle} ref={buttonRef} id="google-login-button">
      <VeloIcon name="google" />
      Sign in with Google
    </button>
    // <div
    //   id="google-login-button"
    //   onClick={() => {
    //     clickedRef.current = true
    //   }}
    // ></div>
  )
}

const buttonStyle = css`
  ${resetButton}
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${palette.blueGrey[500]};
  background: white;
  height: 3.375rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${palette.blueGrey[800]};
  border-radius: 0.5rem;

  cursor: pointer;
  svg {
    margin-right: 0.5rem;
  }
  transition: all ease-in 0.125s;
  &:hover {
    box-shadow: 0px 0.25rem 0.5rem rgb(0 0 0 / 11%);
  }
`

export default GoogleLoginButton
