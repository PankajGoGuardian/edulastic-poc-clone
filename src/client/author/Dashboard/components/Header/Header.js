import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Popover, Tooltip } from 'antd'
import { white, themeColor, darkOrange1 } from '@edulastic/colors'
import { EduButton, FlexContainer, MainHeader } from '@edulastic/common'
import {
  IconClockDashboard,
  IconHangouts,
  IconManage,
  IconPlusCircle,
} from '@edulastic/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import { slice } from '../../../Subscription/ducks'
// TODO: Change to SVG
import IMG from '../../../Subscription/static/6.png'
import {
  PopoverCancel,
  PopoverDetail,
  PopoverTitle,
  PopoverWrapper,
  UpgradeBtn,
} from './styled'
import { launchHangoutOpen } from '../../ducks'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const getContent = ({ setvisible, needsRenewal }) => (
  <FlexContainer width="475px" alignItems="flex-start">
    <img src={IMG} width="165" height="135" alt="" />
    <FlexContainer flexDirection="column" width="280px" padding="15px 0 0 6px">
      <PopoverTitle>Get Started!</PopoverTitle>
      <PopoverDetail>
        Get additional reports, options to assist students, collaborate with
        colleagues, anti-cheating tools and more.
      </PopoverDetail>
      <FlexContainer padding="15px 0 15px 0" width="100%">
        <PopoverCancel onClick={() => setvisible(false)}>
          {' '}
          NO, THANKS
        </PopoverCancel>
        <Link to="/author/subscription">
          <UpgradeBtn>{needsRenewal ? 'Renew Now' : 'UPGRADE NOW'}</UpgradeBtn>
        </Link>
      </FlexContainer>
    </FlexContainer>
  </FlexContainer>
)

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000

const HeaderSection = ({
  premium,
  isSubscriptionExpired = false,
  fetchUserSubscriptionStatus,
  t,
  openLaunchHangout,
  subscription,
  history,
}) => {
  const { subEndDate, subType } = subscription || {}

  useEffect(() => {
    fetchUserSubscriptionStatus()
  }, [])

  const [visible, setvisible] = useState(false)
  const launchHangout = () => {
    openLaunchHangout()
  }

  const isAboutToExpire = subEndDate
    ? Date.now() + ONE_MONTH > subEndDate
    : false

  const needsRenewal =
    (premium && isAboutToExpire) || (!premium && isSubscriptionExpired)
  const showPopup =
    (needsRenewal || !premium) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const createNewClass = () => history.push('/author/manageClass/createClass')

  return (
    <MainHeader Icon={IconClockDashboard} headingText={t('common.dashboard')}>
      <FlexContainer>
        <Tooltip title="Launch Google Meet">
          <StyledEduButton
            IconBtn
            isBlue
            data-cy="launch-google-meet"
            onClick={launchHangout}
            isGhost
          >
            <IconHangouts color={themeColor} height={21} width={19} />
          </StyledEduButton>
        </Tooltip>
        <Tooltip title="Manage Class">
          <Link to="/author/manageClass">
            <EduButton
              IconBtn
              isBlue
              style={{ marginLeft: '5px' }}
              data-cy="manageClass"
            >
              <IconManage />
            </EduButton>
          </Link>
        </Tooltip>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton
              isBlue
              style={{ marginLeft: '5px' }}
              data-cy="createNewClass"
              onClick={handleClick}
            >
              <IconPlusCircle width={16} height={16} /> CREATE NEW CLASS
            </EduButton>
          )}
          onClick={createNewClass}
        />
        {showPopup && (
          <PopoverWrapper>
            <Popover
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              trigger="click"
              placement="bottomRight"
              content={getContent({ setvisible, needsRenewal })}
              onClick={() => setvisible(true)}
              visible={visible}
            >
              {needsRenewal ? (
                <EduButton
                  type="primary"
                  isBlue
                  style={{
                    marginLeft: '5px',
                    backgroundColor: darkOrange1,
                    border: 'none',
                  }}
                  data-cy="manageClass"
                >
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    aria-hidden="true"
                  />
                  <span>RENEW SUBSCRIPTION</span>
                </EduButton>
              ) : (
                <EduButton
                  isBlue
                  style={{ marginLeft: '5px' }}
                  data-cy="manageClass"
                >
                  <i className="fa fa-unlock-alt" aria-hidden="true" />
                  UNLOCK MORE FEATURES
                </EduButton>
              )}
            </Popover>
          </PopoverWrapper>
        )}
      </FlexContainer>
    </MainHeader>
  )
}

HeaderSection.propTypes = {
  premium: PropTypes.any.isRequired,
  isSubscriptionExpired: PropTypes.bool.isRequired,
  fetchUserSubscriptionStatus: PropTypes.func.isRequired,
  openLaunchHangout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

const enhance = compose(
  withNamespaces('header'),
  withRouter,
  connect(
    (state) => ({
      premium: state?.user?.user?.features?.premium,
      subscription: state?.subscription?.subscriptionData?.subscription,
      isSubscriptionExpired: state?.subscription?.isSubscriptionExpired,
    }),
    {
      fetchUserSubscriptionStatus: slice?.actions?.fetchUserSubscriptionStatus,
      openLaunchHangout: launchHangoutOpen,
    }
  )
)

export default enhance(HeaderSection)

const StyledEduButton = styled(EduButton)`
  span {
    margin: 0 5px;
  }
  svg {
    .b {
      fill: ${white};
    }
  }
  &:hover,
  &:focus {
    .b {
      fill: ${themeColor};
    }
  }
`
