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
  setShowUpgradeModal,
  hasUpgradeButton,
}) => {
  const handleShowUpgradeModal = () => {
    setShowUpgradeModal(true)
  }
  const menu = (
    <Menu>
      <Menu.Item>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <span onClick={handleClick}>INDIVIDUAL SUBSCRIPTION</span>
          )}
          onClick={handleShowUpgradeModal}
        />
      </Menu.Item>
      <Menu.Item>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/formResponse"
          target="_blank"
          rel="noreferrer"
        >
          <span>ENTERPRISE SUBSCRIPTION</span>
        </a>
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
          <span className="plan">YOUR PLAN</span>
          <span className="free">
            {isSubscribed && subType && licenseExpiryDate
              ? `${
                  subType === 'partial_premium'
                    ? 'Enterprise'
                    : capitalize(subType.replace(/_/g, ' '))
                } Version`
              : 'Free'}
          </span>
          {hasUpgradeButton ? (
            <Dropdown
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              overlay={menu}
              placement="bottomRight"
              arrow
            >
              <EduButton isBlue height="24px">
                Upgrade
              </EduButton>
            </Dropdown>
          ) : showRenewalOptions ? (
            <EduButton onClick={handleShowUpgradeModal} isBlue height="24px">
              Renew Subscription
            </EduButton>
          ) : null}
        </ActionButtons>
      </HeaderSubscription>
      <BannerContent>
        <h3>There&apos;s a lot more in premium!</h3>
        <p>Upgrade to teacher premium for additional features, including:</p>
        <LearnMore onClick={openComparePlanModal}>Learn More</LearnMore>
      </BannerContent>
    </TopBanner>
  )
}

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
}

export default memo(withNamespaces('header')(SubscriptionHeader))
