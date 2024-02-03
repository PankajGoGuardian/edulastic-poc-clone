/* eslint-disable array-callback-return */
import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { pick, omit } from 'lodash'
import qs from 'qs'

import { Spin } from 'antd'

import { SubHeader } from '../../common/components/Header'

import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import StudentMasteryProfile from './StudentMasteryProfile'
import StudentAssessmentProfile from './StudentAssessmentProfile'
import StudentProfileSummary from './StudentProfileSummary'
import StudentProfileReportFilters from './common/components/filter/filters'
import StudentProgressProfile from './StudentProgressProfile'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'

import {
  setSPRSettingsAction,
  getReportsSPRSettings,
  setSPRTagsDataAction,
} from './ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContainer } from '../../common/styled'
import {
  getSharingState,
  setSharingStateAction,
  setEnableReportSharingAction,
} from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'

import { getTabNavigationItems } from '../../common/util'

const StudentProfileReportContainer = (props) => {
  const {
    settings,
    loc,
    history,
    updateNavigation,
    location,
    match,
    showApply,
    showFilter,
    onRefineResultsCB,
    setSPRSettings,
    setSPRTagsData,
    resetAllReports,
    sharingState,
    setSharingState,
    sharedReportList,
    breadcrumbData,
    isCliUser,
    isPrinting,
    setEnableReportSharing,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )

  useEffect(() => {
    setEnableReportSharing(false)
    return () => {
      console.log('Student Profile Reports Component Unmount')
      resetAllReports()
    }
  }, [])

  useEffect(() => {
    if (settings.selectedStudent.key) {
      setEnableReportSharing(true)
      const path = `${settings.selectedStudent.key}?${qs.stringify(
        settings.requestFilters
      )}`
      history.push(path)
    }
    const navigationItems = getTabNavigationItems({
      loc,
      selected: settings.selectedStudent.key,
      requestFilters: { ...settings.requestFilters, reportId: reportId || '' },
    })
    updateNavigation(navigationItems)
  }, [settings])

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const onGoClick = (_settings) => {
    const requestFilterKeys = [
      'termId',
      'standardsProficiencyProfileId',
      'reportId',
      'performanceBandProfileId',
      'assignedBy',
      'curriculumId',
    ]
    const _requestFilters = {}
    Object.keys(_settings.filters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.filters[filterType] === 'All'
          ? ''
          : _settings.filters[filterType]
    })
    setSPRSettings({
      requestFilters: {
        ...pick(_requestFilters, requestFilterKeys),
        profileId: _requestFilters.standardsProficiencyProfileId,
      },
      standardFilters: {
        domainIds: _requestFilters.domainId,
        standardIds: _requestFilters.standardId,
      },
      selectedStudent: _settings.selectedStudent,
    })
    setSPRTagsData({ ..._settings.tagsData })
    setShowApply(false)
  }

  useEffect(() => {
    if (loc !== 'student-progress-profile' && !firstLoad) {
      setSPRSettings({
        ...settings,
        standardFilters: {
          domainIds: '',
          standardIds: '',
        },
      })
      setSPRTagsData(omit({ ...settings.tagsData }, ['domainId', 'standardId']))
    }
  }, [loc])

  const performanceBandRequired = [
    'student-profile-summary',
    'student-assessment-profile',
  ].includes(loc)

  const standardProficiencyRequired = [
    'student-profile-summary',
    'student-mastery-profile',
    'student-progress-profile',
  ].includes(loc)

  const standardFiltersRequired = ['student-progress-profile'].includes(loc)

  return (
    <FeaturesSwitch
      inputFeatures="singleAssessmentReport"
      actionOnInaccessible="hidden"
    >
      <>
        {sharingState && (
          <ShareReportModal
            reportType={loc}
            reportFilters={{
              ...settings.requestFilters,
              ...settings.standardFilters,
              studentId: settings?.selectedStudent?.key,
            }}
            showModal={sharingState}
            setShowModal={setSharingState}
          />
        )}
        <SubHeader
          breadcrumbData={breadcrumbData}
          isCliUser={isCliUser}
          alignment="baseline"
        >
          <StudentProfileReportFilters
            isPrinting={isPrinting}
            reportId={reportId}
            onGoClick={onGoClick}
            loc={loc}
            history={history}
            location={location}
            match={match}
            tagsData={settings.tagsData}
            performanceBandRequired={performanceBandRequired}
            standardProficiencyRequired={standardProficiencyRequired}
            standardFiltersRequired={standardFiltersRequired}
            showApply={showApply}
            setShowApply={setShowApply}
            showFilter={showFilter}
            toggleFilter={toggleFilter}
            firstLoad={firstLoad}
            setFirstLoad={setFirstLoad}
          />
        </SubHeader>
        <ReportContainer>
          {firstLoad && <Spin size="large" />}
          <Route
            exact
            path="/author/reports/student-mastery-profile/student/:studentId?"
            render={(_props) => (
              <StudentMasteryProfile
                {..._props}
                settings={settings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/student-assessment-profile/student/:studentId?"
            render={(_props) => (
              <StudentAssessmentProfile
                {..._props}
                settings={settings}
                pageTitle={loc}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/student-profile-summary/student/:studentId?"
            render={(_props) => (
              <StudentProfileSummary
                {..._props}
                settings={settings}
                pageTitle={loc}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/student-progress-profile/student/:studentId?"
            render={(_props) => (
              <StudentProgressProfile
                {..._props}
                history={history}
                settings={settings}
                setSPRTagsData={setSPRTagsData}
                pageTitle={loc}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
        </ReportContainer>
      </>
    </FeaturesSwitch>
  )
}

const enhance = connect(
  (state) => ({
    settings: getReportsSPRSettings(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setSPRTagsData: setSPRTagsDataAction,
    setSPRSettings: setSPRSettingsAction,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    setEnableReportSharing: setEnableReportSharingAction,
  }
)

const enhancedContainer = enhance(StudentProfileReportContainer)

export { enhancedContainer as StudentProfileReportContainer }
