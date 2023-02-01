import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Modal } from 'antd'
import { get, isEmpty } from 'lodash'
import { EduIf } from '@edulastic/common'
import { questionType } from '@edulastic/constants'
import { showHintButton } from '../../utils/test'
import LineReader from '../../../common/components/LineReader'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  @media (max-width: 468px) {
    width: calc(100vw - 100px);
  }
`

const StyledButton = styled(Button)`
  height: 50px;
  text-transform: uppercase;
  border: none;
  border-bottom: 1px solid
    ${(props) => props.theme.default.headerButtonBorderColor};
  border-radius: 0px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  ${(props) => props.hidden && 'display:none'}
  &:active,
  &:focus,
  &:hover {
    border-color: ${(props) =>
      props.theme.default.headerButtonBorderHoverColor};
    color: ${(props) => props.theme.default.headerButtonBorderHoverColor};
  }
`

class ToolbarModal extends React.Component {
  toolbarHandler = (value) => {
    const { changeTool, onClose } = this.props
    changeTool(value)
    onClose()
  }

  checkAnswer = () => {
    const { onClose, checkAnswer } = this.props
    checkAnswer()
    onClose()
  }

  handleReferenceMaterial = () => {
    const { onClose, openReferenceModal } = this.props
    openReferenceModal()
    onClose()
  }

  hint = () => {
    const { onClose } = this.props
    onClose()
  }

  bookmark = () => {
    const { onClose } = this.props
    onClose()
  }

  pointer = () => {
    const { onClose } = this.props
    onClose()
  }

  inchRuler = () => {
    const { onClose } = this.props
    onClose()
  }

  centimeterRuler = () => {
    const { onClose } = this.props
    onClose()
  }

  eliminationQuestion = () => {
    const { onClose } = this.props
    onClose()
  }

  procractorRuler = () => {
    const { onClose } = this.props
    onClose()
  }

  magnify = () => {
    const { onClose, handleMagnifier } = this.props
    handleMagnifier()
    onClose()
  }

  handleUploadWork = () => {
    const { onClose, toggleUserWorkUploadModal } = this.props
    toggleUserWorkUploadModal()
    onClose()
  }

  hideModal = () => {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const {
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
    } = this.props
    const questions = get(
      items,
      [`${currentItemIndex}`, `data`, `questions`],
      []
    )
    const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE
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
        <Container>
          <EduIf condition={!blockNavigationToAnsweredQuestions}>
            <StyledButton
              onClick={toggleBookmark}
              active={isBookmarked}
              disabled={isPremiumContentWithoutAccess}
            >
              Bookmark
            </StyledButton>
          </EduIf>
          <EduIf condition={canShowReferenceMaterial}>
            <StyledButton
              onClick={this.handleReferenceMaterial}
              active={isShowReferenceModal}
              disabled={isPremiumContentWithoutAccess}
            >
              Reference Material
            </StyledButton>
          </EduIf>
          <EduIf condition={isEmpty(settings.calcTypes)}>
            <StyledButton
              disabled={isPremiumContentWithoutAccess}
              onClick={() => this.toolbarHandler(2)}
            >
              Calculator
            </StyledButton>
          </EduIf>
          <EduIf condition={!isDisableCrossBtn}>
            <StyledButton
              disabled={isPremiumContentWithoutAccess}
              onClick={() => this.toolbarHandler(3)}
            >
              Crossout
            </StyledButton>
          </EduIf>
          <EduIf condition={settings.maxAnswerChecks > 0 && !isNonAutoGradable}>
            <StyledButton
              disabled={isPremiumContentWithoutAccess}
              onClick={() => this.checkAnswer()}
            >
              Check Answer
            </StyledButton>
          </EduIf>
          <EduIf condition={!!showHintButton(questions)}>
            <StyledButton
              disabled={isPremiumContentWithoutAccess}
              onClick={handletoggleHints}
            >
              Hint
            </StyledButton>
          </EduIf>
          <StyledButton
            disabled={isPremiumContentWithoutAccess}
            onClick={() => this.toolbarHandler(5)}
          >
            Scratchpad
          </StyledButton>
          <EduIf condition={settings.showMagnifier}>
            <StyledButton
              disabled={isPremiumContentWithoutAccess}
              onClick={this.magnify}
            >
              Magnify
            </StyledButton>
          </EduIf>
          <StyledButton
            disabled={isPremiumContentWithoutAccess}
            onClick={this.pointer}
            hidden
          >
            Pointer
          </StyledButton>
          <StyledButton
            disabled={isPremiumContentWithoutAccess}
            onClick={this.inchRuler}
            hidden
          >
            Inch Ruler
          </StyledButton>
          <StyledButton
            disabled={isPremiumContentWithoutAccess}
            onClick={this.centimeterRuler}
            hidden
          >
            Centimeter Ruler
          </StyledButton>
          <StyledButton
            disabled={isPremiumContentWithoutAccess}
            onClick={this.eliminationQuestion}
            hidden
          >
            Elimination Question
          </StyledButton>
          <StyledButton
            disabled={isPremiumContentWithoutAccess}
            onClick={this.procractorRuler}
            hidden
          >
            Procractor Ruler
          </StyledButton>
          <EduIf condition={settings.isTeacherPremium}>
            <StyledButton
              disabled={isPremiumContentWithoutAccess}
              onClick={this.handleUploadWork}
            >
              Upload work
            </StyledButton>
          </EduIf>
          <LineReader
            btnComponent={StyledButton}
            btnText="Line Reader"
            onClick={this.hideModal}
          />
        </Container>
      </Modal>
    )
  }
}

ToolbarModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  handleMagnifier: PropTypes.func,
}

ToolbarModal.defaultProps = {
  handleMagnifier: () => {},
}

export default ToolbarModal
