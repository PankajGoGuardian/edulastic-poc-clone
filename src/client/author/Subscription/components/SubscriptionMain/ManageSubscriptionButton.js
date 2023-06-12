import { EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

function ManageSubscriptionButton({ showMultipleSubscriptions, history }) {
  const handleManageSubscription = () => {
    history.push('/author/manage-subscriptions')
  }
  return (
    <FlexContainer justifyContent="flex-end">
      {showMultipleSubscriptions && (
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton
              data-cy="manageSubscriptionButton"
              isGhost
              height="28px"
              onClick={handleClick}
            >
              MANAGE SUBSCRIPTIONS
            </EduButton>
          )}
          onClick={handleManageSubscription}
        />
      )}
    </FlexContainer>
  )
}

export default ManageSubscriptionButton
