import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import { WithResources } from '@edulastic/common/src/HOC/withResources'
import { notification } from '@edulastic/common'
import AppConfig from '../../app-config'

// themes
import ThemeContainer from './themes/index'
import {
  loadTestAction,
  setPreviewLanguageAction,
  setShowTestInfoSuccesAction,
} from './actions/test'
import { startAssessmentAction } from './actions/assessment'
import {
  getPreviewPlayerStateSelector,
  testActivityLoadingSelector,
  testLoadingSelector,
} from './selectors/test'
import RequirePassword from './RequirePassword'
import { showTestInfoModal } from '../publicTest/utils'
import { getUserAccommodations } from '../student/Login/ducks'

const isPublic = window.location.href.indexOf('/public/') > -1

const AssessmentPlayer = ({
  defaultAP,
  loadTest,
  match,
  preview = false,
  testId,
  demo,
  isPasswordValidated,
  testActivityLoading,
  test,
  LCBPreviewModal,
  closeTestPreviewModal,
  submitPreviewTest,
  isStudentReport = false,
  showTools,
  startAssessment,
  passages,
  playlistId,
  studentReportModal,
  currentAssignmentId,
  currentAssignmentClass,
  playerPreviewState,
  setShowTestInfoSucces,
  setSelectedLanguage,
  loading,
  history,
  title,
  testType,
  isModalVisible,
  isShowStudentWork,
  accommodations,
  ...restProps
}) => {
  testId = preview ? testId : match.params.id
  useEffect(() => {
    const { utaId: testActivityId, groupId } = match.params
    // if its from a modal that maybe showing the answer, then dont reset the answer.
    if (!LCBPreviewModal) startAssessment()
    // if showing student work dont genrate question labels again
    loadTest({
      testId,
      testActivityId,
      preview,
      demo,
      test,
      groupId: groupId || currentAssignmentClass,
      isStudentReport,
      isShowStudentWork,
      playlistId,
      currentAssignmentId,
    })
  }, [testId])

  if (!window.confirmBeforeGoBack && !demo && !preview) {
    // attaching event func to window to access after component unmounted
    window.confirmBeforeGoBack = (e) => {
      e.preventDefault()
      const matched = e.target.location.pathname.match(
        new RegExp(
          '/student/(assessment|practice)/.*/class/.*/uta/.*/itemId/.*'
        )
      )
      if (!matched) {
        if (
          window.confirm(
            'You are navigating away and you will quit the assignment. Are you sure?'
          )
        ) {
          // to remove attached event from window after execuation done

          return true
        }
        window.history.go(1)
        return false
      }
      console.warn('ev', e)
    }
  }

  const confirmBeforeQuitting = (e) => {
    // for older IE versions
    e = e || window.event
    if (e) {
      e.returnValue = 'Are you sure you want to quit?'
    }
    // for modern browsers
    // note: for modern browsers support for custom messages has been deprecated
    return 'Are you sure you want to quit'
  }

  const handleStartPreview = ({ selectedLang }) => {
    if (playerPreviewState.multiLanguageEnabled && !selectedLang) {
      notification({ type: 'warn', messageKey: 'selectLanguage' })
    } else {
      setShowTestInfoSucces(true)
    }
  }
  const [isInfoVisible, setIsInfoVisible] = useState(false)

  useEffect(() => {
    if (isPublic) {
      // can't return undefined from useEffect hook
      return () => {}
    }
    window.removeEventListener('popstate', window.confirmBeforeGoBack)
    if (!demo && !preview) {
      window.addEventListener('popstate', window.confirmBeforeGoBack)
    }
    return () => {
      if (!demo && !preview && window.confirmBeforeGoBack) {
        setTimeout(() => {
          window.removeEventListener('popstate', window.confirmBeforeGoBack)
          delete window.confirmBeforeGoBack
        }, 1000)
      }
      window.removeEventListener('beforeunload', confirmBeforeQuitting)
    }
  }, [])
  if (
    preview &&
    !loading &&
    !playerPreviewState.viewTestInfoSuccess &&
    isModalVisible
  ) {
    const preferredLanguage = accommodations?.preferredLanguage || ''
    if (!isInfoVisible) {
      setIsInfoVisible(true)
      showTestInfoModal({
        pauseAllowed: playerPreviewState.pauseAllowed,
        allowedTime: playerPreviewState.allowedTime,
        multiLanguageEnabled: playerPreviewState.multiLanguageEnabled,
        languagePreference:
          playerPreviewState.languagePreference || preferredLanguage,
        timedAssignment: playerPreviewState.timedAssignment,
        hasInstruction: playerPreviewState.hasInstruction,
        instruction: playerPreviewState.instruction,
        setSelectedLanguage,
        startAssignment: handleStartPreview,
        attemptCount: 0,
        maxAttempts: 1,
        testId,
        testType,
        history,
        title,
        notifyCancel: false,
        closeTestPreviewModal,
        preview: true,
      })
    }
    return null
  }

  if (preview && playerPreviewState.viewTestInfoSuccess) {
    return (
      <ThemeContainer
        closeTestPreviewModal={closeTestPreviewModal}
        submitPreviewTest={submitPreviewTest}
        LCBPreviewModal={LCBPreviewModal}
        test={test}
        defaultAP={defaultAP}
        preview
        demo={demo}
        showTools={showTools}
        isStudentReport={isStudentReport}
        passages={passages}
        studentReportModal={studentReportModal}
        testId={testId}
        isShowStudentWork={isShowStudentWork}
        {...restProps}
      />
    )
  }
  if (testActivityLoading) {
    return <Spin />
  }
  if (!isPasswordValidated) {
    return <RequirePassword />
  }
  const groupId = match.params.groupId || ''
  const utaId = match.params?.utaId
  return (
    <Switch>
      <Route
        path={`${match.url}/itemId/:itemId`}
        render={() => (
          <WithResources resources={[AppConfig.jqueryPath]} fallBack={<Spin />}>
            <ThemeContainer
              passages={passages}
              utaId={utaId}
              defaultAP={defaultAP}
              url={match.url}
              groupId={groupId}
              testId={match.params.id}
            />
          </WithResources>
        )}
      />
      <Route
        path={`${match.url}`}
        render={() => (
          <WithResources resources={[AppConfig.jqueryPath]} fallBack={<Spin />}>
            <ThemeContainer
              passages={passages}
              utaId={utaId}
              defaultAP={defaultAP}
              url={match.url}
              testletType
              groupId={groupId}
              testId={match.params.id}
            />
          </WithResources>
        )}
      />
    </Switch>
  )
}

AssessmentPlayer.propTypes = {
  defaultAP: PropTypes.any.isRequired,
  loadTest: PropTypes.func.isRequired,
  closeTestPreviewModal: PropTypes.func,
  match: PropTypes.any.isRequired,
  preview: PropTypes.any,
  testId: PropTypes.string,
  test: PropTypes.object,
  LCBPreviewModal: PropTypes.any.isRequired,
}

AssessmentPlayer.defaultProps = {
  preview: false,
  testId: '',
  test: {},
  closeTestPreviewModal: () => {
    if (isPublic) {
      window.location.href = '/'
    }
  },
}

// export component
const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isPasswordValidated: state.test.isPasswordValidated,
      testActivityLoading: testActivityLoadingSelector(state),
      playerPreviewState: getPreviewPlayerStateSelector(state),
      loading: testLoadingSelector(state),
      title: state.test.title,
      testType: state.test.testType,
      zoomLevel: state.ui.zoomLevel,
      accommodations: getUserAccommodations(state),
    }),
    {
      loadTest: loadTestAction,
      startAssessment: startAssessmentAction,
      setShowTestInfoSucces: setShowTestInfoSuccesAction,
      setSelectedLanguage: setPreviewLanguageAction,
    }
  )
)
export default enhance(AssessmentPlayer)
