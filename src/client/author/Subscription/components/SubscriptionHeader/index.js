import { EduButton } from '@edulastic/common'
import { IconSubscriptionHighlight } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { withNamespaces } from 'react-i18next'
import { Dropdown, Menu } from 'antd'
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
  isPaidPremium,
  hasAllPremiumProductAccess,
  isPremium,
  isFreeAdmin,
  toggleShowFeatureNotAvailableModal,
}) => {
  const handlePurchaseFlow = () => {
    if (isFreeAdmin) {
      toggleShowFeatureNotAvailableModal(true)
      return
    }
    setShowSubscriptionAddonModal(true)
  }
  const handleEnterpriseClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/viewform',
      '_blank'
    )
  }

  const multipleSubscriptionClick = () => {
    window.open('https://edulastic.com/teacher-premium/', '_blank')
  }

  const menu = (
    <Menu>
      <Menu.Item>
        {!hasAllPremiumProductAccess && (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <span data-cy="individualSubscription" onClick={handleClick}>
                INDIVIDUAL SUBSCRIPTION
              </span>
            )}
            onClick={handlePurchaseFlow}
          />
        )}
      </Menu.Item>
      <Menu.Item>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <span data-cy="multipleSubscription" onClick={handleClick}>
              MULTIPLE SUBSCRIPTIONS
            </span>
          )}
          onClick={multipleSubscriptionClick}
        />
      </Menu.Item>
      <Menu.Item>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <span data-cy="enterpriseSubscription" onClick={handleClick}>
              ENTERPRISE SUBSCRIPTION
            </span>
          )}
          onClick={handleEnterpriseClick}
        />
      </Menu.Item>
    </Menu>
  )

  const licenseExpiryDate = formatDate(subEndDate)

  return (
    <TopBanner>
      <HeaderSubscription>
        <Title>
          <h2>
            <IconSubscriptionHighlight width={19} height={19} />
            <span>Subscription</span>
          </h2>
        </Title>
        <ActionButtons>
          <PlanText data-cy="yourPlanSubscription" className="plan">
            YOUR PLAN
          </PlanText>
          <PlanText data-cy="currentPlan" className="free">
            {isSubscribed && subType && licenseExpiryDate
              ? `${
                  subType === 'partial_premium'
                    ? 'Enterprise'
                    : capitalize(subType.replace(/_/g, ' '))
                } Version`
              : 'Free'}
          </PlanText>

          {!showRenewalOptions && (
            <Dropdown
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              overlay={menu}
              placement="bottomRight"
              arrow
            >
              <EduButton data-cy="upgradeButton" isBlue height="24px">
                Upgrade
              </EduButton>
            </Dropdown>
          )}
          {isPaidPremium && showRenewalOptions && (
            <EduButton onClick={handlePurchaseFlow} isBlue height="24px">
              Renew Subscription
            </EduButton>
          )}
        </ActionButtons>
      </HeaderSubscription>
      <BannerContent>
        <h3>
          {isPremium ? (
            <span>You are on the Premium Plan</span>
          ) : (
            <span>There&apos;s a lot more in premium!</span>
          )}
        </h3>
        <p>
          {isPremium
            ? `This plan expires on ${licenseExpiryDate}`
            : `Upgrade to premium for additional features, including:`}
        </p>
        <LearnMore onClick={openComparePlanModal}>Learn More</LearnMore>
      </BannerContent>
    </TopBanner>
  )
}

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
}

export default memo(withNamespaces('header')(SubscriptionHeader))
