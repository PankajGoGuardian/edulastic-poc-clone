import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin, Col } from 'antd'
import { SubHeader } from '../../common/components/Header'

import SingleAssessmentReportFilters from './common/components/filters'

import ResponseFrequency from './ResponseFrequency'
import AssessmentSummary from './AssessmentSummary'
import PeerPerformance from './PeerPerformance'
import PerformanceByStandards from './PerformanceByStandards'
import PerformanceByStudents from './PerformanceByStudents'
import QuestionAnalysis from './QuestionAnalysis'

import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForSAR } from './common/utils/transformers'

import navigation from '../../common/static/json/navigation.json'
import staticDropDownData from './common/static/staticDropDownData.json'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  setSARSettingsAction,
  getReportsSARSettings,
  resetSARSettingsAction,
} from './ducks'
import {
  getSAFilterDemographics,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTagsDataSelector,
  setTagsDataAction,
} from './common/filterDataDucks'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import { updateCliUserAction } from '../../../../student/Login/ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContainer, FilterLabel } from '../../common/styled'

const SingleAssessmentReportContainer = (props) => {
  const {
    settings,
    setSARSettings,
    onRefineResultsCB,
    updateNavigation,
    resetAllReports,
    loc,
    showFilter,
    showApply,
    history,
    location,
    match,
    updateCliUser,
    isCliUser: _isCliUser,
    setShowHeader,
    preventHeaderRender,
    demographics,
    tempDdFilter,
    setTempDdFilter,
    tagsData,
    setTagsData,
    sharingState,
    setSharingState,
    sharedReportList,
    breadcrumbData,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  const [isCliUser] = useState(
    _isCliUser || qs.parse(location.search, { ignoreQueryPrefix: true }).cliUser
  )
  const [ddfilter, setDdFilter] = useState({
    ...staticDropDownData.initialDdFilters,
  })
  const [customStudentUserId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).customStudentUserId
  )
  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )

  const transformedSettings = useMemo(
    () => ({
      ...settings,
      requestFilters: transformFiltersForSAR(settings.requestFilters),
    }),
    [settings]
  )

  useEffect(() => {
    if (isCliUser) {
      updateCliUser(true)
    }
    return () => {
      console.log('Single Assessment Reports Component Unmount')
      resetAllReports()
    }
  }, [])

  useEffect(() => {
    if (!showApply) {
      setDdFilter({ ...tempDdFilter })
    }
  }, [showApply, tempDdFilter])

  const computeChartNavigationLinks = (sel, filt, _cliUser) => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt)
      const obj = {}
      // eslint-disable-next-line array-callback-return
      arr.map((item) => {
        const val = filt[item] === '' ? 'All' : filt[item]
        obj[item] = val
      })
      obj.cliUser = _cliUser
      return next(
        navigation.navigation[navigation.locToData[loc].group],
        (draft) => {
          getNavigationTabLinks(draft, `${sel.key}?${qs.stringify(obj)}`)
        }
      )
    }
    return []
  }

  useEffect(() => {
    if (settings.selectedTest.key) {
      const arr = Object.keys(settings.requestFilters)

      const obj = {}
      // eslint-disable-next-line array-callback-return
      arr.map((item) => {
        const val =
          settings.requestFilters[item] === ''
            ? 'All'
            : settings.requestFilters[item]
        obj[item] = val
      })
      obj.reportId = reportId || ''
      if (isCliUser) {
        obj.cliUser = true
      }
      if (customStudentUserId) {
        obj.customStudentUserId = customStudentUserId
      }
      const path = `${settings.selectedTest.key}?${qs.stringify(obj)}`
      history.push(path)
    }
    const navigationItems = computeChartNavigationLinks(
      settings.selectedTest,
      settings.requestFilters,
      settings.cliUser
    )
    updateNavigation(navigationItems)
  }, [settings])

  const onGoClick = (_settings) => {
    const obj = {}
    const arr = Object.keys(_settings.filters)
    arr.forEach((item) => {
      const val =
        _settings.filters[item] === 'All' ? '' : _settings.filters[item]
      obj[item] = val
    })
    setSARSettings({
      selectedTest: _settings.selectedTest,
      requestFilters: obj,
      cliUser: isCliUser,
    })
  }

  const toggleFilter = (e, status = false) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status || !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const updateCB = (event, selected, comData) => {
    setTempDdFilter({
      ...tempDdFilter,
      [comData]: selected.key,
    })
    setTagsData({
      ...tagsData,
      [comData]: selected,
    })
    setShowApply(true)
  }

  const performanceBandRequired = [
    'assessment-summary',
    'peer-performance',
    'performance-by-students',
  ].includes(loc)

  const standardsProficiencyRequired = ['performance-by-standards'].includes(
    loc
  )

  const demographicsRequired = [
    'peer-performance',
    'performance-by-standards',
    'performance-by-students',
  ].includes(loc)

  useEffect(() => {
    if (!demographicsRequired) {
      setDdFilter({ ...staticDropDownData.initialDdFilters })
      setTempDdFilter({ ...staticDropDownData.initialDdFilters })
    }
  }, [loc])

  const extraFilters = demographicsRequired
    ? demographics &&
      demographics.map((item) => (
        <Col span={6} key={item.key}>
          <FilterLabel data-cy={item.key}>{item.title}</FilterLabel>
          <ControlDropDown
            selectCB={updateCB}
            data={item.data}
            comData={item.key}
            by={tempDdFilter[item.key] || item.data[0]}
          />
        </Col>
      ))
    : []

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
              ...transformedSettings.requestFilters,
              testId: transformedSettings.selectedTest.key,
            }}
            showModal={sharingState}
            setShowModal={setSharingState}
          />
        )}
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
          <SingleAssessmentReportFilters
            reportId={reportId}
            onGoClick={onGoClick}
            loc={loc}
            history={history}
            location={location}
            match={match}
            performanceBandRequired={performanceBandRequired}
            standardProficiencyRequired={standardsProficiencyRequired}
            demographicsRequired={demographicsRequired}
            extraFilters={extraFilters}
            tempDdFilter={tempDdFilter}
            setTempDdFilter={setTempDdFilter}
            tagsData={tagsData}
            setTagsData={setTagsData}
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
            path="/author/reports/assessment-summary/test/:testId?"
            render={(_props) => (
              <AssessmentSummary
                {..._props}
                settings={transformedSettings}
                setShowHeader={setShowHeader}
                preventHeaderRender={preventHeaderRender}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/peer-performance/test/:testId?"
            render={(_props) => (
              <PeerPerformance
                {..._props}
                settings={transformedSettings}
                filters={ddfilter}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/question-analysis/test/:testId?"
            render={(_props) => (
              <QuestionAnalysis
                {..._props}
                settings={transformedSettings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/response-frequency/test/:testId?"
            render={(_props) => (
              <ResponseFrequency
                {..._props}
                settings={transformedSettings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/performance-by-standards/test/:testId?"
            render={(_props) => (
              <PerformanceByStandards
                {..._props}
                settings={transformedSettings}
                pageTitle={loc}
                filters={ddfilter}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/performance-by-students/test/:testId?"
            render={(_props) => (
              <PerformanceByStudents
                {..._props}
                showFilter={showFilter}
                settings={transformedSettings}
                pageTitle={loc}
                filters={ddfilter}
                customStudentUserId={customStudentUserId}
                isCliUser={isCliUser}
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

const ConnectedSingleAssessmentReportContainer = connect(
  (state) => ({
    settings: getReportsSARSettings(state),
    demographics: getSAFilterDemographics(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tagsData: getTagsDataSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setSARSettings: setSARSettingsAction,
    resetAllReports: resetAllReportsAction,
    setTempDdFilter: setTempDdFilterAction,
    setTagsData: setTagsDataAction,
    updateCliUser: updateCliUserAction,
    resetSARSettings: resetSARSettingsAction,
    setSharingState: setSharingStateAction,
  }
)(SingleAssessmentReportContainer)

export { ConnectedSingleAssessmentReportContainer as SingleAssessmentReportContainer }
