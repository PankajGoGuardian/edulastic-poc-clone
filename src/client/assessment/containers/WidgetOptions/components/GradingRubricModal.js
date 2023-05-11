import React from 'react'
import styled from 'styled-components'
import { ConfirmationModal } from '../../../../author/src/components/common/ConfirmationModal'
import GradingRubric from '../../../../author/GradingRubric/Components/Container'

const GradingRubricModal = ({
  visible,
  toggleModal,
  actionType,
  isRegradeFlow = false,
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
      <ModalBody>
        <GradingRubric
          actionType={actionType}
          closeRubricModal={toggleModal}
          isRegradeFlow={isRegradeFlow}
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
