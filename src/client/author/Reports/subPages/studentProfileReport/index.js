/* eslint-disable array-callback-return */
import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'

import { FlexContainer } from '@edulastic/common'
import { IconFilter, IconCloseFilter } from '@edulastic/icons'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import StudentMasteryProfile from './StudentMasteryProfile'
import StudentAssessmentProfile from './StudentAssessmentProfile'
import StudentProfileSummary from './StudentProfileSummary'
import StudentProfileReportsFilters from './common/components/filter/StudentProfileReportsFilters'
import ShareReportModal from '../../common/components/Popups/ShareReportModal'

import { setSPRSettingsAction, getReportsSPRSettings } from './ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContaner, FilterButton } from '../../common/styled'
import { getSharingState, setSharingStateAction } from '../../ducks'
import { getSharedReportList } from '../../components/sharedReports/ducks'

import navigation from '../../common/static/json/navigation.json'

import { getNavigationTabLinks } from '../../common/util'
import { transformFiltersForSPR } from './common/utils/transformers'

const StudentProfileReportContainer = (props) => {
  const {
    settings,
    loc,
    history,
    updateNavigation,
    location,
    match,
    showFilter,
    onRefineResultsCB,
    setSPRSettings,
    resetAllReports,
    sharingState,
    setSharingState,
    sharedReportList,
  } = props

  const [reportId] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).reportId
  )

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )

  useEffect(
    () => () => {
      console.log('Student Profile Reports Component Unmount')
      resetAllReports()
    },
    []
  )

  const transformedSettings = useMemo(
    () => ({
      ...settings,
      requestFilters: transformFiltersForSPR(settings.requestFilters),
    }),
    [settings]
  )

  const computeChartNavigationLinks = (sel, filt) => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt)
      const obj = {}
      arr.map((item) => {
        const val = filt[item] === '' ? 'All' : filt[item]
        obj[item] = val
      })
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
    if (settings.selectedStudent.key) {
      const path = `${settings.selectedStudent.key}?${qs.stringify(
        settings.requestFilters
      )}`
      history.push(path)
      const computedChartNavigatorLinks = computeChartNavigationLinks(
        settings.selectedStudent,
        settings.requestFilters
      )
      updateNavigation(computedChartNavigatorLinks)
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks(
      settings.selectedStudent,
      settings.requestFilters
    )
    updateNavigation(computedChartNavigatorLinks)
  }, [settings])

  const onGoClick = (_settings) => {
    const modifiedFilter = {}
    Object.keys(_settings.filters).forEach((filterType) => {
      if (_settings.filters[filterType] === 'All') {
        modifiedFilter[filterType] = ''
      } else {
        modifiedFilter[filterType] = _settings.filters[filterType]
      }
    })
    setSPRSettings({
      requestFilters: _settings.filters,
      selectedStudent: _settings.selectedStudent,
    })
  }
  const toggleFilter = (e, status = false) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status || !showFilter)
    }
  }

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
              ...transformedSettings.requestFilters,
              studentId: transformedSettings?.selectedStudent?.key,
            }}
            showModal={sharingState}
            setShowModal={setSharingState}
          />
        )}
        <FlexContainer alignItems="flex-start">
          <StudentProfileReportsFilters
            reportId={reportId}
            onGoClick={onGoClick}
            loc={loc}
            history={history}
            location={location}
            match={match}
            style={
              reportId || !showFilter
                ? { display: 'none' }
                : { display: 'block' }
            }
            performanceBandRequired={[
              '/author/reports/student-profile-summary',
              '/author/reports/student-assessment-profile',
            ].find((x) => window.location.pathname.startsWith(x))}
            standardProficiencyRequired={[
              '/author/reports/student-profile-summary',
              '/author/reports/student-mastery-profile',
            ].find((x) => window.location.pathname.startsWith(x))}
          />
          {!reportId ? (
            <FilterButton showFilter={showFilter} onClick={toggleFilter}>
              {showFilter ? <IconCloseFilter /> : <IconFilter />}
            </FilterButton>
          ) : null}
          <ReportContaner showFilter={showFilter}>
            <Route
              exact
              path="/author/reports/student-mastery-profile/student/:studentId?"
              render={(_props) => (
                <StudentMasteryProfile
                  {..._props}
                  settings={transformedSettings}
                  sharedReport={sharedReport}
                  toggleFilter={toggleFilter}
                />
              )}
            />
            <Route
              exact
              path="/author/reports/student-assessment-profile/student/:studentId?"
              render={(_props) => (
                <StudentAssessmentProfile
                  {..._props}
                  settings={transformedSettings}
                  pageTitle={loc}
                  sharedReport={sharedReport}
                  toggleFilter={toggleFilter}
                />
              )}
            />
            <Route
              exact
              path="/author/reports/student-profile-summary/student/:studentId?"
              render={(_props) => (
                <StudentProfileSummary
                  {..._props}
                  settings={transformedSettings}
                  pageTitle={loc}
                  sharedReport={sharedReport}
                  toggleFilter={toggleFilter}
                />
              )}
            />
          </ReportContaner>
        </FlexContainer>
      </>
    </FeaturesSwitch>
  )
}

const enhance = connect(
  (state) => ({
    settings: getReportsSPRSettings(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    setSPRSettings: setSPRSettingsAction,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
  }
)

const enhancedContainer = enhance(StudentProfileReportContainer)

export { enhancedContainer as StudentProfileReportContainer }
