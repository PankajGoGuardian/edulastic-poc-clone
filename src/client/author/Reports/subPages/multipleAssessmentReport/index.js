/* eslint-disable array-callback-return */
import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { map, isEmpty } from 'lodash'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'

import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForMAR } from './common/utils/transformers'

import navigation from '../../common/static/json/navigation.json'
import extraFilterData from './common/static/extraFilterData.json'

import MultipleAssessmentReportFilters from './common/components/filters/MultipleAssessmentReportFilters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import PeerProgressAnalysis from './PeerProgressAnalysis'
import StudentProgress from './StudentProgress'
import PerformanceOverTime from './PerformanceOverTime'

import { setMARSettingsAction, getReportsMARSettings } from './ducks'
import {
  getReportsMARFilterData,
  getMAFilterDemographics,
} from './common/filterDataDucks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'

import {
  FilterButton,
  ReportContaner,
  SearchField,
  FilterLabel,
} from '../../common/styled'

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
    sharingState,
    setSharingState,
    sharedReportList,
    demographics,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  const [MARFilterData, setMARFilterData] = useState({})
  const [ddfilter, setDdFilter] = useState({})
  const [selectedExtras, setSelectedExtras] = useState({})
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
      setDdFilter({ ...selectedExtras })
    }
  }, [showApply, selectedExtras])

  const filterlist = extraFilterData[pageTitle] || []

  useEffect(() => {
    const initalDdFilters = filterlist.reduce(
      (acc, curr) => ({ ...acc, [curr.key]: '' }),
      {}
    )
    setSelectedExtras({ ...initalDdFilters })
    if (!showApply) {
      setDdFilter({ ...initalDdFilters })
    }
  }, [pageTitle])

  const computeChartNavigationLinks = (filt) => {
    if (navigation.locToData[pageTitle]) {
      const arr = Object.keys(filt)
      const obj = {}
      arr.map((item) => {
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
    if (settings.requestFilters.testIds) {
      const arr = Object.keys(settings.requestFilters)
      const obj = {}
      arr.map((item) => {
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
    const computedChartNavigatorLinks = computeChartNavigationLinks(
      settings.requestFilters
    )
    updateNavigation(computedChartNavigatorLinks)
  }, [settings])

  const toggleFilter = (e) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const onGoClick = (_settings) => {
    if (_settings.selectedTest) {
      const obj = {}
      const arr = Object.keys(_settings.filters)
      arr.map((item) => {
        const val =
          _settings.filters[item] === 'All' ? '' : _settings.filters[item]
        obj[item] = val
      })

      const { selectedTest = [] } = _settings
      setMARSettings({
        requestFilters: {
          ...obj,
          testIds: map(selectedTest, (test) => test).join(),
        },
      })
    }
    setShowApply(false)
  }

  const updateCB = (event, selected, comData) => {
    setShowApply(true)
    setSelectedExtras({
      ...selectedExtras,
      [comData]: selected.key === 'all' ? '' : selected.key,
    })
  }
  const pageTitleList = [
    'performance-over-time',
    'peer-progress-analysis',
    'student-progress',
  ]
  const extraFilters = pageTitleList.includes(pageTitle)
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
    <>
      {firstLoad && <Spin size="large" />}
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
      <FlexContainer
        alignItems="flex-start"
        display={firstLoad ? 'none' : 'flex'}
      >
        <MultipleAssessmentReportFilters
          reportId={reportId}
          onGoClick={onGoClick}
          loc={pageTitle}
          history={history}
          location={location}
          match={match}
          performanceBandRequired={[
            '/author/reports/student-progress',
            '/author/reports/performance-over-time',
          ].find((x) => window.location.pathname.startsWith(x))}
          style={
            reportId || !showFilter ? { display: 'none' } : { display: 'block' }
          }
          extraFilter={extraFilters}
          showApply={showApply}
          setShowApply={setShowApply}
          firstLoad={firstLoad}
          setFirstLoad={setFirstLoad}
        />
        {!reportId ? (
          <FilterButton showFilter={showFilter} onClick={toggleFilter}>
            <IconFilter />
          </FilterButton>
        ) : null}
        <ReportContaner showFilter={showFilter}>
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
                />
              )
            }}
          />
        </ReportContaner>
      </FlexContainer>
    </>
  )
}

const ConnectedMultipleAssessmentReportContainer = connect(
  (state) => ({
    demographics: getMAFilterDemographics(state),
    settings: getReportsMARSettings(state),
    MARFilterData: getReportsMARFilterData(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setMARSettings: setMARSettingsAction,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
  }
)(MultipleAssessmentReportContainer)

export { ConnectedMultipleAssessmentReportContainer as MultipleAssessmentReportContainer }
