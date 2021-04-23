import { css } from '@emotion/react'
import { useState } from 'react'
import { useDescriptionState } from '../../atoms/labSettingState'
import palette from '../../lib/palette'
import { resetButton } from '../../lib/styles/resetButton'
import VeloIcon from '../VeloIcon'
import EditScreen from './EditScreen'

export type DescriptionSectionProps = {}

function DescriptionSection(props: DescriptionSectionProps) {
  const [visible, setVisible] = useState(true)
  const [description, setDescription] = useDescriptionState()
  const [editorVisible, setEditorVisible] = useState(false)

  const toggle = () => {
    setVisible(!visible)
  }

  const openEditor = () => {
    setEditorVisible(true)
  }

  const closeEditor = (content: string) => {
    setDescription(content)
    setEditorVisible(false)
  }

  return (
    <section css={sectionStyle}>
      <div css={titleWrapper}>
        <button css={toggleBox(visible)} onClick={toggle}>
          <VeloIcon name="triangle" />
        </button>
        <h3>Description</h3>
      </div>
      {visible && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
          <button css={editButton} onClick={openEditor}>
            EDIT
          </button>
        </div>
      )}
      <EditScreen
        initialValue={description}
        onClose={closeEditor}
        visible={editorVisible}
      />
    </section>
  )
}

const titleWrapper = css`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  & > h3 {
    font-size: 1.125rem;
    margin: 0;
    color: ${palette.blueGrey[800]};
  }
`

const toggleBox = (visible: boolean) => css`
  ${resetButton}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.5rem;
  border-radius: 0.25rem;
  &:hover {
    background: ${palette.grey[200]};
  }
  svg {
    transition: 0.125s transform linear;
    width: 0.5rem;
    height: 0.5rem;
    transform: rotate(${visible ? 180 : 90}deg);
  }
`

const sectionStyle = css`
  margin-top: 2rem;
  margin-bottom: 2rem;
`

const editButton = css`
  ${resetButton};
  height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${palette.blueGrey[700]};
  color: ${palette.blueGrey[700]};
  font-size: 0.75rem;
  font-weight: bold;
  margin-top: 1rem;
  border-radius: 0.25rem;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background: ${palette.grey[200]};
  }
`

export default DescriptionSection
