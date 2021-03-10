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
import { get } from 'lodash'
import { segmentApi } from '@edulastic/api'

import { signUpState } from '@edulastic/constants'
import { slice } from '../../../Subscription/ducks'
// TODO: Change to SVG
import IMG from '../../../Subscription/static/6.png'
import {
  PopoverCancel,
  PopoverDetail,
  PopoverTitle,
  PopoverWrapper,
  UpgradeBtn,
  StyledLink,
} from './styled'
import { launchHangoutOpen } from '../../ducks'
import {
  getUserSelector,
  getCanvasAllowedInstitutionPoliciesSelector,
  getCleverLibraryUserSelector,
  getGoogleAllowedInstitionPoliciesSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
} from '../../../src/selectors/user'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import HeaderSyncAction from '../Showcase/components/Myclasses/components/HeaderSyncAction/HeaderSyncAction'
import {
  fetchClassListAction,
  fetchCleverClassListRequestAction,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
  getCleverClassListSelector,
  setShowCleverSyncModalAction,
  syncClassesWithCleverAction,
} from '../../../ManageClass/ducks'

import CanvasClassSelectModal from '../../../ManageClass/components/ClassListContainer/CanvasClassSelectModal'
import ClassSelectModal from '../../../ManageClass/components/ClassListContainer/ClassSelectModal'
import { getFormattedCurriculumsSelector } from '../../../src/selectors/dictionaries'

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
const TEN_DAYS = 10 * 24 * 60 * 60 * 1000

const HeaderSection = ({
  user,
  isSubscriptionExpired = false,
  fetchUserSubscriptionStatus,
  t,
  openLaunchHangout,
  subscription,
  history,
  fetchClassList,
  isUserGoogleLoggedIn,
  googleAllowedInstitutions,
  canvasAllowedInstitutions,
  isCleverUser,
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
  teacherData,
  classData,
  loading,
  districtPolicy,
  schoolPolicy,
  setShowHeaderTrialModal,
  isPremiumTrialUsed,
}) => {
  const { subEndDate, subType } = subscription || {}
  const [showCanvasSyncModal, setShowCanvasSyncModal] = useState(false)

  const { user: userInfo } = user
  const { currentSignUpState } = userInfo

  useEffect(() => {
    fetchUserSubscriptionStatus()
  }, [])

  const [visible, setvisible] = useState(false)

  const trackClick = (event) => () =>
    segmentApi.trackUserClick({
      user: user.user,
      data: { event },
    })

  const launchHangout = () => {
    openLaunchHangout()
  }

  const isPaidPremium = !(
    !subType ||
    subType === 'TRIAL_PREMIUM' ||
    subType === 'partial_premium'
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

  const createNewClass = () => history.push('/author/manageClass/createClass')

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

  const isPremiumUser = user.user?.features?.premium

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  const closeCleverSyncModal = () => setShowCleverSyncModal(false)
  const closeCanvasSyncModal = () => setShowCanvasSyncModal(false)

  const handleShowTrialModal = () => setShowHeaderTrialModal(true)

  const hasNoActiveClassFallback =
    !loading &&
    allActiveClasses.length === 0 &&
    (googleAllowedInstitutions.length > 0 ||
      isCleverUser ||
      canvasAllowedInstitutions.length > 0)

  const hasGoogleMeetAndManageClass =
    currentSignUpState === signUpState.DONE && allActiveClasses.length > 0

  const isHangoutEnabled =
    districtPolicy?.enableGoogleMeet === true
      ? true
      : schoolPolicy?.[0]?.enableGoogleMeet === true

  return (
    <MainHeader Icon={IconClockDashboard} headingText={t('common.dashboard')}>
      <FlexContainer alignItems="center">
        {currentSignUpState === signUpState.ACCESS_WITHOUT_SCHOOL && (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <StyledLink data-cy="completeSignup" onClick={handleClick}>
                Complete signup process
              </StyledLink>
            )}
            trackClick={trackClick('dashboard:complete-sign-up:click')}
          />
        )}
        {!isPremiumUser && !isPremiumTrialUsed && (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <StyledLink data-cy="freeTrialButton" onClick={handleClick}>
                Free Trial
              </StyledLink>
            )}
            onClick={handleShowTrialModal}
          />
        )}
        {hasGoogleMeetAndManageClass && (
          <>
            {isHangoutEnabled && (
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
          </>
        )}
        {hasNoActiveClassFallback && (
          <HeaderSyncAction
            fetchClassList={fetchClassList}
            history={history}
            isUserGoogleLoggedIn={isUserGoogleLoggedIn}
            allowGoogleLogin={googleAllowedInstitutions.length > 0}
            canvasAllowedInstitutions={canvasAllowedInstitutions}
            enableCleverSync={isCleverUser}
            setShowCleverSyncModal={setShowCleverSyncModal}
            handleCanvasBulkSync={() => setShowCanvasSyncModal(true)}
            user={userInfo}
            isClassLink={isClassLink}
          />
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
                  data-cy="upgradeButton"
                  onClick={trackClick('dashboard:upgrade:click')}
                >
                  <i className="fa fa-unlock-alt" aria-hidden="true" />
                  Upgrade
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
  fetchUserSubscriptionStatus: PropTypes.func.isRequired,
  openLaunchHangout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

const enhance = compose(
  withNamespaces('header'),
  withRouter,
  connect(
    (state) => ({
      user: getUserSelector(state),
      subscription: state?.subscription?.subscriptionData?.subscription,
      isSubscriptionExpired: state?.subscription?.isSubscriptionExpired,
      isUserGoogleLoggedIn: get(state, 'user.user.isUserGoogleLoggedIn'),
      districtPolicy: get(state, 'user.user.orgData.policies.district'),
      schoolPolicy: get(state, 'user.user.orgData.policies.institutions'),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(
        state
      ),
      canvasAllowedInstitutions: getCanvasAllowedInstitutionPoliciesSelector(
        state
      ),
      isCleverUser: getCleverLibraryUserSelector(state),
      canvasCourseList: get(state, 'manageClass.canvasCourseList', []),
      canvasSectionList: get(state, 'manageClass.canvasSectionList', []),
      courseList: get(state, 'coursesReducer.searchResult'),
      loadingCleverClassList: get(state, 'manageClass.loadingCleverClassList'),
      cleverClassList: getCleverClassListSelector(state),
      showCleverSyncModal: get(state, 'manageClass.showCleverSyncModal', false),
      teacherData: get(state, 'dashboardTeacher.data', []),
      classData: state.dashboardTeacher.data,
      institutionIds: get(state, 'user.user.institutionIds', []),
      getStandardsListBySubject: (subject) =>
        getFormattedCurriculumsSelector(state, { subject }),
      defaultGrades: getInterestedGradesSelector(state),
      defaultSubjects: getInterestedSubjectsSelector(state),
      loading: state.dashboardTeacher.loading,
      isPremiumTrialUsed:
        state.subscription?.subscriptionData?.isPremiumTrialUsed,
    }),
    {
      fetchUserSubscriptionStatus: slice?.actions?.fetchUserSubscriptionStatus,
      openLaunchHangout: launchHangoutOpen,
      fetchClassList: fetchClassListAction,
      setShowCleverSyncModal: setShowCleverSyncModalAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      syncCleverClassList: syncClassesWithCleverAction,
      getCanvasCourseListRequest: getCanvasCourseListRequestAction,
      getCanvasSectionListRequest: getCanvasSectionListRequestAction,
      setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
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
