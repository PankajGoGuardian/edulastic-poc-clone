import { EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'
import { TopSection } from './styled'
import ManageSubscriptionButton from './ManageSubscriptionButton'

const TabHeaderContent = ({
  history,
  showMultipleSubscriptions,
  setShowEnterpriseTab,
  setShowMultiplePurchaseModal,
  signUpFlowModalHandler,
}) => {
  const openMultiplePurchaseModal = (subType) => {
    if (!['enterprise'].includes(subType)) {
      setShowMultiplePurchaseModal(true)
    }
  }

  return (
    <>
      {/* This button will only be visible when showMultipleSubscription is true
      or the license type is multiple */}
      <ManageSubscriptionButton
        history={history}
        showMultipleSubscriptions={showMultipleSubscriptions}
      />
      <TopSection>
        <h1>Edulastic Premium & Add-ons to supercharge instruction.</h1>
        <p>
          Upgrade your subscription to Teacher Premium or school or district
          Enterprise for additional features, and add on subject-specific <br />
          content bundles that you will love.
        </p>
        <FlexContainer justifyContent="flex-start" mt="20px">
          {/* <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <EduButton
                data-cy="multipleSubscription"
                onClick={handleClick}
                ml="0px"
                width="215px"
                height="38px"
                isBlue
                isGhost
              >
                MULTIPLE Subscriptions
              </EduButton>
            )}
            onClick={openMultiplePurchaseModal}
          /> */}
          <EduButton
            data-cy="multipleSubscription"
            onClick={() => signUpFlowModalHandler(openMultiplePurchaseModal)}
            ml="0px"
            width="215px"
            height="38px"
            isBlue
            isGhost
          >
            MULTIPLE Subscriptions
          </EduButton>

          <EduButton
            data-cy="enterpriseEdition"
            width="215px"
            height="38px"
            isBlue
            onClick={() => setShowEnterpriseTab(true)}
          >
            Enterprise Edition
          </EduButton>
        </FlexContainer>
      </TopSection>
    </>
  )
}

export default TabHeaderContent
