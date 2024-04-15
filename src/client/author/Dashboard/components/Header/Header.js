import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Popover, Tooltip } from 'antd'
import { white, themeColor, darkOrange1 } from '@edulastic/colors'
import { EduButton, EduIf, FlexContainer, MainHeader } from '@edulastic/common'
import {
  IconAssignVideoQuiz,
  IconClockDashboard,
  IconHangouts,
  IconManage,
  IconPlusCircle,
} from '@edulastic/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { get } from 'lodash'
import { segmentApi } from '@edulastic/api'

import { roleuser, signUpState } from '@edulastic/constants'
import { slice } from '../../../Subscription/ducks'
// TODO: Change to SVG
import IMG from '../../../Subscription/static/6.png'
import {
  PopoverCancel,
  PopoverDetail,
  PopoverTitle,
  PopoverWrapper,
  UpgradeBtn,
  CloseButton,
} from './styled'
import { launchHangoutOpen, setShowClassCreationModalAction } from '../../ducks'
import {
  getUserSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  currentDistrictInstitutionIds,
  getManualEnrollmentAllowedSelector,
  isGcpsDistrictSelector,
} from '../../../src/selectors/user'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import {
  fetchCleverClassListRequestAction,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
  getCleverClassListSelector,
  setCreateClassTypeDetailsAction,
  setShowCanvasSyncModalAction,
  setShowCleverSyncModalAction,
  syncClassesWithCleverAction,
} from '../../../ManageClass/ducks'

import CanvasClassSelectModal from '../../../ManageClass/components/ClassListContainer/CanvasClassSelectModal'
import ClassSelectModal from '../../../ManageClass/components/ClassListContainer/ClassSelectModal'
import { getFormattedCurriculumsSelector } from '../../../src/selectors/dictionaries'
import AssignVideoQuizBanner from '../../../Banner/AssignVideoQuizBanner'

const getContent = ({
  setvisible,
  needsRenewal,
  isPremiumUser,
  isPremiumTrialUsed,
  handleShowTrialModal,
}) => {
  const Content = () => {
    if (!isPremiumUser && !isPremiumTrialUsed) {
      return (
        <>
          <Link to="/author/subscription">
            <PopoverCancel data-cy="upgradeButton">UPGRADE</PopoverCancel>
          </Link>
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <UpgradeBtn data-cy="freeTrialButton" onClick={handleClick}>
                TRY FOR FREE
              </UpgradeBtn>
            )}
            onClick={handleShowTrialModal}
          />
        </>
      )
    }
    return (
      <>
        <PopoverCancel data-cy="cancelButton" onClick={() => setvisible(false)}>
          {' '}
          NO, THANKS
        </PopoverCancel>
        <Link to="/author/subscription">
          <UpgradeBtn data-cy="upgradeButton">
            {needsRenewal ? 'RENEW NOW' : 'UPGRADE'}
          </UpgradeBtn>
        </Link>
      </>
    )
  }

  return (
    <FlexContainer width="475px" alignItems="flex-start">
      <CloseButton onClick={() => setvisible(false)}>x</CloseButton>
      <img src={IMG} width="165" height="135" alt="" />
      <FlexContainer
        flexDirection="column"
        width="280px"
        padding="15px 0 0 6px"
      >
        <PopoverTitle data-cy="upgradeTitle">
          Access Additional Features
        </PopoverTitle>
        <PopoverDetail data-cy="upgradeDescription">
          Get additional reports, options to assist students, collaborate with
          colleagues, anti-cheating tools and more.
        </PopoverDetail>
        <FlexContainer padding="15px 0 15px 0" width="100%">
          {Content()}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  )
}

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000
const TEN_DAYS = 10 * 24 * 60 * 60 * 1000

const HeaderSection = ({
  user,
  isSubscriptionExpired = false,
  t,
  openLaunchHangout,
  subscription,
  setShowCleverSyncModal,
  courseList,
  loadingCleverClassList,
  cleverClassList,
  getStandardsListBySubject,
  syncCleverClassList,
  defaultGrades = [],
  defaultSubjects = [],
  institutionIds,
  canvasCourseList,
  canvasSectionList,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  showCleverSyncModal,
  classData,
  districtPolicy,
  schoolPolicy,
  setShowHeaderTrialModal,
  isPremiumTrialUsed,
  showCanvasSyncModal,
  setShowCanvasSyncModal,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
  manualEnrollmentAllowed = true,
  isGcpsDistrict,
  history,
}) => {
  const { subEndDate, subType } = subscription || {}

  const { user: userInfo } = user
  const { currentSignUpState } = userInfo

  const [visible, setvisible] = useState(false)

  const trackClick = (event) => () =>
    segmentApi.trackUserClick({
      user: user.user,
      data: { event },
    })

  const launchHangout = () => {
    openLaunchHangout()
  }

  const isPremiumUser = user.user?.features?.premium
  const isVideoQuizAndAIEnabled = user.user?.features?.isVideoQuizAndAIEnabled
  /**
   *  a user is paid premium user if
   *  - subType exists and
   *  - premium is not through trial ie, only - (enterprise, premium, partial_premium) and
   *  - is partial premium user & premium is true
   *
   * TODO: refactor and define this at the top level
   */
  const isPaidPremium = !(
    !subType ||
    subType === 'TRIAL_PREMIUM' ||
    (subType === 'partial_premium' && !isPremiumUser)
  )

  const isAboutToExpire = subEndDate
    ? Date.now() + ONE_MONTH > subEndDate && Date.now() < subEndDate + TEN_DAYS
    : false

  const needsRenewal =
    ((isPaidPremium && isAboutToExpire) ||
      (!isPaidPremium && isSubscriptionExpired)) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const showPopup =
    (needsRenewal || !isPaidPremium) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const createNewClass = () => {
    setShowClassCreationModal(true)
    setCreateClassTypeDetails({ type: 'class' })
  }

  const sortableClasses = classData
    .filter((d) => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate)
  const unSortableClasses = classData.filter(
    (d) => d.asgnStartDate === null || d.asgnStartDate === undefined
  )

  const allClasses = [...sortableClasses, ...unSortableClasses]
  const allActiveClasses = allClasses.filter(
    (c) => c.active === 1 && c.type === 'class'
  )

  const closeCleverSyncModal = () => setShowCleverSyncModal(false)
  const closeCanvasSyncModal = () => setShowCanvasSyncModal(false)

  const handleShowTrialModal = () => setShowHeaderTrialModal(true)

  const isSignupComplete = currentSignUpState === signUpState.DONE

  const atleastOneClassPresent = allActiveClasses.length > 0

  const isHangoutEnabled =
    districtPolicy?.enableGoogleMeet === true
      ? true
      : schoolPolicy?.[0]?.enableGoogleMeet === true

  const isManualEnrollmentAllowed =
    user?.user?.role === roleuser.TEACHER ? manualEnrollmentAllowed : true
  const showCreateClass = atleastOneClassPresent && isManualEnrollmentAllowed
  const showVideoQuizBanner = [
    !isVideoQuizAndAIEnabled,
    !isGcpsDistrict,
    isPremiumUser,
  ].every((o) => !!o)

  return (
    <MainHeader Icon={IconClockDashboard} headingText={t('common.dashboard')}>
      <FlexContainer alignItems="center">
        <AssignVideoQuizBanner
          showBanner={showVideoQuizBanner}
          history={history}
          clickedFrom="Dashboard"
          user={user.user}
          component={IconAssignVideoQuiz}
        />
        {atleastOneClassPresent && (
          <>
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

            {isSignupComplete && isHangoutEnabled && (
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
            )}
          </>
        )}

        <CanvasClassSelectModal
          visible={showCanvasSyncModal}
          onCancel={closeCanvasSyncModal}
          user={userInfo}
          getCanvasCourseListRequest={getCanvasCourseListRequest}
          getCanvasSectionListRequest={getCanvasSectionListRequest}
          canvasCourseList={canvasCourseList}
          canvasSectionList={canvasSectionList}
          institutionId={institutionIds[0]}
        />
        <ClassSelectModal
          type="clever"
          visible={showCleverSyncModal}
          onSubmit={syncCleverClassList}
          onCancel={closeCleverSyncModal}
          loading={loadingCleverClassList}
          classListToSync={cleverClassList}
          courseList={courseList}
          getStandardsListBySubject={getStandardsListBySubject}
          refreshPage="dashboard"
          existingGroups={allClasses}
          defaultGrades={defaultGrades}
          defaultSubjects={defaultSubjects}
        />

        <EduIf condition={showCreateClass}>
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <EduButton
                isBlue
                style={{ marginLeft: '5px' }}
                data-cy="createNewClass"
                onClick={handleClick}
              >
                <IconPlusCircle width={16} height={16} /> NEW CLASS
              </EduButton>
            )}
            onClick={createNewClass}
            trackClick={trackClick('dashboard:create-new-class:click')}
          />
        </EduIf>
        {showPopup && (
          <PopoverWrapper>
            <Popover
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              trigger="click"
              placement="bottomRight"
              content={getContent({
                setvisible,
                needsRenewal,
                isPremiumUser,
                isPremiumTrialUsed,
                handleShowTrialModal,
              })}
              onClick={() => setvisible(true)}
              visible={visible}
            >
              {needsRenewal ? (
                <EduButton
                  data-cy="renewSubscription"
                  type="primary"
                  isBlue
                  style={{
                    marginLeft: '5px',
                    backgroundColor: darkOrange1,
                    border: 'none',
                  }}
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
                  data-cy="tryPremiumForFree"
                  onClick={trackClick('dashboard:upgrade:click')}
                >
                  <i className="fa fa-unlock-alt" aria-hidden="true" />
                  {!isPremiumUser && !isPremiumTrialUsed
                    ? 'TRY PREMIUM'
                    : 'Upgrade'}
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
  user: PropTypes.object.isRequired,
  isSubscriptionExpired: PropTypes.bool.isRequired,
  openLaunchHangout: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('header'),
  connect(
    (state) => ({
      user: getUserSelector(state),
      subscription: state?.subscription?.subscriptionData?.subscription,
      isSubscriptionExpired: state?.subscription?.isSubscriptionExpired,
      districtPolicy: get(state, 'user.user.orgData.policies.district'),
      schoolPolicy: get(state, 'user.user.orgData.policies.institutions'),
      canvasCourseList: get(state, 'manageClass.canvasCourseList', []),
      canvasSectionList: get(state, 'manageClass.canvasSectionList', []),
      courseList: get(state, 'coursesReducer.searchResult'),
      loadingCleverClassList: get(state, 'manageClass.loadingCleverClassList'),
      cleverClassList: getCleverClassListSelector(state),
      showCleverSyncModal: get(state, 'manageClass.showCleverSyncModal', false),
      showCanvasSyncModal: get(state, 'manageClass.showCanvasSyncModal', false),
      classData: state.dashboardTeacher.data,
      institutionIds: currentDistrictInstitutionIds(state),
      getStandardsListBySubject: (subject) =>
        getFormattedCurriculumsSelector(state, { subject }),
      defaultGrades: getInterestedGradesSelector(state),
      defaultSubjects: getInterestedSubjectsSelector(state),
      isPremiumTrialUsed:
        state.subscription?.subscriptionData?.isPremiumTrialUsed,
      manualEnrollmentAllowed: getManualEnrollmentAllowedSelector(state),
      isGcpsDistrict: isGcpsDistrictSelector(state),
    }),
    {
      openLaunchHangout: launchHangoutOpen,
      setShowCleverSyncModal: setShowCleverSyncModalAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      syncCleverClassList: syncClassesWithCleverAction,
      getCanvasCourseListRequest: getCanvasCourseListRequestAction,
      getCanvasSectionListRequest: getCanvasSectionListRequestAction,
      setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
      setShowCanvasSyncModal: setShowCanvasSyncModalAction,
      setShowClassCreationModal: setShowClassCreationModalAction,
      setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
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
