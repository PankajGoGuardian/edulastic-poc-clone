import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Modal } from 'antd'

import { themeColor } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'

import { toggleAdminAlertModalAction } from '../../../student/Login/ducks'
import {
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
} from '../../../author/src/selectors/user'

const AdminAlertModal = ({
  isVisible,
  isFreeAdmin,
  isSAWithoutSchools,
  toggleAdminAlertModal,
  setShowSelectStates,
  setRequestQuoteModal,
}) => {
  const handleScheduleDemo = () => {
    setShowSelectStates(true)
    toggleAdminAlertModal()
  }

  const handleRequestQuote = () => {
    setRequestQuoteModal(true)
    toggleAdminAlertModal()
  }

  const modalContent = useMemo(
    () =>
      isFreeAdmin ? (
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
      ) : isSAWithoutSchools ? (
        <div>
          <p>
            You are not enrolled in any school, please ask your district admin
            to enroll.
          </p>
        </div>
      ) : null,
    [isFreeAdmin, isSAWithoutSchools]
  )

  return (
    <StyledModal
      title="Feature Not Available"
      visible={isVisible}
      onOk={isFreeAdmin ? handleRequestQuote : toggleAdminAlertModal}
      onCancel={toggleAdminAlertModal}
      centered
      footer={[
        <div>
          <EduButton
            isGhost
            data-cy="cancel"
            height="40px"
            onClick={toggleAdminAlertModal}
          >
            CANCEL
          </EduButton>
          {isFreeAdmin && (
            <EduButton
              height="40px"
              data-cy="request-quote"
              onClick={handleRequestQuote}
            >
              Request a Quote
            </EduButton>
          )}
        </div>,
      ]}
    >
      {modalContent}
    </StyledModal>
  )
}

export default connect(
  (state) => ({
    isVisible: state.user.showAdminAlertModal,
    isFreeAdmin: isFreeAdminSelector(state),
    isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
  }),
  { toggleAdminAlertModal: toggleAdminAlertModalAction }
)(AdminAlertModal)

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
