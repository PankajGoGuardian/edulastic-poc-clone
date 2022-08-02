import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { roleuser, signUpState } from '@edulastic/constants'
import { withWindowSizes } from '@edulastic/common'
import { groupBy } from 'lodash'
import AddSchoolAndGradeModal from '../../student/Signup/components/TeacherContainer/AddSchoolAndGradeModal'
import {
  getShowGetStartedModalSelector,
  getShowJoinSchoolModalSelector,
  getShowWelcomePopupSelector,
  setShowJoinSchoolModalAction,
} from '../Dashboard/ducks'
import { getOrgSchools, getUser, getUserOrgId } from '../src/selectors/user'
import GetStarted from './components/GetStarted'
import WelcomePopup from './components/WelcomePopup'
import EdulasticOverviewModel from '../Dashboard/components/Showcase/components/Myclasses/components/EdulasticOverview/EdulasticOverviewModel'

const WelcomeContainer = ({
  showWelcomePopup,
  showGetStartedModal,
  showJoinSchoolModal,
  setShowJoinSchoolModal,
  user,
  orgSchools = [],
  userOrgId,
  onMouseDown,
  triggerSource = 'Get Started Button Click',
  windowWidth,
  dashboardTiles,
  location,
  userInfo,
}) => {
  const [showQuickStartGuide, setShowQuickStartGuide] = useState(null)
  const isCliUser = user?.openIdProvider?.toLowerCase() === 'cli'

  const onSuccessCallback = () => {
    setShowJoinSchoolModal(false)
    if (!location.pathname.includes('profile')) {
      const { BANNER } = groupBy(dashboardTiles, 'type')
      const quickStartGuideData = BANNER.find(
        (banner) => banner.description === '2 Min Overview'
      )?.config?.filters[0]
      const { data } = quickStartGuideData
      setShowQuickStartGuide(data)
    }
  }

  const closeJoinSchoolModal = () => {
    setShowJoinSchoolModal(false)
  }

  const isCanvasUserSchoolNotSelected =
    (userInfo.signupStatus === signUpState.SCHOOL_NOT_SELECTED ||
      userInfo.signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL) &&
    user?.openIdProvider === 'canvas'

  const isSchoolSignupOnly = !!(
    orgSchools.length === 0 &&
    !!userOrgId &&
    roleuser.TEACHER === user.role &&
    !isCanvasUserSchoolNotSelected
  )

  return (
    <>
      {showWelcomePopup && <WelcomePopup isVisible={showWelcomePopup} />}
      {showGetStartedModal && (
        <GetStarted isVisible={showGetStartedModal} isCliUser={isCliUser} />
      )}
      {showJoinSchoolModal && (
        <AddSchoolAndGradeModal
          isVisible={showJoinSchoolModal}
          handleCancel={closeJoinSchoolModal}
          isSchoolSignupOnly={isSchoolSignupOnly}
          onMouseDown={onMouseDown}
          onSuccessCallback={onSuccessCallback}
          triggerSource={triggerSource}
          allowCanvas={isCanvasUserSchoolNotSelected}
          hideJoinSchoolBanner
          isCliUser={isCliUser}
        />
      )}
      {showQuickStartGuide && (
        <EdulasticOverviewModel
          handleBannerModalClose={() => setShowQuickStartGuide(null)}
          isBannerModalVisible={showQuickStartGuide}
          setShowBannerModal={setShowQuickStartGuide}
          windowWidth={windowWidth}
          continueToDashboardButton
        />
      )}
    </>
  )
}

WelcomeContainer.propTypes = {
  user: PropTypes.object.isRequired,
  onMouseDown: PropTypes.func,
}

WelcomeContainer.defaultProps = {
  onMouseDown: () => {},
}

const enhance = compose(
  withWindowSizes,
  withRouter,
  connect(
    (state) => ({
      userInfo: state.user,
      showWelcomePopup: getShowWelcomePopupSelector(state),
      showGetStartedModal: getShowGetStartedModalSelector(state),
      showJoinSchoolModal: getShowJoinSchoolModalSelector(state),
      user: getUser(state),
      orgSchools: getOrgSchools(state),
      userOrgId: getUserOrgId(state),
      dashboardTiles: state.dashboardTeacher.configurableTiles,
    }),
    {
      setShowJoinSchoolModal: setShowJoinSchoolModalAction,
    }
  )
)

export default enhance(WelcomeContainer)
