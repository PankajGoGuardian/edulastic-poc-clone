import React from 'react'
import { EduButton, FlexContainer } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'
import connect from 'react-redux/es/connect/connect'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import { setShowAssignmentCreationModalAction } from '../../../Dashboard/ducks'

const NewAssignmentButton = ({
  setShowAssignmentCreationModal,
  buttonDataCy,
}) => {
  return (
    <FlexContainer
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <AuthorCompleteSignupButton
        renderButton={(handleClick) => (
          <EduButton data-cy={buttonDataCy} isBlue onClick={handleClick}>
            <IconPlusCircle />
            NEW ASSIGNMENT
          </EduButton>
        )}
        onClick={() => setShowAssignmentCreationModal(true)}
        triggerSource="Create Assignment"
      />
    </FlexContainer>
  )
}

const enhance = connect(() => {}, {
  setShowAssignmentCreationModal: setShowAssignmentCreationModalAction,
})

export default enhance(NewAssignmentButton)
