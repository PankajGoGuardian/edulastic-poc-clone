import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Modal } from 'antd'
import { get } from 'lodash'
import { test, questionType } from '@edulastic/constants'
import { showHintButton } from '../../utils/test'

const { calculatorTypes } = test

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
      >
        <Container>
          <StyledButton onClick={toggleBookmark} active={isBookmarked}>
            Bookmark
          </StyledButton>
          {settings.calcType !== calculatorTypes.NONE && (
            <StyledButton onClick={() => this.toolbarHandler(2)}>
              Calculator
            </StyledButton>
          )}
          {!isDisableCrossBtn && (
            <StyledButton onClick={() => this.toolbarHandler(3)}>
              Crossout
            </StyledButton>
          )}
          {settings.maxAnswerChecks > 0 && !isNonAutoGradable && (
            <StyledButton onClick={() => this.checkAnswer()}>
              Check Answer
            </StyledButton>
          )}
          {!!showHintButton(questions) && (
            <StyledButton onClick={handletoggleHints}>Hint</StyledButton>
          )}
          <StyledButton onClick={() => this.toolbarHandler(5)}>
            Scratchpad
          </StyledButton>
          {settings.showMagnifier && (
            <StyledButton onClick={() => this.magnify()}>Magnify</StyledButton>
          )}
          <StyledButton onClick={() => this.pointer()} hidden>
            Pointer
          </StyledButton>
          <StyledButton onClick={() => this.inchRuler()} hidden>
            Inch Ruler
          </StyledButton>
          <StyledButton onClick={() => this.centimeterRuler()} hidden>
            Centimeter Ruler
          </StyledButton>
          <StyledButton onClick={() => this.eliminationQuestion()} hidden>
            Elimination Question
          </StyledButton>
          <StyledButton onClick={() => this.procractorRuler()} hidden>
            Procractor Ruler
          </StyledButton>
        </Container>
      </Modal>
    )
  }
}

ToolbarModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
}

export default ToolbarModal

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
