import { EduButton } from '@edulastic/common'
import { IconSubscriptionHighlight } from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { withNamespaces } from 'react-i18next'
import { Dropdown, Menu } from 'antd'
import { capitalize } from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { roleuser } from '@edulastic/constants'
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
  hasAllPremiumProductAccess,
  isPremiumUser,
  isBannerVisible,
  setShowMultiplePurchaseModal,
  settingProductData,
  showMultipleSubscriptions,
  isFreeAdmin,
  toggleShowFeatureNotAvailableModal,
  title,
  isPartialPremium,
  orgData,
  userRole,
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
  const handleEnterpriseClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/viewform',
      '_blank'
    )
  }

  const isPartialPremiumUgradedUser =
    ['partial_premium'].includes(subType) && isPremiumUser
  const { defaultGrades = [], defaultSubjects = [] } = orgData
  const isGradeSubjectSelected = defaultGrades.length && defaultSubjects.length

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
      {!isPartialPremiumUgradedUser && (
        <Menu.Item>
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <span data-cy="multipleSubscription" onClick={handleClick}>
                MULTIPLE SUBSCRIPTIONS
              </span>
            )}
            onClick={openMultiplePurchaseModal}
          />
        </Menu.Item>
      )}
      {!isPartialPremiumUgradedUser && (
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
      )}
    </Menu>
  )

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
            <EduButton
              data-cy="manageSubscriptionButton"
              isBlue
              isGhost
              height="24px"
            >
              <Link to="/author/manage-subscriptions">
                MANAGE SUBSCRIPTIONS
              </Link>
            </EduButton>
          )}
          {!showRenewalOptions &&
            !(
              ['enterprise'].includes(subType) && roleuser.TEACHER !== userRole
            ) &&
            !(
              ['enterprise'].includes(subType) &&
              roleuser.TEACHER === userRole &&
              isGradeSubjectSelected
            ) && (
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
          {showRenewalOptions && (
            <EduButton onClick={handlePurchaseFlow} isBlue height="24px">
              Renew Subscription
            </EduButton>
          )}
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
          <LearnMore onClick={openComparePlanModal}>Learn More</LearnMore>
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
