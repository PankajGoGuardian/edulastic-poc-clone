import { lightGrey } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import HeaderTabs, {
  StyledTabs,
} from '@edulastic/common/src/components/HeaderTabs'
import { HeaderMidContainer } from '@edulastic/common/src/components/MainHeader'
import { roleuser } from '@edulastic/constants'
import { IconCart, IconSubscriptionHighlight } from '@edulastic/icons'
import { Dropdown, Menu, Tooltip } from 'antd'
import { capitalize } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { withNamespaces } from 'react-i18next'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import {
  ActionButtons,
  CartButton,
  CustomLink,
  HeaderSubscription,
  IconWrapper,
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

const CartInfo = ({ cartHasProducts, children }) =>
  !cartHasProducts ? (
    <Tooltip placement="bottom" title="Your cart is empty!" trigger="hover">
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  )

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
  uploadPO,
  schoolId,
  setCartVisible,
  cartQuantities = {},
}) => {
  const openMultiplePurchaseModal = () => setShowMultiplePurchaseModal(true)
  const cartCount = Object.keys(cartQuantities).filter(
    (x) => x && x != 'null' && cartQuantities[x] > 0
  ).length

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

  // hide upgrade if no options will be displayed in dropdown
  const showUpgradeBtn =
    (!hasAllPremiumProductAccess || !isPartialPremiumUgradedUser) &&
    !isManageSubscriptionView

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

  const cartHasProducts = Object.keys(cartQuantities)?.length

  const handleCartClick = () => {
    if (cartHasProducts) {
      setCartVisible(true)
    }
  }
  const showAddonsTab =
    isPartialPremiumUgradedUser || subType === 'enterprise' || isFreeAdmin

  return (
    <TopBanner>
      <HeaderSubscription className="subscription-header">
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
                linkLabel={`Enterprise ${schoolId ? '(School)' : '(District)'}`}
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

              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <CustomLink onClick={handleClick} data-cy="uploadPO">
                    Upload PO
                  </CustomLink>
                )}
                onClick={uploadPO}
              />

              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <CartInfo cartHasProducts={cartHasProducts}>
                    <CartButton data-cy="cartButton" onClick={handleClick}>
                      <IconWrapper>
                        <IconCart />
                        <span>{cartCount}</span>
                      </IconWrapper>
                      Cart
                    </CartButton>
                  </CartInfo>
                )}
                onClick={handleCartClick}
              />
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
