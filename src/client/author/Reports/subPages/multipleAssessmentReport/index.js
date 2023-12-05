/* eslint-disable array-callback-return */
import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { isEmpty, omit } from 'lodash'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin, Col } from 'antd'

import { reportNavType, ReportPaths } from '@edulastic/constants/const/report'
import { EduIf } from '@edulastic/common'
import { SubHeader } from '../../common/components/Header'

import { getTabNavigationItems } from '../../common/util'

import MultipleAssessmentReportFilters from './common/components/filters/filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import PeerProgressAnalysis from './PeerProgressAnalysis'
import StudentProgress from './StudentProgress'
import PerformanceOverTime from './PerformanceOverTime'

import {
  setMARSettingsAction,
  getReportsMARSettings,
  setMARTagsDataAction,
} from './ducks'
import {
  getReportsMARFilterData,
  getMAFilterDemographics,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTempTagsDataSelector,
  setTempTagsDataAction,
} from './common/filterDataDucks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import {
  getSharingState,
  setSharingStateAction,
  setEnableReportSharingAction,
} from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'

import { ReportContainer, FilterLabel } from '../../common/styled'
import PreVsPostReport from './PreVsPost'

const MultipleAssessmentReportContainer = (props) => {
  const {
    settings,
    setMARSettings,
    setMARTagsData,
    loc: pageTitle,
    setShowHeader,
    resetAllReports,
    history,
    location,
    match,
    showFilter,
    showApply,
    updateNavigation,
    onRefineResultsCB,
    MARFilterData: _MARFilterData,
    tempDdFilter,
    setTempDdFilter,
    tempTagsData,
    setTempTagsData,
    sharingState,
    setSharingState,
    sharedReportList,
    demographics,
    isCliUser,
    breadcrumbData,
    isPrinting,
    setEnableReportSharing,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  // firstLoad & firstLoadHidden are hacky ways. useEffect(..., []) should be enough.
  // TODO remove firstLoad & firstLoadHidden
  const [firstLoadHidden, setFirstLoadHidden] = useState(false)
  const [MARFilterData, setMARFilterData] = useState({})
  const [ddfilter, setDdFilter] = useState({})
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
      console.log('Multiple Assessment Summary Component Unmount')
      resetAllReports()
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(sharedReport?.filters?.ddfilter)) {
      setDdFilter({ ...sharedReport.filters.ddfilter })
    }
  }, [sharedReport])

  useEffect(() => {
    if (!showApply) {
      setMARFilterData({ ..._MARFilterData })
    }
  }, [showApply, _MARFilterData])

  useEffect(() => {
    if (!showApply) {
      setDdFilter({ ...tempDdFilter })
    }
  }, [showApply, tempDdFilter])

  useEffect(() => {
    if (settings.requestFilters.termId) {
      setEnableReportSharing(true)
      const obj = {}
      const arr = Object.keys(settings.requestFilters)
      arr.forEach((item) => {
        const val =
          settings.requestFilters[item] === ''
            ? 'All'
            : settings.requestFilters[item]
        obj[item] = val
      })
      obj.reportId = reportId || ''
      const path = `?${qs.stringify(obj)}`
      history.push(path)
    }
    const navigationItems = getTabNavigationItems({
      loc: pageTitle,
      requestFilters: settings.requestFilters,
    })
    updateNavigation(navigationItems)
  }, [settings])

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const onGoClick = (_settings) => {
    const _requestFilters = {}
    Object.keys(_settings.filters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.filters[filterType] === 'All'
          ? ''
          : _settings.filters[filterType]
    })
    setMARSettings({
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
        testIds: _requestFilters.testIds || '',
      },
    })
    setMARTagsData({ ..._settings.tagsData })
    setShowApply(false)
  }

  const updateCB = (event, selected, comData) => {
    setTempDdFilter({
      ...tempDdFilter,
      [comData]: selected.key === 'all' ? '' : selected.key,
    })
    setTempTagsData({
      ...tempTagsData,
      [comData]: selected,
    })
    setShowApply(true)
  }

  const {
    PERFORMANCE_OVER_TIME,
    PEER_PROGRESS_ANALYSIS,
    STUDENT_PROGRESS,
    PRE_VS_POST,
  } = reportNavType
  const performanceBandRequired = [
    PERFORMANCE_OVER_TIME,
    PEER_PROGRESS_ANALYSIS,
    STUDENT_PROGRESS,
    PRE_VS_POST,
  ].includes(pageTitle)

  const demographicsRequired = [
    PERFORMANCE_OVER_TIME,
    PEER_PROGRESS_ANALYSIS,
    STUDENT_PROGRESS,
    PRE_VS_POST,
  ].includes(pageTitle)

  useEffect(() => {
    if (!demographicsRequired && !firstLoad) {
      setDdFilter({})
      setTempDdFilter({})
      const removeDemographics = (tags) =>
        omit(
          tags,
          demographics.map((d) => d.key)
        )
      setTempTagsData(removeDemographics(tempTagsData))
      setMARTagsData(removeDemographics(settings.tagsData))
    }
  }, [pageTitle])

  const extraFilters =
    demographicsRequired && demographics
      ? demographics.map((item) => (
          <Col span={6} key={item.key}>
            <FilterLabel>{item.title}</FilterLabel>
            <ControlDropDown
              selectCB={updateCB}
              data={item.data}
              comData={item.key}
              by={tempDdFilter[item.key] || item.data[0]}
            />
          </Col>
        ))
      : []

  const showDemographicFilterWarning = useMemo(() => {
    const _ddFilter = {}
    Object.keys(ddfilter).forEach((k) => {
      _ddFilter[k] = ddfilter[k] === 'all' ? '' : ddfilter[k]
    })
    return (
      !isEmpty(Object.values(_ddFilter).filter((val) => !!val)) &&
      ['performance-over-time', 'student-progress'].includes(pageTitle)
    )
  }, [ddfilter, pageTitle])

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={pageTitle}
          reportFilters={{
            ...settings.requestFilters,
            ddfilter,
          }}
          showModal={sharingState}
          showDemographicFilterWarning={showDemographicFilterWarning}
          setShowModal={setSharingState}
        />
      )}
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      >
        <MultipleAssessmentReportFilters
          isPrinting={isPrinting}
          reportId={reportId}
          onGoClick={onGoClick}
          loc={pageTitle}
          history={history}
          location={location}
          match={match}
          performanceBandRequired={performanceBandRequired}
          demographicsRequired={demographicsRequired}
          extraFilters={extraFilters}
          tempDdFilter={tempDdFilter}
          setTempDdFilter={setTempDdFilter}
          tempTagsData={tempTagsData}
          setTempTagsData={setTempTagsData}
          tagsData={settings.tagsData}
          showApply={showApply}
          setShowApply={setShowApply}
          firstLoad={firstLoad}
          setFirstLoad={setFirstLoad}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      <ReportContainer>
        <EduIf condition={!firstLoadHidden && firstLoad}>
          <Spin size="large" />
        </EduIf>
        <Route
          exact
          path="/author/reports/peer-progress-analysis/"
          render={(_props) => {
            setShowHeader(true)
            return (
              <PeerProgressAnalysis
                {..._props}
                settings={settings}
                ddfilter={ddfilter}
                MARFilterData={MARFilterData}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                pageTitle={pageTitle}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/student-progress/"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StudentProgress
                {..._props}
                settings={settings}
                pageTitle={pageTitle}
                ddfilter={ddfilter}
                MARFilterData={MARFilterData}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/performance-over-time/"
          render={(_props) => {
            setShowHeader(true)
            return (
              <PerformanceOverTime
                {..._props}
                settings={settings}
                ddfilter={ddfilter}
                MARFilterData={MARFilterData}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )
          }}
        />
        <Route
          exact
          path={`${ReportPaths.PRE_VS_POST}/`}
          render={(_props) => {
            setShowHeader(true)
            return (
              <PreVsPostReport
                {..._props}
                settings={settings}
                ddfilter={ddfilter}
                MARFilterData={MARFilterData}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
                setFirstLoadHidden={setFirstLoadHidden}
                pageTitle={pageTitle}
              />
            )
          }}
        />
      </ReportContainer>
    </>
  )
}

const ConnectedMultipleAssessmentReportContainer = connect(
  (state) => ({
    demographics: getMAFilterDemographics(state),
    settings: getReportsMARSettings(state),
    MARFilterData: getReportsMARFilterData(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tempTagsData: getTempTagsDataSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setMARTagsData: setMARTagsDataAction,
    setMARSettings: setMARSettingsAction,
    resetAllReports: resetAllReportsAction,
    setTempDdFilter: setTempDdFilterAction,
    setTempTagsData: setTempTagsDataAction,
    setSharingState: setSharingStateAction,
    setEnableReportSharing: setEnableReportSharingAction,
  }
)(MultipleAssessmentReportContainer)

export { ConnectedMultipleAssessmentReportContainer as MultipleAssessmentReportContainer }
