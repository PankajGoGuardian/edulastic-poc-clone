import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin } from 'antd'
import { SubHeader } from '../../common/components/Header'

import EngagementSummary from './EngagementSummary'
import ActivityBySchool from './ActivityBySchool'
import ActivityByTeacher from './ActivityByTeacher'

import EngagementReportFilters from './common/components/filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { getNavigationTabLinks } from '../../common/util'

import navigation from '../../common/static/json/navigation.json'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  setERSettingsAction,
  getReportsERSettings,
  resetERSettingsAction,
} from './ducks'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContainer } from '../../common/styled'

const EngagementReportContainer = ({
  settings,
  setERSettings,
  onRefineResultsCB,
  updateNavigation,
  resetAllReports,
  loc,
  showFilter,
  showApply,
  history,
  location,
  match,
  sharingState,
  setSharingState,
  sharedReportList,
  breadcrumbData,
  isCliUser,
}) => {
  const [firstLoad, setFirstLoad] = useState(true)
  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )

  const toggleFilter = (e, status = false) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status || !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  useEffect(
    () => () => {
      console.log('Engagement Reports Component Unmount')
      setShowApply(false)
      resetAllReports()
    },
    []
  )

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
    const navigationItems = computeChartNavigationLinks(settings.requestFilters)
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
    setERSettings({ requestFilters: obj })
  }

  return (
    <FeaturesSwitch
      inputFeatures="engagementReport"
      actionOnInaccessible="hidden"
    >
      <>
        {sharingState && (
          <ShareReportModal
            reportType={loc}
            reportFilters={{ ...settings.requestFilters }}
            showModal={sharingState}
            setShowModal={setSharingState}
          />
        )}
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
          <EngagementReportFilters
            reportId={reportId}
            onGoClick={onGoClick}
            loc={loc}
            history={history}
            location={location}
            match={match}
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
            path="/author/reports/engagement-summary"
            render={(_props) => (
              <EngagementSummary
                {..._props}
                settings={settings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/activity-by-school"
            render={(_props) => (
              <ActivityBySchool
                {..._props}
                settings={settings}
                sharedReport={sharedReport}
                toggleFilter={toggleFilter}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/activity-by-teacher"
            render={(_props) => (
              <ActivityByTeacher
                {..._props}
                settings={settings}
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

const ConnectedEngagementReportContainer = connect(
  (state) => ({
    settings: getReportsERSettings(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setERSettings: setERSettingsAction,
    resetAllReports: resetAllReportsAction,
    resetERSettings: resetERSettingsAction,
    setSharingState: setSharingStateAction,
  }
)(EngagementReportContainer)

export { ConnectedEngagementReportContainer as EngagementReportContainer }
