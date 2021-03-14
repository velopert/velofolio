import { css } from '@emotion/react'
import { useCallback, useEffect } from 'react'
export type GoogleLoginButtonProps = {}

function GoogleLoginButton({}: GoogleLoginButtonProps) {
  const onSuccess = useCallback((googleUser: any) => {
    ;(window as any).googleUser = googleUser
    console.log(googleUser)
  }, [])
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
  return <div id="google-login-button"></div>
}

export default GoogleLoginButton
