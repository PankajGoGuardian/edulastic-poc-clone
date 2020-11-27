import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'

import ResponseFrequency from './ResponseFrequency'
import AssessmentSummary from './AssessmentSummary'
import PeerPerformance from './PeerPerformance'
import PerformanceByStandards from './PerformanceByStandards'
import PerformanceByStudents from './PerformanceByStudents'
import QuestionAnalysis from './QuestionAnalysis'

import SingleAssessmentReportFilters from './common/components/filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForSAR } from './common/utils/transformers'

import navigation from '../../common/static/json/navigation.json'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  setSARSettingsAction,
  getReportsSARSettings,
  resetSARSettingsAction,
} from './ducks'
import { getSAFilterDemographics } from './common/filterDataDucks'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import { updateCliUserAction } from '../../../../student/Login/ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import {
  ReportContaner,
  SearchField,
  FilterLabel,
  FilterButton,
} from '../../common/styled'

const INITIAL_DD_FILTERS = {
  gender: 'all',
  frlStatus: 'all',
  ellStatus: 'all',
  iepStatus: 'all',
  race: 'all',
}

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
    cliUser,
    setShowHeader,
    preventHeaderRender,
    demographics,
    sharingState,
    setSharingState,
    sharedReportList,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  const [isCliUser] = useState(
    cliUser || qs.parse(location.search, { ignoreQueryPrefix: true }).cliUser
  )
  const [ddfilter, setDdFilter] = useState({ ...INITIAL_DD_FILTERS })
  const [selectedExtras, setSelectedExtras] = useState({
    ...INITIAL_DD_FILTERS,
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
      setDdFilter({ ...selectedExtras })
    }
  }, [showApply, selectedExtras])

  const computeChartNavigationLinks = (sel, filt, _isCliUser) => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt)
      const obj = {}
      // eslint-disable-next-line array-callback-return
      arr.map((item) => {
        const val = filt[item] === '' ? 'All' : filt[item]
        obj[item] = val
      })
      obj.cliUser = _isCliUser
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
    // eslint-disable-next-line array-callback-return
    arr.map((item) => {
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

  const toggleFilter = (e) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const updateCB = (event, selected, comData) => {
    setShowApply(true)
    setSelectedExtras({
      ...selectedExtras,
      [comData]: selected.key,
    })
  }
  const locList = [
    'peer-performance',
    'performance-by-standards',
    'performance-by-students',
  ]
  const extraFilters = locList.includes(loc)
    ? demographics &&
      demographics.map((item) => (
        <SearchField key={item.key}>
          <FilterLabel>{item.title}</FilterLabel>
          <ControlDropDown
            selectCB={updateCB}
            data={item.data}
            comData={item.key}
            by={item.data[0]}
          />
        </SearchField>
      ))
    : []

  return (
    <FeaturesSwitch
      inputFeatures="singleAssessmentReport"
      actionOnInaccessible="hidden"
    >
      <>
        {firstLoad && <Spin size="large" />}
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
        <FlexContainer
          alignItems="flex-start"
          display={firstLoad ? 'none' : 'flex'}
        >
          <SingleAssessmentReportFilters
            reportId={reportId}
            onGoClick={onGoClick}
            loc={loc}
            history={history}
            location={location}
            match={match}
            performanceBandRequired={[
              '/author/reports/assessment-summary',
              '/author/reports/peer-performance',
              '/author/reports/performance-by-students',
            ].find((x) => window.location.pathname.startsWith(x))}
            isStandardProficiencyRequired={[
              '/author/reports/performance-by-standards',
            ].find((x) => window.location.pathname.startsWith(x))}
            extraFilters={extraFilters}
            style={
              reportId || !showFilter
                ? { display: 'none' }
                : { display: 'block' }
            }
            showApply={showApply}
            setShowApply={setShowApply}
            firstLoad={firstLoad}
            setFirstLoad={setFirstLoad}
          />
          {!isCliUser && !reportId ? (
            <FilterButton showFilter={showFilter} onClick={toggleFilter}>
              <IconFilter />
            </FilterButton>
          ) : null}
          <ReportContaner showFilter={showFilter}>
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
                />
              )}
            />
          </ReportContaner>
        </FlexContainer>
      </>
    </FeaturesSwitch>
  )
}

const ConnectedSingleAssessmentReportContainer = connect(
  (state) => ({
    settings: getReportsSARSettings(state),
    demographics: getSAFilterDemographics(state),
    cliUser: state.user?.isCliUser,
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setSARSettings: setSARSettingsAction,
    resetAllReports: resetAllReportsAction,
    updateCliUser: updateCliUserAction,
    resetSARSettings: resetSARSettingsAction,
    setSharingState: setSharingStateAction,
  }
)(SingleAssessmentReportContainer)

export { ConnectedSingleAssessmentReportContainer as SingleAssessmentReportContainer }
