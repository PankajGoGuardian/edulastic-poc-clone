import { EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import { SectionContainer, TopSection } from './styled'

const ContentHeader = ({
  showMultipleSubscriptions,
  history,
  showEnterpriseTab,
}) => {
  const handleManageSubscription = () => {
    history.push('/author/manage-subscriptions')
  }

  return (
    <SectionContainer>
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
        <h1>
          Edulastic {showEnterpriseTab ? 'Enterprise' : 'Premium'} & Add-ons to
          supercharge instruction.
        </h1>
        <p>
          Upgrade your subscription to Teacher Premium or school or district
          Enterprise for additional features, and add on subject-specific <br />
          content bundles that you will love.
        </p>
        {!showEnterpriseTab && (
          <FlexContainer justifyContent="flex-start" mt="20px">
            <EduButton
              data-cy="multipleSubscription"
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
            >
              Enterprise Edition
            </EduButton>
          </FlexContainer>
        )}
      </TopSection>
    </SectionContainer>
  )
}

export default ContentHeader
