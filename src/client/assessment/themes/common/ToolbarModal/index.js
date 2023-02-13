import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { get, isEmpty } from 'lodash'
import { EduIf } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { questionType } from '@edulastic/constants'
import { showHintButton } from '../../../utils/test'
import LineReader from '../../../../common/components/LineReader'
import { ToolbarModalContainer, ToolbarButton } from './styled-components'

const ToolbarModal = ({
  settings,
  isVisible,
  onClose,
  isNonAutoGradable = false,
  toggleBookmark,
  isBookmarked = false,
  items,
  currentItem: currentItemIndex,
  handletoggleHints,
  qType,
  blockNavigationToAnsweredQuestions = false,
  isPremiumContentWithoutAccess = false,
  isShowReferenceModal,
  canShowReferenceMaterial,
  openReferenceModal,
  changeTool,
  checkAnswer: onCheckAnswer,
  handleMagnifier,
  toggleUserWorkUploadModal,
  t: translate,
}) => {
  const canUseHint = useMemo(() => {
    const questions = get(
      items,
      [`${currentItemIndex}`, `data`, `questions`],
      []
    )
    return showHintButton(questions)
  }, [currentItemIndex, items])

  const isDisableCrossBtn = useMemo(
    () => qType !== questionType.MULTIPLE_CHOICE,
    [qType]
  )

  const calcButtonText = useMemo(
    () =>
      settings?.calcTypes?.length > 1
        ? translate('toolbar.calculators')
        : translate('toolbar.calculator'),
    [settings?.calcTypes?.length]
  )

  const handleReferenceMaterial = () => {
    openReferenceModal()
    onClose()
  }

  const toolbarHandler = (value) => {
    changeTool(value)
    onClose()
  }

  const handleCheckAnswer = () => {
    onCheckAnswer()
    onClose()
  }

  const handleToggleMagnify = () => {
    handleMagnifier()
    onClose()
  }

  const handleUploadWork = () => {
    toggleUserWorkUploadModal()
    onClose()
  }

  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      closable={false}
      bodyStyle={{ padding: 20 }}
      footer={null}
      centered
      width="390px"
      zIndex={1500}
    >
      <ToolbarModalContainer>
        <EduIf condition={!blockNavigationToAnsweredQuestions}>
          <ToolbarButton
            onClick={toggleBookmark}
            active={isBookmarked}
            disabled={isPremiumContentWithoutAccess}
          >
            {translate('toolbar.bookmark')}
          </ToolbarButton>
        </EduIf>
        <EduIf condition={canShowReferenceMaterial}>
          <ToolbarButton
            onClick={handleReferenceMaterial}
            active={isShowReferenceModal}
            disabled={isPremiumContentWithoutAccess}
          >
            {translate('toolbar.refMaterial')}
          </ToolbarButton>
        </EduIf>
        <EduIf condition={!isEmpty(settings.calcTypes)}>
          <ToolbarButton
            disabled={isPremiumContentWithoutAccess}
            onClick={() => toolbarHandler(2)}
          >
            {calcButtonText}
          </ToolbarButton>
        </EduIf>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess || isDisableCrossBtn}
          onClick={() => toolbarHandler(3)}
        >
          {translate('toolbar.cross')}
        </ToolbarButton>
        <EduIf condition={settings.maxAnswerChecks > 0 && !isNonAutoGradable}>
          <ToolbarButton
            disabled={isPremiumContentWithoutAccess}
            onClick={handleCheckAnswer}
          >
            {translate('toolbar.checkAnswer')}
          </ToolbarButton>
        </EduIf>
        <EduIf condition={canUseHint}>
          <ToolbarButton
            disabled={isPremiumContentWithoutAccess}
            onClick={handletoggleHints}
          >
            {translate('toolbar.hint')}
          </ToolbarButton>
        </EduIf>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess}
          onClick={() => toolbarHandler(5)}
        >
          {translate('toolbar.scratchPad')}
        </ToolbarButton>
        <EduIf condition={settings.showMagnifier}>
          <ToolbarButton
            disabled={isPremiumContentWithoutAccess}
            onClick={handleToggleMagnify}
          >
            {translate('toolbar.magnify')}
          </ToolbarButton>
        </EduIf>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess}
          onClick={onClose}
          hidden
        >
          {translate('toolbar.pointer')}
        </ToolbarButton>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess}
          onClick={onClose}
          hidden
        >
          {translate('toolbar.inchRuler')}
        </ToolbarButton>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess}
          onClick={onClose}
          hidden
        >
          {translate('toolbar.cmRuler')}
        </ToolbarButton>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess}
          onClick={onClose}
          hidden
        >
          {translate('toolbar.eliminationQuestion')}
        </ToolbarButton>
        <ToolbarButton
          disabled={isPremiumContentWithoutAccess}
          onClick={onClose}
          hidden
        >
          {translate('toolbar.protactorRuler')}
        </ToolbarButton>
        <EduIf condition={settings.isTeacherPremium}>
          <ToolbarButton
            disabled={isPremiumContentWithoutAccess}
            onClick={handleUploadWork}
          >
            {translate('toolbar.uploadWork')}
          </ToolbarButton>
        </EduIf>
        <LineReader
          btnComponent={ToolbarButton}
          btnText={translate('toolbar.lineReader')}
          onClick={onClose}
        />
      </ToolbarModalContainer>
    </Modal>
  )
}

ToolbarModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  handleMagnifier: PropTypes.func,
}

ToolbarModal.defaultProps = {
  handleMagnifier: () => {},
}

export default withNamespaces('header')(ToolbarModal)
