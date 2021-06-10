import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { toggleFreeAdminSubscriptionModalAction } from '../../../student/Login/ducks'

const FreeAdminAlertModal = ({
  isVisible,
  toogleModal,
  setShowSelectStates,
  setRequestQuoteModal,
}) => {
  const handleScheduleDemo = () => {
    setShowSelectStates(true)
    toogleModal()
  }

  const handleRequestQuote = () => {
    setRequestQuoteModal(true)
    toogleModal()
  }

  return (
    <StyledModal
      title="Feature Not Available"
      visible={isVisible}
      onOk={handleRequestQuote}
      onCancel={toogleModal}
      centered
      footer={[
        <div>
          {' '}
          <EduButton
            isGhost
            data-cy="cancel"
            height="40px"
            onClick={toogleModal}
          >
            CANCEL
          </EduButton>
          <EduButton
            height="40px"
            data-cy="request-quote"
            onClick={handleRequestQuote}
          >
            Request a Quote
          </EduButton>
        </div>,
      ]}
    >
      <div>
        <p>
          You are not on a premium plan and administrators are not allowed to
          access the district level assignments. Please talk to a sales
          representative.
        </p>
        <p>
          <ScheduleDemo onClick={handleScheduleDemo}>
            Schedule a Demo
          </ScheduleDemo>
        </p>
      </div>
    </StyledModal>
  )
}

export default connect(
  (state) => ({ isVisible: state.user.showAdminSubscriptionModal }),
  { toogleModal: toggleFreeAdminSubscriptionModalAction }
)(FreeAdminAlertModal)

const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: none;
  }
  .ant-modal-footer {
    border-top: none;
    div {
      display: flex;
      justify-content: center;
    }
  }
`

const ScheduleDemo = styled.div`
  color: ${themeColor};
  font-weight: bold;
  margin-top: 10px;
  display: inline-block;
  cursor: pointer;
`
