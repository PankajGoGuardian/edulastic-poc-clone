import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import moment from 'moment'
import Modal from 'react-responsive-modal'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import {
  assignmentPolicyOptions,
  keyboard as keyboardConst,
} from '@edulastic/constants'
import { themeColorBlue } from '@edulastic/colors'
import ColWithZoom from '../../../common/components/ColWithZoom'

class SubmitConfirmation extends Component {
  constructor(props) {
    super(props)
    this.cancelButtonRef = null
  }

  componentDidUpdate(prevProps) {
    const { isVisible } = this.props
    if (isVisible && !prevProps.isVisible) this?.cancelButtonRef?.focus()
  }

  render() {
    const {
      isVisible,
      onClose,
      finishTest,
      t,
      theme,
      settings = {},
    } = this.props
    const { endDate, closePolicy } = settings
    const dateText =
      closePolicy === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE
        ? ` end date ${moment(endDate).format('MMMM DD, YYYY hh:mm A')}.`
        : ' Teacher/Admin closes it.'

    return (
      <Modal
        open={isVisible}
        onClose={onClose}
        showCloseIcon={false}
        styles={{
          modal: {
            maxWidth: '582px',
            borderRadius: 5,
            textAlign: 'center',
            padding: '86px 57px 41px 57px',
            backgroundColor: theme.sectionBackgroundColor,
          },
        }}
        center
      >
        <ModalContainer>
          <TitleDescription>
            {t('exitConfirmation.body')}
            {dateText}
          </TitleDescription>
          <TitleDescription>{t('exitConfirmation.confirm')}</TitleDescription>
          <ButtonContainer>
            <Row gutter={20} style={{ width: '100%' }}>
              <ColWithZoom md={12} sm={24} layout={{ xl: 24, lg: 24 }}>
                <StyledButton
                  data-cy="cancel"
                  btnType={1}
                  onClick={onClose}
                  ref={(ref) => {
                    this.cancelButtonRef = ref
                  }}
                >
                  {t('exitConfirmation.buttonCancel')}
                </StyledButton>
              </ColWithZoom>
              <ColWithZoom md={12} sm={24} layout={{ xl: 24, lg: 24 }}>
                <StyledButton
                  data-cy="proceed"
                  type="primary"
                  btnType={2}
                  onClick={finishTest}
                  onKeyDown={(e) => {
                    const code = e.which || e.keyCode
                    if (code === keyboardConst.TAB_KEY) {
                      e.preventDefault()
                      this?.cancelButtonRef?.focus()
                    }
                  }}
                >
                  {t('exitConfirmation.buttonProceed')}
                </StyledButton>
              </ColWithZoom>
            </Row>
          </ButtonContainer>
        </ModalContainer>
      </Modal>
    )
  }
}

SubmitConfirmation.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  finishTest: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default withTheme(withNamespaces('common')(SubmitConfirmation))

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const TitleDescription = styled.div`
  font-size: ${(props) => props.theme.confirmationPopupBodyTextSize};
  font-weight: 600;
  margin-top: 14px;
  color: ${(props) => props.theme.confirmationPopupTextColor};
`

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 60px;
`

const StyledButton = styled.button`
  width: 100%;
  min-height: 40px;
  height: auto;
  outline: none;
  text-transform: uppercase;
  font-size: ${(props) => props.theme.confirmationPopupButtonTextSize};
  font-weight: 600;
  border-radius: 4px;
  color: ${(props) =>
    props.btnType === 1
      ? props.theme.confirmationPopupButtonTextColor
      : props.theme.confirmationPopupButtonTextHoverColor};
  border: ${(props) =>
    `1px solid ${props.theme.confirmationPopupButtonBgColor}`};
  cursor: pointer;
  background: ${(props) =>
    props.btnType === 1
      ? props.theme.confirmationPopupButtonTextHoverColor
      : props.theme.confirmationPopupButtonBgColor};
  border-color: ${(props) => props.theme.confirmationPopupButtonBgColor};
  &:hover,
  &:focus {
    background: ${(props) =>
      props.btnType === 1
        ? props.theme.confirmationPopupButtonTextHoverColor
        : props.theme.confirmationPopupButtonBgColor};
    border-color: ${(props) => props.theme.confirmationPopupButtonBgColor};
  }
  span {
    text-transform: uppercase;
    font-size: ${(props) => props.theme.confirmationPopupButtonTextSize};
    font-weight: 600;
    color: ${(props) =>
      props.btnType === 1
        ? props.theme.confirmationPopupButtonTextColor
        : props.theme.confirmationPopupButtonTextHoverColor};
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }
  @media screen and (max-width: 767px) {
    margin-top: 10px;
  }
`
