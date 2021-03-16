import { css } from '@emotion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGoogleSignin from '../../hooks/useGoogleSignin'
export type GoogleLoginButtonProps = {}

function GoogleLoginButton({}: GoogleLoginButtonProps) {
  const clickedRef = useRef(false)
  const signin = useGoogleSignin()

  const onSuccess = useCallback(
    (googleUser: any) => {
      ;(window as any).googleUser = googleUser
      if (!clickedRef.current) return
      signin(googleUser?.getAuthResponse().access_token)
    },
    [signin]
  )

  const onFailure = useCallback((e: any) => {}, [])
  useEffect(() => {
    window.gapi?.signin2.render('google-login-button', {
      scope: 'profile email',
      // width: 212,
      // height: 48,
      longtitle: true,
      onsuccess: onSuccess,
      onfailure: onFailure,
    })
  }, [onSuccess, onFailure])
  return (
    <div
      id="google-login-button"
      onClick={() => {
        clickedRef.current = true
      }}
    ></div>
  )
}

export default GoogleLoginButton
