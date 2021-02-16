import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import styled from 'styled-components'
import { toggleFreeAdminSubscriptionModalAction } from '../../../student/Login/ducks'

const FreeAdminAlertModal = ({ isVisible, toogleModal, history }) => {
  const handleOk = () => {
    history.push('/author/subscription')
    toogleModal()
  }
  return (
    <StyledModal
      title="Feature Not Available"
      visible={isVisible}
      onOk={handleOk}
      onCancel={toogleModal}
      centered
    >
      <p>
        Admin assignment is available in premium flow. Please{' '}
        <Link to="/author/subscription" onClick={toogleModal}>
          <strong>UPGRADE</strong>
        </Link>{' '}
        to access.
      </p>
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
