import { css } from '@emotion/react'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import { Editor as TinyMCEEditor } from 'tinymce'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'

import RootPortal from '../RootPortal'
import VeloIcon from '../VeloIcon'
export type EditScreenProps = {
  visible: boolean
  initialValue: string
  onClose(content: string): void
}

function EditScreen({ initialValue, visible, onClose }: EditScreenProps) {
  const editorRef = useRef<TinyMCEEditor | null>()
  const handleClose = () => {
    const content = editorRef.current?.getContent() || ''
    onClose(content)
  }
  if (!visible) return null
  return (
    <RootPortal>
      <div css={screen}>
        <button css={checkButton} onClick={handleClose}>
          <VeloIcon name="check" />
        </button>
        <div css={whiteBox}>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              height: '100%',
              resize: false,
              menubar: 'edit view format',
            }}
            initialValue={initialValue}
          />
        </div>
      </div>
    </RootPortal>
  )
}

const screen = css`
  display: flex;
  background: rgba(100, 100, 100, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const whiteBox = css`
  width: 768px;
  height: 60vh;
  box-shadow: 0px 1rem 1rem rgba(67, 67, 67, 0.03);

  background: white;
`

const checkButton = css`
  ${resetButton};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  background: ${palette.cyan[500]};
  &:hover {
    background: ${palette.cyan[400]};
  }
  border-radius: 1.5rem;
  margin-bottom: 1rem;
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
`

export default EditScreen
