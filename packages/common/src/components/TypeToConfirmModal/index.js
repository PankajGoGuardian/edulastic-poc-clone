import {
  CustomModalStyled,
  EduButton,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ErrorMessage, LightGreenSpan, StyledCol, StyledP } from './styled'

class TypeToConfirmModal extends Component {
  state = {
    textValue: '',
    errorMsg: null,
  }

  onCloseModal = () => {
    const { closeModal } = this.props
    closeModal()
  }

  onChangeInput = (e) => {
    this.setState({ textValue: e.target.value, errorMsg: null })
  }

  onProceed = () => {
    const { textValue } = this.state
    const { wordToBeTyped, handleOnOkClick } = this.props
    if (textValue.toLowerCase() !== wordToBeTyped.toLowerCase()) {
      this.setState({
        ...this.state,
        errorMsg: textValue.trim().length
          ? 'Confirmation text did not match.'
          : 'Please enter confirmation text.',
      })
    } else {
      this.setState({
        ...this.state,
        errorMsg: null,
      })
      handleOnOkClick()
    }
  }

  render() {
    const {
      modalVisible,
      title,
      handleOnOkClick,
      wordToBeTyped,
      primaryLabel,
      secondaryLabel,
      okButtonText,
    } = this.props
    const { textValue, errorMsg } = this.state

    const btnText = `Yes, ${okButtonText || title}`

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={title}
        onOk={handleOnOkClick}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <EduButton
            height="40px"
            isGhost
            key="cancelButton"
            onClick={this.onCloseModal}
          >
            NO, CANCEL
          </EduButton>,
          <EduButton height="40px" key="okButton" onClick={this.onProceed}>
            {btnText}
          </EduButton>,
        ]}
      >
        <Row>
          <Col span={24}>
            <StyledP>{primaryLabel}</StyledP>
            <StyledP>{secondaryLabel}</StyledP>
            <StyledP>
              If Yes, please type{' '}
              <LightGreenSpan>{wordToBeTyped}</LightGreenSpan> in the space
              below to proceed.
            </StyledP>
          </Col>
        </Row>
        <Row>
          <StyledCol span={24}>
            <TextInputStyled
              align="center"
              value={textValue}
              onChange={this.onChangeInput}
              // here paste is not allowed, and user has to manually type in ARCHIVE
              onPaste={(evt) => evt.preventDefault()}
              errorMsg={errorMsg}
            />
          </StyledCol>
        </Row>
        {errorMsg ? <ErrorMessage>{errorMsg}</ErrorMessage> : null}
      </CustomModalStyled>
    )
  }
}

export default TypeToConfirmModal

TypeToConfirmModal.defaultProps = {
  primaryLabel: 'Are you sure you want to archive the following class(es)?',
  modalVisible: false,
  secondaryLabel: '',
}

TypeToConfirmModal.propTypes = {
  modalVisible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  handleOnOkClick: PropTypes.func.isRequired,
  wordToBeTyped: PropTypes.string.isRequired,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  closeModal: PropTypes.func.isRequired,
}
