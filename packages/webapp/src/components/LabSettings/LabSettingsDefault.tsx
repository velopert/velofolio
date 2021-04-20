import React from 'react'
import { css } from '@emotion/react'
import CashflowsSection from './CashflowsSection'
import InitialAmountSection from './InitialAmountSection'
import PortfoliosSection from './PortfoliosSection'
import TestPeriodSection from './TestPeriodSection'
import FooterButton from './FooterButton'
import ProjectTitleSection from './ProjectTitleSection'
import useSaveFooter from '../../hooks/useSaveFooter'
import GrayIconTextButton from './GrayIconTextButton'
import useResetLab from '../../hooks/useResetLab'
import Dialog from '../Dialog'
import RootPortal from '../RootPortal'
import useRemoveBacktest from '../../hooks/useRemoveBacktest'
export type LabSettingsDefaultProps = {}

function LabSettingsDefault({}: LabSettingsDefaultProps) {
  const { name, onSave, loading } = useSaveFooter()
  const reset = useResetLab()
  const {
    askRemove,
    cancel,
    confirm,
    isAuthor,
    isDialogVisible,
  } = useRemoveBacktest()

  return (
    <div css={block}>
      <div css={resetButtonWrapper}>
        <GrayIconTextButton onClick={reset} icon="undo" text="RESET" />
      </div>
      <ProjectTitleSection />
      <TestPeriodSection />
      <InitialAmountSection />
      <CashflowsSection />
      <PortfoliosSection />

      {isAuthor && (
        <div css={removeButtonWrapper}>
          <GrayIconTextButton
            icon="trash"
            text="REMOVE PROJECT"
            onClick={askRemove}
          />
        </div>
      )}
      <FooterButton name={name} onClick={onSave} loading={loading} />
      <RootPortal>
        <Dialog
          visible={isDialogVisible}
          title="Delete"
          message="Do you really want to delete this portfolio?"
          isDestructive
          onConfirm={confirm}
          onCancel={cancel}
        />
      </RootPortal>
    </div>
  )
}

const block = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const removeButtonWrapper = css`
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
const resetButtonWrapper = css`
  display: flex;
  justify-content: flex-end;
`

export default LabSettingsDefault
