import { EduButton } from '@edulastic/common'
import { IconSubscriptionHighlight } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { withNamespaces } from 'react-i18next'
import { capitalize } from 'lodash'
import moment from 'moment'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import {
  TopBanner,
  HeaderSubscription,
  Title,
  ActionButtons,
  BannerContent,
  LearnMore,
  PlanText,
} from './styled'
import UpgradeButton from '../../../src/components/common/UpgradeButton'

function formatDate(subEndDate) {
  if (!subEndDate) return null
  return moment(subEndDate).format('DD MMM, YYYY')
}

const SubscriptionHeader = ({
  openComparePlanModal,
  showRenewalOptions,
  isSubscribed = false,
  subType,
  subEndDate,
  setShowSubscriptionAddonModal,
  hasAllPremiumProductAccess,
  isPremiumUser,
  isBannerVisible,
  setShowMultiplePurchaseModal,
  settingProductData,
  showMultipleSubscriptions,
  isFreeAdmin,
  toggleShowFeatureNotAvailableModal,
  title,
  orgData,
  userRole,
  history,
  isCliUser,
}) => {
  const openMultiplePurchaseModal = () => setShowMultiplePurchaseModal(true)

  const handlePurchaseFlow = () => {
    settingProductData()
    if (isFreeAdmin) {
      toggleShowFeatureNotAvailableModal(true)
      return
    }
    setShowSubscriptionAddonModal(true)
  }

  const handleManageSubscription = () => {
    history.push('/author/manage-subscriptions')
  }

  const isPartialPremiumUgradedUser =
    ['partial_premium'].includes(subType) && isPremiumUser
  const { defaultGrades = [], defaultSubjects = [] } = orgData
  const isGradeSubjectSelected = defaultGrades.length && defaultSubjects.length

  // hide upgrade if no options will be displayed in dropdown
  const showUpgradeBtn =
    !hasAllPremiumProductAccess || !isPartialPremiumUgradedUser

  const licenseExpiryDate = formatDate(subEndDate)

  return (
    <TopBanner isBannerVisible={isBannerVisible}>
      <HeaderSubscription>
        <Title>
          <h2>
            <IconSubscriptionHighlight width={19} height={19} />
            <span>{title}</span>
          </h2>
        </Title>
        <ActionButtons>
          <PlanText data-cy="yourPlanSubscription" className="plan">
            YOUR PLAN
          </PlanText>
          <PlanText data-cy="currentPlan" className="free">
            {isSubscribed && subType && licenseExpiryDate && isPremiumUser
              ? `${
                  isPartialPremiumUgradedUser
                    ? 'Enterprise'
                    : capitalize(subType.replace(/_/g, ' '))
                } Version`
              : 'Free'}
          </PlanText>
          {isBannerVisible && showMultipleSubscriptions && (
            <AuthorCompleteSignupButton
              renderButton={(handleClick) => (
                <EduButton
                  data-cy="manageSubscriptionButton"
                  isBlue
                  isGhost
                  height="24px"
                  onClick={handleClick}
                >
                  MANAGE SUBSCRIPTIONS
                </EduButton>
              )}
              onClick={handleManageSubscription}
            />
          )}
          <UpgradeButton
            hasAllPremiumProductAccess={hasAllPremiumProductAccess}
            handlePurchaseFlow={handlePurchaseFlow}
            isPartialPremiumUgradedUser={isPartialPremiumUgradedUser}
            isCliUser={isCliUser}
            openMultiplePurchaseModal={openMultiplePurchaseModal}
            showRenewalOptions={showRenewalOptions}
            subType={subType}
            userRole={userRole}
            isGradeSubjectSelected={isGradeSubjectSelected}
            showUpgradeBtn={showUpgradeBtn}
          />
        </ActionButtons>
      </HeaderSubscription>
      {isBannerVisible && (
        <BannerContent>
          <h3>
            {isPremiumUser ? (
              <span>You are on the Premium Plan</span>
            ) : (
              <span>There&apos;s a lot more in premium!</span>
            )}
          </h3>
          <p>
            {isPremiumUser
              ? `This plan expires on ${licenseExpiryDate}`
              : `Upgrade to premium for additional features, including:`}
          </p>
          <LearnMore onClick={openComparePlanModal}>Compare Plans</LearnMore>
        </BannerContent>
      )}
    </TopBanner>
  )
}

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
  setShowSubscriptionAddonModal: PropTypes.func,
  settingProductData: PropTypes.func,
  setShowMultiplePurchaseModal: PropTypes.func,
  isBannerVisible: PropTypes.bool,
  title: PropTypes.string,
}
SubscriptionHeader.defaultProps = {
  setShowSubscriptionAddonModal: () => {},
  settingProductData: () => {},
  setShowMultiplePurchaseModal: () => {},
  isBannerVisible: true,
  title: 'Subscription',
}

export default memo(withNamespaces('header')(SubscriptionHeader))
