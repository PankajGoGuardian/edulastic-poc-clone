import { EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import { TopSection } from './styled'

const TabHeaderContent = ({
  history,
  showMultipleSubscriptions,
  setShowEnterpriseTab,
  setShowMultiplePurchaseModal,
}) => {
  const handleManageSubscription = () => {
    history.push('/author/manage-subscriptions')
  }

  const openMultiplePurchaseModal = () => setShowMultiplePurchaseModal(true)

  return (
    <>
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
      <TopSection>
        <h1>Edulastic Premium & Add-ons to supercharge instruction.</h1>
        <p>
          Upgrade your subscription to Teacher Premium or school or district
          Enterprise for additional features, and add on subject-specific <br />
          content bundles that you will love.
        </p>
        <FlexContainer justifyContent="flex-start" mt="20px">
          <AuthorCompleteSignupButton
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
          />
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
