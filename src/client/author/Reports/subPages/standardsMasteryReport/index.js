import React, { useEffect, useRef, useMemo, useState } from 'react'
import { Route, Link } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'

import { FlexContainer } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'
import StandardsGradebook from './standardsGradebook'
import StandardsPerfromance from './standardsPerformance'
import StandardsFilters from './common/components/Filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { ControlDropDown } from '../../common/components/widgets/controlDropDown'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import {
  ReportContaner,
  SearchField,
  FilterLabel,
  FilterButton,
} from '../../common/styled'

import { setSMRSettingsAction, getReportsSMRSettings } from './ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { getReportsStandardsGradebook } from './standardsGradebook/ducks'
import {
  getReportsStandardsFilters,
  getFiltersSelector,
} from './common/filterDataDucks'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import {
  getUserRole,
  getInterestedCurriculumsSelector,
} from '../../../src/selectors/user'

import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForSMR } from './common/utils'
import { getFilterDropDownData } from './standardsGradebook/utils/transformers'
import { getDropDownData } from './standardsPerformance/utils/transformers'

import navigation from '../../common/static/json/navigation.json'
import dropDownFormat from './standardsGradebook/static/json/dropDownFormat.json'

const standardsMasteryReports = {
  'standards-gradebook': 'Standards Gradebook',
  'standards-performance-summary': 'Standards Performance Summary',
}

const StandardsMasteryReportContainer = (props) => {
  const {
    settings,
    setSMRSettings,
    resetAllReports,
    premium,
    setShowHeader,
    updateNavigation,
    loc,
    history,
    location,
    match,
    role,
    standardsGradebook,
    onRefineResultsCB,
    showFilter,
    standardsFilters,
    filters,
    interestedCurriculums,
    showApply,
    sharingState,
    setSharingState,
    sharedReportList,
  } = props

  const firstRender = useRef(true)

  useEffect(() => {
    setSMRSettings({
      ...settings,
      requestFilters: { ...(filters || standardsFilters?.filters) },
    })
    return () => {
      console.log('Standards Mastery Report Component Unmount')
      resetAllReports()
    }
  }, [])

  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const [sharedReport, userRole] = useMemo(() => {
    const _sharedReport = sharedReportList.find((s) => s._id === reportId)
    const _userRole = _sharedReport?.sharedBy?.role || role
    return [_sharedReport, _userRole]
  }, [reportId, sharedReportList])

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
          getNavigationTabLinks(
            draft,
            `?${qs.stringify(obj, { arrayFormat: 'comma' })}`
          )
        }
      )
    }
    return []
  }

  useEffect(() => {
    if (!firstRender.current) {
      const obj = {}
      const arr = Object.keys(settings.requestFilters)
      arr.forEach((item) => {
        if (settings.requestFilters[item] === '') {
          obj[item] = 'All'
        } else {
          obj[item] = settings.requestFilters[item]
        }
      })
      obj.testIds = settings.selectedTest.map((items) => items.key).join()
      obj.reportId = reportId || ''
      const path = qs.stringify(obj, { arrayFormat: 'comma' })
      history.push(`?${path}`)
    }
    firstRender.current = false

    const computedChartNavigatorLinks = computeChartNavigationLinks(
      settings.requestFilters
    )
    updateNavigation(
      !premium ? [computedChartNavigatorLinks[1]] : computedChartNavigatorLinks
    )
  }, [settings])

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  const toggleFilter = (e) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter)
    }
  }

  const [ddfilter, setDdFilter] = useState({
    schoolId: 'all',
    teacherId: 'all',
    groupId: 'all',
    gender: 'all',
    frlStatus: 'all',
    ellStatus: 'all',
    iepStatus: 'all',
    race: 'all',
  })
  const [tempDdfilter, setTempDdFilter] = useState({ ...ddfilter })

  let filterDropDownData = dropDownFormat.filterDropDownData
  filterDropDownData = useMemo(() => {
    const _standardsGradebook = get(standardsGradebook, 'data.result', {})
    if (!isEmpty(_standardsGradebook)) {
      const ddTeacherInfo = _standardsGradebook.teacherInfo
      const temp = next(dropDownFormat.filterDropDownData, () => {})
      return getFilterDropDownData(ddTeacherInfo, userRole).concat(temp)
    }
    return dropDownFormat.filterDropDownData
  }, [standardsGradebook])

  const orgData = get(standardsFilters, 'orgData', [])
  const [dynamicDropDownData, filterInitState] = useMemo(
    () => getDropDownData(orgData, userRole),
    [orgData, dropDownFormat.filterDropDownData, userRole]
  )
  const [ddfilterForPerformance, setDdFilterForPerformance] = useState(
    filterInitState
  )
  const [tempDdfilterForPerformance, setTempDdFilterForPerformance] = useState(
    filterInitState
  )

  const filterDropDownCB = (event, selected, comData) => {
    setShowApply(true)
    setTempDdFilter({
      ...tempDdfilter,
      [comData]: selected.key,
    })
  }

  const filterDropDownCBForPerformance = (event, selected, comData) => {
    setShowApply(true)
    setTempDdFilterForPerformance({
      ...tempDdfilterForPerformance,
      [comData]: selected,
    })
  }

  const onGoClick = (_settings) => {
    const obj = {}
    const arr = Object.keys(_settings.filters)
    arr.forEach((item) => {
      if (_settings.filters[item] === 'All') {
        obj[item] = ''
      } else {
        obj[item] = _settings.filters[item]
      }
    })
    setSMRSettings({
      ...settings,
      selectedTest: _settings.selectedTest,
      requestFilters: { ...obj },
    })
    if (!reportId) {
      setDdFilterForPerformance({ ...tempDdfilterForPerformance })
      setDdFilter({ ...tempDdfilter })
    }
  }

  let extraFilters = []
  if (loc === 'standards-gradebook') {
    extraFilters = filterDropDownData.map((item) => (
      <SearchField key={item.key}>
        <FilterLabel>{item.title}</FilterLabel>
        <ControlDropDown
          selectCB={filterDropDownCB}
          data={item.data}
          comData={item.key}
          by={item.data[0]}
        />
      </SearchField>
    ))
  } else if (loc === 'standards-performance-summary') {
    extraFilters = dynamicDropDownData.map((item) => (
      <SearchField key={item.key}>
        <FilterLabel>{item.title}</FilterLabel>
        <ControlDropDown
          data={item.data}
          comData={item.key}
          by={ddfilterForPerformance[item.key]}
          selectCB={filterDropDownCBForPerformance}
        />
      </SearchField>
    ))
  }

  if (isEmpty(interestedCurriculums)) {
    return (
      <NoDataNotification
        heading={`${standardsMasteryReports[loc]} report not available`}
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

  const transformedSettings = useMemo(() => {
    const _settings = { ...settings }
    if (loc === 'standards-performance-summary') {
      _settings.ddfilter = ddfilterForPerformance
    }
    const _requestFilters = transformFiltersForSMR(_settings)
    return { ...settings, requestFilters: _requestFilters }
  }, [settings, ddfilterForPerformance])

  useEffect(() => {
    if (sharedReport?.ddfilter) {
      setDdFilter(ddfilter)
    }
  }, [sharedReport])

  return (
    <FlexContainer alignItems="flex-start">
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
      <StandardsFilters
        onGoClick={onGoClick}
        loc={loc}
        history={history}
        location={location}
        match={match}
        style={showFilter ? { display: 'block' } : { display: 'none' }}
        showApply={showApply}
        setShowApply={setShowApply}
        extraFilter={extraFilters}
        reportId={reportId}
      />
      {!reportId ? (
        <FilterButton showFilter={showFilter} onClick={toggleFilter}>
          <IconFilter />
        </FilterButton>
      ) : null}
      <ReportContaner showFilter={showFilter}>
        <Route
          exact
          path="/author/reports/standards-gradebook"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StandardsGradebook
                {..._props}
                pageTitle={loc}
                ddfilter={ddfilter}
                settings={transformedSettings}
                standardsGradebook={standardsGradebook}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/standards-performance-summary"
          render={(_props) => {
            setShowHeader(true)
            return (
              <StandardsPerfromance
                {..._props}
                settings={transformedSettings}
                userRole={userRole}
                sharedReport={sharedReport}
              />
            )
          }}
        />
      </ReportContaner>
    </FlexContainer>
  )
}

const ConnectedStandardsMasteryReportContainer = connect(
  (state) => ({
    role: getUserRole(state),
    standardsFilters: getReportsStandardsFilters(state),
    standardsGradebook: getReportsStandardsGradebook(state),
    settings: getReportsSMRSettings(state),
    filters: getFiltersSelector(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setSMRSettings: setSMRSettingsAction,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
  }
)(StandardsMasteryReportContainer)

export { ConnectedStandardsMasteryReportContainer as StandardsMasteryReportContainer }
