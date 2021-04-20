import React from 'react'
import { css } from '@emotion/react'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
export type DialogProps = {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm(): void
  onCancel?(): void
  isDestructive?: boolean
}

function Dialog({
  title,
  message,
  confirmText = 'OK',
  cancelText = 'CANCEL',
  onConfirm,
  onCancel,
  isDestructive = false,
  visible,
}: DialogProps) {
  if (!visible) return null
  return (
    <>
      <div css={overlay}></div>
      <div css={centerWrapper}>
        <div css={whiteBox}>
          <h3>{title}</h3>
          <p>{message}</p>
          <div css={buttons}>
            {onCancel && (
              <button css={cancelButton} onClick={onCancel}>
                {cancelText}
              </button>
            )}
            <button css={confirmButton(isDestructive)} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const overlay = css`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 10;
`

const centerWrapper = css`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 20;
`

const whiteBox = css`
  width: 380px;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0px 1rem 1rem rgba(67, 67, 67, 0.03);

  color: ${palette.blueGrey[900]};
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    line-height: 1.5;
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
  }
`

const buttons = css`
  display: flex;
  justify-content: flex-end;

  button + button {
    margin-left: 0.5rem;
  }
`

const buttonStyle = css`
  ${resetButton}
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  align-items: center;
  height: 2.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
`

const cancelButton = css`
  ${buttonStyle}
  color: ${palette.blueGrey[300]};
  &:hover {
    background: ${palette.grey[100]};
  }
`

const confirmButton = (isDestructive: boolean) => css`
  ${buttonStyle}
  background: ${isDestructive ? palette.red[400] : palette.cyan[500]};
  &:hover {
    background: ${isDestructive ? palette.red[300] : palette.cyan[400]};
  }
  color: white;
`

export default Dialog
