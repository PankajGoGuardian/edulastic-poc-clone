import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'

const TrialConfirmationModal = ({
  visible,
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
  isTrialItemBank,
  handleGoToCollectionClick,
  title,
  isBlocked,
}) => {
  const handleCloseModal = () => {
    showTrialSubsConfirmationAction(false)
  }

  return (
    <>
      <CustomModalStyled
        visible={visible}
        title="Trial start confirmation"
        onCancel={handleCloseModal}
        footer={[
          <>
            <EduButton
              data-cy="goToDashboard"
              isBlue
              onClick={handleCloseModal}
            >
              Go To Dashboard
            </EduButton>
            {isTrialItemBank && (
              <EduButton
                data-cy="goToItemBank"
                isBlue
                onClick={handleGoToCollectionClick}
              >
                Go To {title}
              </EduButton>
            )}
          </>,
        ]}
        centered
      >
        {isBlocked && isTrialItemBank && (
          <SpinContainer>
            <StyledSpin size="large" />
          </SpinContainer>
        )}
        <p>{showTrialConfirmationMessage}</p>
      </CustomModalStyled>
    </>
  )
}

export default TrialConfirmationModal

const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.2);
`

const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`
