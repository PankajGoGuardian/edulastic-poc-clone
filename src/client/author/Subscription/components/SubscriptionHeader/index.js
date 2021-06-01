import { lightGrey } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import HeaderTabs, {
  StyledTabs,
} from '@edulastic/common/src/components/HeaderTabs'
import { HeaderMidContainer } from '@edulastic/common/src/components/MainHeader'
import { roleuser } from '@edulastic/constants'
import { IconSubscriptionHighlight } from '@edulastic/icons'
import { Dropdown, Menu } from 'antd'
import { capitalize } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { memo, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import {
  ActionButtons,
  CartButton,
  CustomLink,
  HeaderSubscription,
  PlanText,
  Title,
  TopBanner,
  UserStatus,
} from './styled'

function formatDate(subEndDate) {
  if (!subEndDate) return null
  return moment(subEndDate).format('DD MMM, YYYY')
}

const tabsCustomStyle = {
  background: lightGrey,
  'border-bottom-color': lightGrey,
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
  setShowMultiplePurchaseModal,
  settingProductData,
  isFreeAdmin,
  toggleShowFeatureNotAvailableModal,
  title,
  orgData,
  userRole,
  isCliUser,
  isManageSubscriptionView = false,
  setShowEnterpriseTab,
  showEnterpriseTab,
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

  useEffect(() => {
    if (
      isPartialPremiumUgradedUser ||
      subType === 'enterprise' ||
      isFreeAdmin
    ) {
      setShowEnterpriseTab(true)
    }
  }, [])

  // hide upgrade if no options will be displayed in dropdown
  const showUpgradeBtn =
    !hasAllPremiumProductAccess || !isPartialPremiumUgradedUser

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
      {!isPartialPremiumUgradedUser && !isCliUser && (
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

  const showAddonsTab =
    isPartialPremiumUgradedUser || subType === 'enterprise' || isFreeAdmin

  return (
    <TopBanner>
      <HeaderSubscription>
        <Title>
          <h2>
            <IconSubscriptionHighlight width={19} height={19} />
            <span>{title}</span>
          </h2>
          <UserStatus>
            <PlanText data-cy="yourPlanSubscription" className="plan">
              YOUR PLAN
            </PlanText>
            <PlanText data-cy="currentPlan" className="free">
              {isSubscribed && subType && licenseExpiryDate && isPremiumUser
                ? `${
                    isPartialPremiumUgradedUser
                      ? 'Enterprise'
                      : capitalize(subType.replace(/_/g, ' '))
                  }`
                : 'Free'}
            </PlanText>
          </UserStatus>
        </Title>
        {!isManageSubscriptionView && (
          <HeaderMidContainer>
            <StyledTabs>
              {!showAddonsTab && (
                <HeaderTabs
                  dataCy="premiumTab"
                  isActive={!showEnterpriseTab}
                  linkLabel="Premium (Teacher)"
                  onClickHandler={() => setShowEnterpriseTab(false)}
                  activeStyle={tabsCustomStyle}
                />
              )}
              <HeaderTabs
                dataCy="EnterpriseTab"
                isActive={showEnterpriseTab}
                linkLabel="Enterprise (District)"
                onClickHandler={() => setShowEnterpriseTab(true)}
                activeStyle={tabsCustomStyle}
              />
              {showAddonsTab && (
                <HeaderTabs
                  dataCy="addonsTab"
                  isActive={!showEnterpriseTab}
                  linkLabel="Add ons"
                  onClickHandler={() => setShowEnterpriseTab(false)}
                  activeStyle={tabsCustomStyle}
                />
              )}
            </StyledTabs>
          </HeaderMidContainer>
        )}
        <ActionButtons>
          {!isManageSubscriptionView && (
            <>
              <CustomLink data-cy="comparePlans" onClick={openComparePlanModal}>
                Compare Plan
              </CustomLink>
              <CustomLink data-cy="uploadPO">Upload PO</CustomLink>
              <CartButton data-cy="cartButton">
                <span>01</span> Cart
              </CartButton>
            </>
          )}
          {isManageSubscriptionView &&
            !showRenewalOptions &&
            !(
              ['enterprise'].includes(subType) && roleuser.TEACHER !== userRole
            ) &&
            !(
              ['enterprise'].includes(subType) &&
              roleuser.TEACHER === userRole &&
              isGradeSubjectSelected
            ) &&
            showUpgradeBtn && (
              <Dropdown
                getPopupContainer={(node) => node.parentNode}
                overlay={menu}
                placement="bottomRight"
                arrow
              >
                <EduButton data-cy="upgradeButton" isBlue height="24px">
                  Upgrade
                </EduButton>
              </Dropdown>
            )}
          {isManageSubscriptionView && showRenewalOptions && (
            <EduButton onClick={handlePurchaseFlow} isBlue height="24px">
              Renew Subscription
            </EduButton>
          )}
        </ActionButtons>
      </HeaderSubscription>
    </TopBanner>
  )
}

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
  setShowSubscriptionAddonModal: PropTypes.func,
  settingProductData: PropTypes.func,
  setShowMultiplePurchaseModal: PropTypes.func,
  title: PropTypes.string,
}
SubscriptionHeader.defaultProps = {
  setShowSubscriptionAddonModal: () => {},
  settingProductData: () => {},
  setShowMultiplePurchaseModal: () => {},
  title: 'Subscription',
}

export default memo(withNamespaces('header')(SubscriptionHeader))
