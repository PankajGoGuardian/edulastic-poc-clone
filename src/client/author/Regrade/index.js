import React, { Fragment, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { get } from 'lodash'
import BreadCrumb from '../src/components/Breadcrumb'
import { fetchAssignmentsAction } from '../TestPage/components/Assign/ducks'
import {
  setRegradeSettingsDataAction,
  getRegradingSelector,
  getRegradeFirebaseDocIdSelector,
  getRegradeSettingsAction,
  getIsLoadRegradeSettingsSelector,
  getAvaialbleRegradeSettingsSelector,
} from '../TestPage/ducks'
import Header from './Header'
import MainContent from './MainContent'
import RegradeNotificationListener from './RegradeNotificationListener'
import { SecondHeader } from './styled'

const Regrade = ({
  title,
  getAssignmentsByTestId,
  match,
  setRegradeSettings,
  districtId,
  history,
  isRegrading,
  regradeFirebaseDocId,
  getRegradeActions,
  isLoadRegradeSettings,
  availableRegradeSettings,
}) => {
  const { oldTestId, newTestId } = match.params
  const { state: _locationState } = history.location
  const settings = {
    newTestId,
    oldTestId,
    assignmentList: [],
    districtId,
    applyChangesChoice: 'ALL',
    options: {
      removedQuestion: 'DISCARD',
      addedQuestion: 'SKIP',
      testSettings: 'EXCLUDE',
      editedQuestion: 'SCORE',
    },
  }
  const [regradeSettings, regradeSettingsChange] = useState(settings)

  useEffect(() => {
    getAssignmentsByTestId({ testId: oldTestId, regradeAssignments: true })
    getRegradeActions({ oldTestId, newTestId })
  }, [])

  const onUpdateSettings = (key, value) => {
    const newState = {
      ...regradeSettings,
      options: {
        ...regradeSettings.options,
        [key]: value,
      },
    }
    regradeSettingsChange(newState)
  }

  const onApplySettings = () => {
    if (isLoadRegradeSettings) return
    setRegradeSettings(regradeSettings)
  }

  const onCancelRegrade = () => {
    history.push({
      pathname: `/author/tests/tab/review/id/${newTestId}`,
      state: _locationState,
    })
  }
  const userFlowUrl = _locationState?.editAssigned
    ? {
        title: 'Assignments',
        to: '/author/assignments',
      }
    : {
        title: 'Tests',
        to: '/author/tests',
      }

  const breadcrumbData = [userFlowUrl]
  if (!_locationState?.isRedirected) {
    breadcrumbData.push({
      title,
      to: `/author/tests/tab/review/id/${newTestId}`,
      state: _locationState,
    })
  }
  breadcrumbData.push({
    title: 'Regrade',
    to: '',
  })

  return (
    <>
      <Header
        onApplySettings={onApplySettings}
        onCancelRegrade={onCancelRegrade}
        title={title}
        isRegrading={isRegrading}
      />
      <SecondHeader>
        <BreadCrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </SecondHeader>
      <MainContent
        regradeSettings={regradeSettings}
        onUpdateSettings={onUpdateSettings}
        isLoadRegradeSettings={isLoadRegradeSettings}
        availableRegradeSettings={availableRegradeSettings}
      />
      {regradeFirebaseDocId && <RegradeNotificationListener />}
    </>
  )
}

export default withRouter(
  connect(
    (state) => ({
      title: get(
        state,
        ['authorTestAssignments', 'assignments', 0, 'title'],
        ''
      ),
      districtId: get(state, ['user', 'user', 'orgData', 'districtIds', 0]),
      isRegrading: getRegradingSelector(state),
      regradeFirebaseDocId: getRegradeFirebaseDocIdSelector(state),
      isLoadRegradeSettings: getIsLoadRegradeSettingsSelector(state),
      availableRegradeSettings: getAvaialbleRegradeSettingsSelector(state),
    }),
    {
      getAssignmentsByTestId: fetchAssignmentsAction,
      setRegradeSettings: setRegradeSettingsDataAction,
      getRegradeActions: getRegradeSettingsAction,
    }
  )(Regrade)
)
