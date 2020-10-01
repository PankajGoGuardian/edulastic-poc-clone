/* eslint-disable array-callback-return */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'
import { FlexContainer } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'
import { getNavigationTabLinks } from '../../common/util'

import navigation from '../../common/static/json/navigation.json'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import StudentMasteryProfile from './StudentMasteryProfile'
import StudentAssessmentProfile from './StudentAssessmentProfile'
import StudentProfileSummary from './StudentProfileSummary'
import StudentProfileReportsFilters from './common/components/filter/StudentProfileReportsFilters'

import { setSPRSettingsAction, getReportsSPRSettings } from './ducks'
import { resetAllReportsAction } from '../../common/reportsRedux'
import { ReportContaner, FilterButton } from '../../common/styled'

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
  } = props

  useEffect(
    () => () => {
      console.log('Student Profile Reports Component Unmount')
      resetAllReports()
    },
    []
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
  const toggleFilter = (e) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter)
    }
  }

  return (
    <FeaturesSwitch
      inputFeatures="singleAssessmentReport"
      actionOnInaccessible="hidden"
    >
      <FlexContainer alignItems="flex-start">
        <StudentProfileReportsFilters
          onGoClick={onGoClick}
          loc={loc}
          history={history}
          location={location}
          match={match}
          style={showFilter ? { display: 'block' } : { display: 'none' }}
          performanceBandRequired={[
            '/author/reports/student-profile-summary',
            '/author/reports/student-assessment-profile',
          ].find((x) => window.location.pathname.startsWith(x))}
          standardProficiencyRequired={[
            '/author/reports/student-profile-summary',
            '/author/reports/student-mastery-profile',
          ].find((x) => window.location.pathname.startsWith(x))}
        />
        <FilterButton showFilter={showFilter} onClick={toggleFilter}>
          <IconFilter />
        </FilterButton>
        <ReportContaner showFilter={showFilter}>
          <Route
            exact
            path="/author/reports/student-mastery-profile/student/:studentId?"
            render={(_props) => (
              <StudentMasteryProfile {..._props} settings={settings} />
            )}
          />
          <Route
            exact
            path="/author/reports/student-assessment-profile/student/:studentId?"
            render={(_props) => (
              <StudentAssessmentProfile
                {..._props}
                settings={settings}
                pageTitle={loc}
              />
            )}
          />
          <Route
            exact
            path="/author/reports/student-profile-summary/student/:studentId?"
            render={(_props) => (
              <StudentProfileSummary
                {..._props}
                settings={settings}
                pageTitle={loc}
              />
            )}
          />
        </ReportContaner>
      </FlexContainer>
    </FeaturesSwitch>
  )
}

const enhance = connect(
  (state) => ({
    settings: getReportsSPRSettings(state),
  }),
  {
    setSPRSettings: setSPRSettingsAction,
    resetAllReports: resetAllReportsAction,
  }
)

const enhancedContainer = enhance(StudentProfileReportContainer)

export { enhancedContainer as StudentProfileReportContainer }
