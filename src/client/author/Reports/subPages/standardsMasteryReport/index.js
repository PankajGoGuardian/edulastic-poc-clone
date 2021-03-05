import React, { useEffect, useMemo, useState } from 'react'
import { Route, Link } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import { Spin, Col } from 'antd'

import { SubHeader } from '../../common/components/Header'

import StandardsPerfromance from './standardsPerformance'
import StandardsGradebook from './standardsGradebook'
import StandardsProgress from './standardsProgress'
import StandardsMasteryReportFilters from './common/components/Filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import { ReportContaner, FilterLabel } from '../../common/styled'

import { setSMRSettingsAction, getReportsSMRSettings } from './ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import {
  getSMRFilterDemographics,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTagsDataSelector,
  setTagsDataAction,
} from './common/filterDataDucks'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import {
  getUserRole,
  getInterestedCurriculumsSelector,
} from '../../../src/selectors/user'

import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForSMR } from './common/utils'

import navigation from '../../common/static/json/navigation.json'
import staticDropDownData from './common/static/json/staticDropDownData.json'

const StandardsMasteryReportContainer = (props) => {
  const {
    settings,
    setSMRSettings,
    resetAllReports,
    premium,
    setShowHeader,
    navigationItems,
    updateNavigation,
    loc,
    history,
    location,
    match,
    role,
    onRefineResultsCB,
    showFilter,
    interestedCurriculums,
    showApply,
    tempDdFilter,
    setTempDdFilter,
    tagsData,
    setTagsData,
    sharingState,
    setSharingState,
    sharedReportList,
    demographics,
    breadcrumbData,
    isCliUser,
  } = props

  const [firstLoad, setFirstLoad] = useState(true)
  const [ddfilter, setDdFilter] = useState({
    ...staticDropDownData.initialDdFilters,
  })
  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const standardIdFromLocationState = useMemo(
    () => (location.state?.standardId ? location.state.standardId : ''),
    [location.state]
  )

  const [sharedReport, userRole] = useMemo(() => {
    const _sharedReport =
      sharedReportList.length > 0
        ? sharedReportList.find((s) => s._id === reportId)
        : []
    const _userRole = _sharedReport?.sharedBy?.role || role
    return [_sharedReport, _userRole]
  }, [reportId, sharedReportList])

  const transformedSettings = useMemo(
    () => ({
      ...settings,
      requestFilters: transformFiltersForSMR(settings.requestFilters),
    }),
    [settings]
  )

  useEffect(
    () => () => {
      console.log('Standards Mastery Report Component Unmount')
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
    if (standardIdFromLocationState) {
      const _settings = { ...settings }
      _settings.requestFilters.standardId = standardIdFromLocationState
      setSMRSettings(_settings)
    }
  }, [standardIdFromLocationState])

  useEffect(() => {
    if (!showApply) {
      setDdFilter({ ...tempDdFilter })
    }
  }, [showApply, tempDdFilter])

  const computeChartNavigationLinks = (filt) => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt)
      const obj = {}
      arr.forEach((item) => {
        const val = filt[item] === '' ? 'All' : filt[item]
        obj[item] = val
      })
      return next(
        navigation.navigation[navigation.locToData[loc].group],
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
    const _navigationItems = computeChartNavigationLinks(
      settings.requestFilters
    )
    updateNavigation(!premium ? [_navigationItems[1]] : _navigationItems)
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
      const {
        selectedTests = [],
        filters: { domainIds = [], tags = [] },
      } = _settings
      setSMRSettings({
        requestFilters: {
          ...obj,
          testIds: selectedTests.join(),
          domainIds: domainIds.join(),
          tagIds: tags.join(),
        },
      })
    }
    setShowApply(false)
  }

  const updateCB = (event, selected, comData) => {
    setShowApply(true)
    setTempDdFilter({
      ...tempDdFilter,
      [comData]: selected.key,
    })
    setTagsData({
      ...tagsData,
      [comData]: selected,
    })
  }

  const demographicsRequired = [
    'standards-gradebook',
    'standards-progress',
  ].includes(loc)
  useEffect(() => {
    if (!demographicsRequired) {
      setDdFilter({ ...staticDropDownData.initialDdFilters })
      setTempDdFilter({ ...staticDropDownData.initialDdFilters })
    }
  }, [loc])

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

  if (isEmpty(interestedCurriculums)) {
    const locTitle = navigation.navigation[
      navigation.locToData[loc].group
    ].find((l) => l.key === loc).title
    return (
      <NoDataNotification
        heading={`${locTitle} report not available`}
        description={
          <>
            Standards Mastery Reports can be generated based on the Interested
            Standards. To setup please go to{' '}
            <Link to="/author/profile">My Profile</Link> and select your
            Interested Standards.
          </>
        }
      />
    )
  }

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...transformedSettings.requestFilters,
            ddfilter,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
        />
      )}
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        <StandardsMasteryReportFilters
          reportId={reportId}
          onGoClick={onGoClick}
          loc={loc}
          history={history}
          location={location}
          match={match}
          extraFilters={extraFilters}
          tempDdFilter={tempDdFilter}
          setTempDdFilter={setTempDdFilter}
          tagsData={tagsData}
          setTagsData={setTagsData}
          demographicsRequired={demographicsRequired}
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          firstLoad={firstLoad}
          setFirstLoad={setFirstLoad}
        />
      </SubHeader>
      <ReportContaner showFilter={showFilter}>
        {firstLoad && <Spin size="large" />}
        <Route
          exact
          path="/author/reports/standards-performance-summary"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StandardsPerfromance
                {..._props}
                toggleFilter={toggleFilter}
                settings={transformedSettings}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/standards-gradebook"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StandardsGradebook
                {..._props}
                navigationItems={navigationItems}
                pageTitle={loc}
                toggleFilter={toggleFilter}
                settings={transformedSettings}
                ddfilter={ddfilter}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/standards-progress"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StandardsProgress
                {..._props}
                pageTitle={loc}
                toggleFilter={toggleFilter}
                settings={transformedSettings}
                ddfilter={ddfilter}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
      </ReportContaner>
    </>
  )
}

const ConnectedStandardsMasteryReportContainer = connect(
  (state) => ({
    role: getUserRole(state),
    demographics: getSMRFilterDemographics(state),
    settings: getReportsSMRSettings(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tagsData: getTagsDataSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  {
    setSMRSettings: setSMRSettingsAction,
    resetAllReports: resetAllReportsAction,
    setTempDdFilter: setTempDdFilterAction,
    setTagsData: setTagsDataAction,
    setSharingState: setSharingStateAction,
  }
)(StandardsMasteryReportContainer)

export { ConnectedStandardsMasteryReportContainer as StandardsMasteryReportContainer }
