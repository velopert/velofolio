import { css } from '@emotion/react'
import { useProjectTitleState } from '../../atoms/labSettingState'
import Input from '../Input'
import LabSettingsSection from './LabSettingsSection'
export type ProjectTitleSectionProps = {}

function ProjectTitleSection({}: ProjectTitleSectionProps) {
  const [title, setTitle] = useProjectTitleState()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  return (
    <LabSettingsSection title="Project Title">
      <Input value={title} onChange={onChange} />
    </LabSettingsSection>
  )
}

export default ProjectTitleSection
