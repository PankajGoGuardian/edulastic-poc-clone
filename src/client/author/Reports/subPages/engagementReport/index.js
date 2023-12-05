import React, { useEffect, useState, useMemo } from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'
import { connect } from 'react-redux'

import { Spin } from 'antd'
import { SubHeader } from '../../common/components/Header'

import EngagementSummary from './EngagementSummary'
import ActivityBySchool from './ActivityBySchool'
import ActivityByTeacher from './ActivityByTeacher'

import EngagementReportFilters from './common/components/filters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'
import { getTabNavigationItems } from '../../common/util'

import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  setERTagsDataAction,
  setERSettingsAction,
  getReportsERSettings,
} from './ducks'
import {
  getSharingState,
  setSharingStateAction,
  setEnableReportSharingAction,
} from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContainer } from '../../common/styled'

const EngagementReportContainer = ({
  settings,
  setERSettings,
  setERTagsData,
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
  isPrinting,
  setEnableReportSharing,
}) => {
  const [firstLoad, setFirstLoad] = useState(true)
  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  useEffect(() => {
    setEnableReportSharing(false)
    return () => {
      console.log('Engagement Reports Component Unmount')
      setShowApply(false)
      resetAllReports()
    }
  }, [])

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
      loc,
      requestFilters: { ...settings.requestFilters, reportId: reportId || '' },
    })
    updateNavigation(navigationItems)
  }, [settings])

  const onGoClick = (_settings) => {
    const _requestFilters = {}
    Object.keys(_settings.filters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.filters[filterType] === 'All'
          ? ''
          : _settings.filters[filterType]
    })
    setERSettings({ requestFilters: { ..._requestFilters } })
    setERTagsData({ ..._settings.tagsData })
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
            isPrinting={isPrinting}
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
            tagsData={settings.tagsData}
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
    setERTagsData: setERTagsDataAction,
    setERSettings: setERSettingsAction,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    setEnableReportSharing: setEnableReportSharingAction,
  }
)(EngagementReportContainer)

export { ConnectedEngagementReportContainer as EngagementReportContainer }
