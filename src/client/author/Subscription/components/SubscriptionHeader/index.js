import { EduButton } from '@edulastic/common'
import { IconSubscriptionHighlight } from '@edulastic/icons'
import { darkOrange1 } from '@edulastic/colors'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { withNamespaces } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { Dropdown, Menu } from 'antd'
import { capitalize } from 'lodash'
import moment from 'moment'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import {
  ActionBtnWrapper,
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
  openPaymentServiceModal,
  showUpgradeOptions,
  showRenewalOptions,
  isSubscribed = false,
  subType,
  subEndDate,
  setShowUpgradeModal,
  hasUpgradeButton,
}) => {
  const menu = (
    <Menu>
      <Menu.Item onClick={() => setShowUpgradeModal(true)}>
        INDIVIDUAL SUBSCRIPTION
      </Menu.Item>
    </Menu>
  )

  const licenseExpiryDate = formatDate(subEndDate)

  return (
    <div>
      <ActionBtnWrapper>
        {showUpgradeOptions ? (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <EduButton isBlue width="215px" onClick={handleClick}>
                UPGRADE NOW FOR $100/YEAR
              </EduButton>
            )}
            onClick={openPaymentServiceModal}
          />
        ) : showRenewalOptions ? (
          <EduButton
            onClick={openPaymentServiceModal}
            type="primary"
            isBlue
            style={{
              marginLeft: '5px',
              backgroundColor: darkOrange1,
              border: 'none',
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
            <span>RENEW SUBSCRIPTION</span>
          </EduButton>
        ) : null}
      </ActionBtnWrapper>
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
            {hasUpgradeButton && (
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
            )}
          </ActionButtons>
        </HeaderSubscription>
        <BannerContent>
          <h3>There&apos;s a lot more in premium!</h3>
          <p>Upgrade to teacher premium for additional features, including:</p>
          <LearnMore onClick={openComparePlanModal}>Learn More</LearnMore>
        </BannerContent>
      </TopBanner>
    </div>
  )
}

SubscriptionHeader.propTypes = {
  openComparePlanModal: PropTypes.func.isRequired,
  openPaymentServiceModal: PropTypes.func.isRequired,
  showUpgradeOptions: PropTypes.bool.isRequired,
}

export default memo(withNamespaces('header')(SubscriptionHeader))
