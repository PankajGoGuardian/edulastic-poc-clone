import React from 'react'
import { FlexContainer, EduButton } from '@edulastic/common'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'

import { StyledModal } from './styled'

const RegradeProgressModal = ({
  onCloseRegardeProgressModal,
  visible,
  isPublishedChanges,
}) => {
  return (
    <StyledModal
      visible={visible}
      centered
      closable={false}
      title={
        <FlexContainer
          height="36px"
          alignItems="center"
          justifyContent="flex-start"
        >
          <TitleWrapper>Edit/Regrade</TitleWrapper>
        </FlexContainer>
      }
      footer={
        <FlexContainer>
          <EduButton
            isBlue
            isGhost
            onClick={onCloseRegardeProgressModal}
            width="145px"
            height="36px"
          >
            CLOSE
          </EduButton>
        </FlexContainer>
      }
      width="620px"
    >
      <p>
        {isPublishedChanges
          ? ' The test has been edited by one of the co-authors. Please update to the latest version using Edit Test option first and then try.'
          : 'There are some un-published changes associated with the test. Please publish the changes via Edit Test option first and then try.'}
      </p>
    </StyledModal>
  )
}

export default RegradeProgressModal
