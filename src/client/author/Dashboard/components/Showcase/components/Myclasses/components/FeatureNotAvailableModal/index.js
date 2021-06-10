import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

const Footer = ({ handleCloseModal }) => {
  return (
    <>
      <EduButton
        data-cy="featureNotAvailableCloseModal"
        isGhost
        isBlue
        width="180px"
        onClick={handleCloseModal}
      >
        Cancel
      </EduButton>
      <a
        target="_blank"
        href="//docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/viewform?c=0&amp;w=1"
        rel="noopener noreferrer"
      >
        <EduButton height="38px" width="180px" isBlue>
          Request a Quote
        </EduButton>
      </a>
    </>
  )
}

const FeatureNotAvailableModal = ({
  isVisible,
  handleCloseModal,
  handleSelectStateModal,
}) => {
  const handleScheduleDemo = () => {
    handleSelectStateModal(true)
    handleCloseModal()
  }
  return (
    <CustomModalStyled
      centered
      title="Feature Not Available"
      footer={<Footer handleCloseModal={handleCloseModal} />}
      visible={isVisible}
      onCancel={handleCloseModal}
    >
      <p>
        Administrator accounts can only be upgraded with a school or district
        Enterprise subscription.  To learn more about Edulastic Enterprise,
        schedule a demo, or request a quote.
      </p>
      <StyledButton onClick={handleScheduleDemo}>Schedule a Demo</StyledButton>
    </CustomModalStyled>
  )
}

FeatureNotAvailableModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleSelectStateModal: PropTypes.func.isRequired,
}

export default FeatureNotAvailableModal

const StyledButton = styled.div`
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: ${themeColor};
`
