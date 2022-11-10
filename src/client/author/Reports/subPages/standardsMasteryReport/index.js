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
import PerformanceByRubricCriteria from './performanceByRubricCriteria'
import StandardsMasteryReportFilters from './common/components/Filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import { ReportContainer, FilterLabel } from '../../common/styled'

import {
  setSMRSettingsAction,
  getReportsSMRSettings,
  setSMRTagsDataAction,
} from './ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import {
  getSMRFilterDemographics,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTempTagsDataSelector,
  setTempTagsDataAction,
} from './common/filterDataDucks'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import {
  getUserRole,
  getInterestedCurriculumsSelector,
} from '../../../src/selectors/user'

import { getNavigationTabLinks } from '../../common/util'

import navigation from '../../common/static/json/navigation.json'
import staticDropDownData from './common/static/json/staticDropDownData.json'

const StandardsMasteryReportContainer = (props) => {
  const {
    settings,
    setSMRSettings,
    setSMRTagsData,
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
    tempTagsData,
    setTempTagsData,
    sharingState,
    setSharingState,
    sharedReportList,
    demographics,
    breadcrumbData,
    isCliUser,
    isPrinting,
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
    setSMRSettings({
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
        testIds: _requestFilters.testIds || '',
        domainIds: (_requestFilters.domainIds || []).join(','),
      },
    })
    setSMRTagsData({ ..._settings.tagsData })
    setShowApply(false)
  }

  const updateCB = (event, selected, comData) => {
    setShowApply(true)
    setTempDdFilter({
      ...tempDdFilter,
      [comData]: selected.key,
    })
    setTempTagsData({
      ...tempTagsData,
      [comData]: selected,
    })
  }

  const demographicsRequired = [
    'standards-gradebook',
    'standards-progress',
    'performance-by-rubric-criteria',
  ].includes(loc)
  useEffect(() => {
    if (!demographicsRequired) {
      setDdFilter({ ...staticDropDownData.initialDdFilters })
      setTempDdFilter({ ...staticDropDownData.initialDdFilters })
      setTempTagsData({
        ...tempTagsData,
        ...staticDropDownData.initialDdFilterTags,
      })
      setSMRTagsData({
        ...settings.tagsData,
        ...staticDropDownData.initialDdFilterTags,
      })
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

  const showDemographicFilterWarning = useMemo(() => {
    const _ddFilter = {}
    Object.keys(ddfilter).forEach((k) => {
      _ddFilter[k] = ddfilter[k] === 'all' ? '' : ddfilter[k]
    })
    return (
      !isEmpty(Object.values(_ddFilter).filter((val) => !!val)) &&
      ['standards-gradebook'].includes(loc)
    )
  }, [ddfilter, loc])

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...settings.requestFilters,
            ddfilter,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
          showDemographicFilterWarning={showDemographicFilterWarning}
        />
      )}
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      >
        <StandardsMasteryReportFilters
          isPrinting={isPrinting}
          reportId={reportId}
          onGoClick={onGoClick}
          loc={loc}
          history={history}
          location={location}
          match={match}
          extraFilters={extraFilters}
          tempDdFilter={tempDdFilter}
          setTempDdFilter={setTempDdFilter}
          tempTagsData={tempTagsData}
          setTempTagsData={setTempTagsData}
          tagsData={settings.tagsData}
          setTagsData={setSMRTagsData}
          demographicsRequired={demographicsRequired}
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
          path="/author/reports/standards-performance-summary"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StandardsPerfromance
                {..._props}
                toggleFilter={toggleFilter}
                settings={settings}
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
            // FIXME Don't set state directly in render function
            setShowHeader(true)
            return (
              <StandardsGradebook
                {..._props}
                navigationItems={navigationItems}
                pageTitle={loc}
                toggleFilter={toggleFilter}
                settings={settings}
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
                settings={settings}
                ddfilter={ddfilter}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/performance-by-rubric-criteria"
          render={(_props) => {
            setShowHeader(true)
            return (
              <PerformanceByRubricCriteria
                {..._props}
                isPrinting={isPrinting}
                pageTitle={loc}
                toggleFilter={toggleFilter}
                settings={settings}
                ddfilter={ddfilter}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
      </ReportContainer>
    </>
  )
}

const ConnectedStandardsMasteryReportContainer = connect(
  (state) => ({
    role: getUserRole(state),
    demographics: getSMRFilterDemographics(state),
    settings: getReportsSMRSettings(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tempTagsData: getTempTagsDataSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  {
    setSMRSettings: setSMRSettingsAction,
    setSMRTagsData: setSMRTagsDataAction,
    resetAllReports: resetAllReportsAction,
    setTempDdFilter: setTempDdFilterAction,
    setTempTagsData: setTempTagsDataAction,
    setSharingState: setSharingStateAction,
  }
)(StandardsMasteryReportContainer)

export { ConnectedStandardsMasteryReportContainer as StandardsMasteryReportContainer }
