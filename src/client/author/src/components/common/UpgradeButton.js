import { darkOrange1 } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, Menu } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const UpgradeButton = ({
  hasAllPremiumProductAccess,
  handlePurchaseFlow,
  isPartialPremiumUgradedUser,
  isCliUser,
  openMultiplePurchaseModal,
  showRenewalOptions,
  subType,
  userRole,
  roleuser,
  isGradeSubjectSelected,
  showUpgradeBtn,
  isDashboardView = false,
}) => {
  const handleEnterpriseClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/viewform',
      '_blank'
    )
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
  return (
    <Wrapper>
      {!showRenewalOptions &&
        !(['enterprise'].includes(subType) && roleuser.TEACHER !== userRole) &&
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
            <EduButton
              data-cy="upgradeButton"
              isBlue
              height={isDashboardView ? '36px' : '24px'}
            >
              {isDashboardView && (
                <i className="fa fa-unlock-alt" aria-hidden="true" />
              )}
              <span> Upgrade </span>
            </EduButton>
          </Dropdown>
        )}
      {showRenewalOptions && (
        <EduButton
          onClick={handlePurchaseFlow}
          isBlue
          height={isDashboardView ? '36px' : '24px'}
          data-cy="renewButton"
          className="renew-button"
        >
          {isDashboardView && (
            <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
          )}
          <span> Renew Subscription </span>
        </EduButton>
      )}
    </Wrapper>
  )
}

UpgradeButton.propTypes = {
  handlePurchaseFlow: PropTypes.func,
  openMultiplePurchaseModal: PropTypes.func,
}
UpgradeButton.defaultProps = {
  handlePurchaseFlow: () => {},
  openMultiplePurchaseModal: () => {},
}

export default UpgradeButton

const Wrapper = styled.div`
  .renew-button {
    background-color: ${darkOrange1};
    border: none;
  }
`
