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
import {
  getCanvasAllowedInstitutionPoliciesSelector,
  getCleverLibraryUserSelector,
  getGoogleAllowedInstitionPoliciesSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
} from '../../../src/selectors/user'
import CanvasClassSelectModal from '../../../ManageClass/components/ClassListContainer/CanvasClassSelectModal'
import { getUserDetails } from '../../../../student/Login/ducks'
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

const HeaderSection = ({
  premium,
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
  user,
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
}) => {
  const { subEndDate, subType } = subscription || {}
  const [showCanvasSyncModal, setShowCanvasSyncModal] = useState(false)

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

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  const closeCleverSyncModal = () => setShowCleverSyncModal(false)
  const closeCanvasSyncModal = () => setShowCanvasSyncModal(false)

  const hasNoActiveClassFallback =
    !loading &&
    allActiveClasses.length === 0 &&
    (googleAllowedInstitutions.length > 0 ||
      isCleverUser ||
      canvasAllowedInstitutions.length > 0)

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
            user={user}
            isClassLink={isClassLink}
          />
        )}
        <CanvasClassSelectModal
          visible={showCanvasSyncModal}
          onCancel={closeCanvasSyncModal}
          user={user}
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
      isUserGoogleLoggedIn: get(state, 'user.user.isUserGoogleLoggedIn'),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(
        state
      ),
      canvasAllowedInstitutions: getCanvasAllowedInstitutionPoliciesSelector(
        state
      ),
      isCleverUser: getCleverLibraryUserSelector(state),
      user: getUserDetails(state),
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
