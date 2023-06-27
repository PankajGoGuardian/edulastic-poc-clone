import React from 'react'
import styled from 'styled-components'
import { EduIf } from '@edulastic/common'
import { ConfirmationModal } from '../../../../author/src/components/common/ConfirmationModal'
import GradingRubric from '../../../../author/GradingRubric/Components/Container'
import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'

const GradingRubricModal = ({
  visible,
  toggleModal,
  actionType,
  isRegradeFlow = false,
  isRubricGenerationInProgress,
  generateAutoRubrics,
  currentQuestion,
  currentRubricData,
}) => {
  const Title = [
    <Heading>
      {actionType === 'CREATE NEW'
        ? 'Create New Rubric'
        : 'Use Existing Rubric'}
    </Heading>,
  ]

  return (
    <StyledModal
      title={Title}
      centered
      textAlign="left"
      visible={visible}
      footer={null}
      onCancel={toggleModal}
      width="80%"
      destroyOnClose
      maskClosable={false}
    >
      <EduIf condition={isRubricGenerationInProgress}>
        <SpinContainer loading={isRubricGenerationInProgress}>
          <StyledSpin size="large" />
          <DivModal>
            It usually takes around 60 seconds to generate. Please stay on the
            page, do not press back button.
          </DivModal>
        </SpinContainer>
      </EduIf>
      <ModalBody>
        <GradingRubric
          actionType={actionType}
          closeRubricModal={toggleModal}
          isRegradeFlow={isRegradeFlow}
          generateAutoRubrics={generateAutoRubrics}
          currentQuestion={currentQuestion}
          currentRubricData={currentRubricData}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default GradingRubricModal

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-weight: 600;
  padding: 0px 10px;
  min-height: 350px;
`

const Heading = styled.h4`
  font-weight: 600;
  margin-bottom: 0;
`

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-body {
    padding: 10px;
    background: inherit !important;
    box-shadow: unset !important;
  }
`

const DivModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #f0eeeb;
  font-size: 24px;
  z-index: -10;
`
