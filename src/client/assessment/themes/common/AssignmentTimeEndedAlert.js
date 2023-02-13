import React, { useEffect, useContext } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import styled, { withTheme } from 'styled-components'
import Modal from 'react-responsive-modal'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { AssessmentPlayerContext } from '@edulastic/common'
import { homeStudentGradesPath } from '../../constants/assessmentPlayer'
import {
  finishTestAcitivityAction,
  resetStudentAttemptAction,
  setIsTestPreviewVisibleAction,
  closeTestTimeoutAlertModalAction,
} from '../../actions/test'

const AssignmentTimeEndedAlert = ({
  isVisible,
  autoSubmitTest,
  theme,
  groupId,
  utaId,
  isAuthorPreview,
  setIsTestPreviewVisible,
  resetStudentAttempt,
  closeTestTimeoutAlertModal,
}) => {
  const { currentItem } = useContext(AssessmentPlayerContext)

  useEffect(() => {
    const lastTime = window.localStorage.assessmentLastTime || Date.now()
    const timeSpent = Date.now() - lastTime
    if (!isAuthorPreview && currentItem > -1) {
      autoSubmitTest({
        groupId,
        preventRouteChange: true,
        testActivityId: utaId,
        autoSubmit: true,
        itemResponse: [
          currentItem,
          timeSpent,
          false,
          groupId,
          { pausing: false },
        ],
      })
    }
  }, [currentItem])

  useEffect(() => {
    return () => {
      resetStudentAttempt()
    }
  }, [])

  const handleClose = () => {
    if (!isAuthorPreview) {
      closeTestTimeoutAlertModal({ studentGradesUrl: homeStudentGradesPath })
    }
    if (isAuthorPreview) {
      setIsTestPreviewVisible(false)
    }
  }

  return (
    <Modal
      open={isVisible}
      onClose={handleClose}
      closeOnOverlayClick={false}
      styles={{
        modal: {
          maxWidth: '582px',
          borderRadius: 5,
          textAlign: 'center',
          padding: '86px 57px 41px 57px',
          backgroundColor: theme.sectionBackgroundColor,
        },
        overlay: { zIndex: 1010 },
      }}
      center
    >
      <ModalContainer>
        <Title>Alert</Title>
        <TitleDescription>
          You have utilized the time allocated for the assignment
        </TitleDescription>
        <ButtonContainer>
          <StyledButton type="primary" btnType={2} onClick={handleClose}>
            OK
          </StyledButton>
        </ButtonContainer>
      </ModalContainer>
    </Modal>
  )
}

AssignmentTimeEndedAlert.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  autoSubmitTest: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired,
  utaId: PropTypes.string.isRequired,
  closeTestTimeoutAlertModal: PropTypes.func.isRequired,
}

const enhance = compose(
  withTheme,
  withRouter,
  connect(
    (state) => ({
      items: state.test.items,
    }),
    {
      autoSubmitTest: finishTestAcitivityAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
      resetStudentAttempt: resetStudentAttemptAction,
      closeTestTimeoutAlertModal: closeTestTimeoutAlertModalAction,
    }
  )
)

export default enhance(AssignmentTimeEndedAlert)

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
`

const Title = styled.div`
  font-size: ${(props) => props.theme.confirmationPopupTitleTextSize};
  font-weight: bold;
  color: ${(props) => props.theme.confirmationPopupTextColor};
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

const StyledButton = styled(Button)`
  width: 100%;
  min-height: 40px;
  height: auto;
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
  @media screen and (max-width: 767px) {
    margin-top: 10px;
  }
`
