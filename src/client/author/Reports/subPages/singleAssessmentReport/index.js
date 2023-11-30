import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import { Spin, Col } from 'antd'
import { reportNavType } from '@edulastic/constants/const/report'
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

import navigation from '../../common/static/json/navigation.json'
import staticDropDownData from './common/static/staticDropDownData.json'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  setSARSettingsAction,
  getReportsSARSettings,
  setSARTagsDataAction,
} from './ducks'
import {
  getSAFilterDemographics,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTempTagsDataSelector,
  setTempTagsDataAction,
} from './common/filterDataDucks'
import {
  getSharingState,
  setEnableReportSharingAction,
  setSharingStateAction,
} from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import { updateCliUserAction } from '../../../../student/Login/ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContainer, FilterLabel } from '../../common/styled'

const pickAddionalFilters = {
  [reportNavType.PEER_PERFORMANCE]: [
    'analyseBy',
    'compareBy',
    'pageNo',
    'sortOrder',
    'sortKey',
  ],
  [reportNavType.PERFORMANCE_BY_STANDARDS]: [
    'analyzeBy',
    'compareBy',
    'page',
    'sortOrder',
    'sortKey',
    'viewBy',
  ],
}

const SingleAssessmentReportContainer = (props) => {
  const {
    settings,
    setSARSettings,
    setSARTagsData,
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
    tempTagsData,
    setTempTagsData,
    sharingState,
    setSharingState,
    sharedReportList,
    breadcrumbData,
    isPrinting,
    setEnableReportSharing,
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
  const [additionalUrlParams, setAdditionalUrlParams] = useState({})

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )

  useEffect(() => {
    setEnableReportSharing(false)
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
        const val =
          filt[item] === '' && item !== 'reportId' ? 'All' : filt[item]
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
      setEnableReportSharing(true)
      const arr = Object.keys(settings.requestFilters)

      let obj = {}
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
      if (!isEmpty(additionalUrlParams)) {
        obj = { ...obj, ...additionalUrlParams }
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
  }, [settings, additionalUrlParams])

  const onGoClick = (_settings, _additionalUrlParams) => {
    const _requestFilters = {}
    Object.keys(_settings.filters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.filters[filterType] === 'All'
          ? ''
          : _settings.filters[filterType]
    })
    setSARSettings({
      selectedTest: _settings.selectedTest,
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
        profileId: _requestFilters.performanceBandProfile,
      },
      cliUser: isCliUser,
    })
    setSARTagsData({ ..._settings.tagsData })
    if (!isEmpty(_additionalUrlParams)) {
      setAdditionalUrlParams(_additionalUrlParams)
    }
  }

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
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
    setTempTagsData({
      ...tempTagsData,
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
    'question-analysis',
    'response-frequency',
  ].includes(loc)

  useEffect(() => {
    if (!demographicsRequired && !firstLoad) {
      setDdFilter({ ...staticDropDownData.initialDdFilters })
      setTempDdFilter({ ...staticDropDownData.initialDdFilters })
      setTempTagsData({
        ...tempTagsData,
        ...staticDropDownData.initialDdFilterTags,
      })
      setSARTagsData({
        ...settings.tagsData,
        ...staticDropDownData.initialDdFilterTags,
      })
    }
    if (!isEmpty(additionalUrlParams)) {
      setAdditionalUrlParams({})
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

  const demographicFilters = useMemo(() => {
    const _ddFilter = {}
    Object.keys(ddfilter).forEach((k) => {
      _ddFilter[k] = ddfilter[k] === 'all' ? '' : ddfilter[k]
    })
    return _ddFilter
  }, [ddfilter])

  /** @todo
   * Demographic filters and settings are not updated together
   * so there will either be duplicate requests or request won't have updated filters
   * We need to combine both in a single object to make sure all filters are updated at the same time
   * Note: Below function should be used only when demographic filters are required for the backend query and
   * not for other purpose.
   */
  const demographicFilters2 = useMemo(() => {
    const _ddFilter = {}
    Object.keys(tempDdFilter).forEach((k) => {
      _ddFilter[k] = tempDdFilter[k] === 'all' ? '' : tempDdFilter[k]
    })
    return _ddFilter
  }, [tempDdFilter])

  const showDemographicFilterWarning = useMemo(
    () => !isEmpty(Object.values(demographicFilters).filter((val) => !!val)),
    [demographicFilters]
  )

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
              testId: settings.selectedTest.key,
            }}
            showModal={sharingState}
            showDemographicFilterWarning={showDemographicFilterWarning}
            setShowModal={setSharingState}
          />
        )}
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
          <SingleAssessmentReportFilters
            isCliUser={isCliUser}
            isPrinting={isPrinting}
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
            tempTagsData={tempTagsData}
            setTempTagsData={setTempTagsData}
            tagsData={settings.tagsData}
            setTagsData={setSARTagsData}
            showApply={showApply}
            setShowApply={setShowApply}
            showFilter={showFilter}
            toggleFilter={toggleFilter}
            firstLoad={firstLoad}
            setFirstLoad={setFirstLoad}
            pickAddionalFilters={pickAddionalFilters}
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
                settings={settings}
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
                settings={settings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                demographicFilters={demographicFilters2}
                setAdditionalUrlParams={setAdditionalUrlParams}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/question-analysis/test/:testId?"
            render={(_props) => (
              <QuestionAnalysis
                {..._props}
                settings={settings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                demographicFilters={demographicFilters2}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/response-frequency/test/:testId?"
            render={(_props) => (
              <ResponseFrequency
                {..._props}
                settings={settings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                demographicFilters={demographicFilters2}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/performance-by-standards/test/:testId?"
            render={(_props) => (
              <PerformanceByStandards
                {..._props}
                settings={settings}
                pageTitle={loc}
                demographicFilters={demographicFilters}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                setAdditionalUrlParams={setAdditionalUrlParams}
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
                settings={settings}
                pageTitle={loc}
                demographicFilters={demographicFilters}
                customStudentUserId={customStudentUserId}
                isCliUser={isCliUser}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                setAdditionalUrlParams={setAdditionalUrlParams}
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
    tempTagsData: getTempTagsDataSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setSARTagsData: setSARTagsDataAction,
    setSARSettings: setSARSettingsAction,
    resetAllReports: resetAllReportsAction,
    setTempDdFilter: setTempDdFilterAction,
    setTempTagsData: setTempTagsDataAction,
    updateCliUser: updateCliUserAction,
    setSharingState: setSharingStateAction,
    setEnableReportSharing: setEnableReportSharingAction,
  }
)(SingleAssessmentReportContainer)

export { ConnectedSingleAssessmentReportContainer as SingleAssessmentReportContainer }
