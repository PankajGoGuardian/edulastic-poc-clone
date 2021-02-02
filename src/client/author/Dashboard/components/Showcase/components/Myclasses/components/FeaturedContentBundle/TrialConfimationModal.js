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
  const { hasTrial, subEndDate } = showTrialConfirmationMessage

  return (
    <>
      <CustomModalStyled
        visible={visible}
        title="Free Trial Started"
        onCancel={handleCloseModal}
        width="675px"
        footer={[
          <>
            <EduButton
              data-cy="goToDashboard"
              onClick={handleCloseModal}
              width="180px"
              height="45px"
            >
              Go To Dashboard
            </EduButton>
            {isTrialItemBank && (
              <EduButton
                data-cy="goToItemBank"
                onClick={handleGoToCollectionClick}
                width="180px"
                height="45px"
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
        <ModalBody>
          {hasTrial === 'haveBothSparkAndPremiumTrial' ? (
            <p>
              Thanks for trying the Teacher Premium and additional Spark
              content. Your subscription will expire on <b>{subEndDate}</b>.
              After your trial ends upgrade for a full calendar year for just
              $100 plus optional Spark premium contente that you choose to add
              on.
            </p>
          ) : hasTrial === 'onlyPremiumTrial' ? (
            <p>
              Thanks for trying teacher premium. Your trial will expire on{' '}
              <b>{subEndDate}</b>. After your trial ends, continue to use
              teacher premium for a full calendar year for just $100.
            </p>
          ) : (
            <p>
              Thanks for trying premium Spark assessments and practice. Your
              trial will expire on <b>{subEndDate}</b>. After your trial ends,
              continue to use additional Spark content for a full calendar year
              for just $100
            </p>
          )}
        </ModalBody>
      </CustomModalStyled>
    </>
  )
}

export default TrialConfirmationModal

const ModalBody = styled.div`
  p {
    font-weight: normal !important;
  }
`
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
