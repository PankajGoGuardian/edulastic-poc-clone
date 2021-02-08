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
  isBannerVisible,
}) => {
  const handlePurchaseFlow = () => {
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
            <span data-cy="enterpriseSubscription" onClick={handleClick}>
              ENTERPRISE SUBSCRIPTION
            </span>
          )}
          onClick={handleEnterpriseClick}
        />
      </Menu.Item>
      <Menu.Item onClick={multipleSubscriptionClick}>
        <span data-cy="multipleSubscription">MULTIPLE SUBSCRIPTIONS</span>
      </Menu.Item>
    </Menu>
  )

  const licenseExpiryDate = formatDate(subEndDate)

  return (
    <TopBanner isBannerVisible={isBannerVisible}>
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

          {!isBannerVisible && (
            <EduButton
              data-cy="manageSubscriptionButton"
              isBlue
              isGhost
              height="24px"
            >
              MANAGE SUBSCRIPTIONS
            </EduButton>
          )}

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
      {isBannerVisible && (
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
              : `Upgrade to teacher premium for additional features, including:`}
          </p>
          <LearnMore onClick={openComparePlanModal}>Learn More</LearnMore>
        </BannerContent>
      )}
    </TopBanner>
  )
}

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
  setShowSubscriptionAddonModal: PropTypes.func,
  isBannerVisible: PropTypes.bool,
}
SubscriptionHeader.defaultProps = {
  setShowSubscriptionAddonModal: () => {},
  isBannerVisible: true,
}

export default memo(withNamespaces('header')(SubscriptionHeader))
