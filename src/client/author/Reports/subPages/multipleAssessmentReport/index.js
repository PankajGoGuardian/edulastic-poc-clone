/* eslint-disable array-callback-return */
import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { isEmpty } from 'lodash'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin, Col } from 'antd'

import { SubHeader } from '../../common/components/Header'

import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForMAR } from './common/utils/transformers'

import navigation from '../../common/static/json/navigation.json'

import MultipleAssessmentReportFilters from './common/components/filters/filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import PeerProgressAnalysis from './PeerProgressAnalysis'
import StudentProgress from './StudentProgress'
import PerformanceOverTime from './PerformanceOverTime'

import { setMARSettingsAction, getReportsMARSettings } from './ducks'
import {
  getReportsMARFilterData,
  getMAFilterDemographics,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTagsDataSelector,
  setTagsDataAction,
} from './common/filterDataDucks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'

import { ReportContainer, FilterLabel } from '../../common/styled'

const MultipleAssessmentReportContainer = (props) => {
  const {
    settings,
    setMARSettings,
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
    tagsData,
    setTagsData,
    sharingState,
    setSharingState,
    sharedReportList,
    demographics,
    isCliUser,
    breadcrumbData,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  const [MARFilterData, setMARFilterData] = useState({})
  const [ddfilter, setDdFilter] = useState({})
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
      requestFilters: transformFiltersForMAR(settings.requestFilters),
    }),
    [settings]
  )

  useEffect(
    () => () => {
      console.log('Multiple Assessment Summary Component Unmount')
      resetAllReports()
    },
    []
  )

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

  const computeChartNavigationLinks = (filt) => {
    if (navigation.locToData[pageTitle]) {
      const arr = Object.keys(filt)
      const obj = {}
      arr.forEach((item) => {
        const val = filt[item] === '' ? 'All' : filt[item]
        obj[item] = val
      })
      return next(
        navigation.navigation[navigation.locToData[pageTitle].group],
        (draft) => {
          getNavigationTabLinks(draft, `?${qs.stringify(obj)}`)
        }
      )
    }
    return []
  }

  useEffect(() => {
    if (settings.requestFilters.termId) {
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
    const navigationItems = computeChartNavigationLinks(settings.requestFilters)
    updateNavigation(navigationItems)
  }, [settings])

  const toggleFilter = (e, status = false) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status || !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const onGoClick = (_settings) => {
    if (_settings.selectedTests) {
      const obj = {}
      const arr = Object.keys(_settings.filters)
      arr.forEach((item) => {
        const val =
          _settings.filters[item] === 'All' ? '' : _settings.filters[item]
        obj[item] = val
      })
      const { selectedTests = [] } = _settings
      setMARSettings({
        requestFilters: {
          ...obj,
          testIds: selectedTests.join(),
        },
      })
    }
    setShowApply(false)
  }

  const updateCB = (event, selected, comData) => {
    setTempDdFilter({
      ...tempDdFilter,
      [comData]: selected.key === 'all' ? '' : selected.key,
    })
    setTagsData({
      ...tagsData,
      [comData]: selected,
    })
    setShowApply(true)
  }

  const performanceBandRequired = [
    'performance-over-time',
    'student-progress',
  ].includes(pageTitle)

  const demographicsRequired = [
    'performance-over-time',
    'peer-progress-analysis',
    'student-progress',
  ].includes(pageTitle)

  useEffect(() => {
    if (!demographicsRequired) {
      setDdFilter({})
      setTempDdFilter({})
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

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={pageTitle}
          reportFilters={{
            ...transformedSettings.requestFilters,
            ddfilter,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
        />
      )}
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        <MultipleAssessmentReportFilters
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
          tagsData={tagsData}
          setTagsData={setTagsData}
          showApply={showApply}
          setShowApply={setShowApply}
          firstLoad={firstLoad}
          setFirstLoad={setFirstLoad}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      <ReportContainer>
        {firstLoad && <Spin size="large" />}
        <Route
          exact
          path="/author/reports/peer-progress-analysis/"
          render={(_props) => {
            setShowHeader(true)
            return (
              <PeerProgressAnalysis
                {..._props}
                settings={transformedSettings}
                ddfilter={ddfilter}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
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
                settings={transformedSettings}
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
                settings={transformedSettings}
                ddfilter={ddfilter}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
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
    tagsData: getTagsDataSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setMARSettings: setMARSettingsAction,
    resetAllReports: resetAllReportsAction,
    setTempDdFilter: setTempDdFilterAction,
    setTagsData: setTagsDataAction,
    setSharingState: setSharingStateAction,
  }
)(MultipleAssessmentReportContainer)

export { ConnectedMultipleAssessmentReportContainer as MultipleAssessmentReportContainer }
