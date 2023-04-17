import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import {
  EduButton,
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
} from '@edulastic/common'

import { IconQuestionCircle } from '@edulastic/icons'
import { SubHeader } from '../../../common/components/Header'
import { DashedLine, StyledReportContainer } from '../../../common/styled'

import ReportView from './ReportView'
import Filters from './components/Filters'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import {
  buildRequestFilters,
  compareByOptions as compareByOptionsRaw,
} from '../common/utils'
import { selectors, actions } from './ducks'
import useTabNavigation from '../../../common/hooks/useTabNavigation'
import { resetAllReportsAction } from '../../../common/reportsRedux'
import { getSelectedCompareBy } from '../../../common/util'
import { getUserRole } from '../../../../src/selectors/user'
import { ReportDescription } from '../common/components/styledComponents'

const EarlyWarningReport = ({
  loc,
  breadcrumbData,
  isCliUser,
  userRole,
  location,
  isPrinting,
  history,
  showApply,
  setShowApply,
  showFilter,
  onRefineResultsCB,
  setSettings,
  setRiskTimelineFilters,
  settings,
  firstLoad,
  updateNavigation,
  resetAllReports,
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )

  const search = useUrlSearchParams(location)

  // @TODO: check usage of refine results cb
  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const selectedCompareBy = getSelectedCompareBy({
    search,
    settings,
    compareByOptions,
  })

  // @TODO: Update post api integration
  const onGoClick = (_settings) => {
    const _requestFilters = buildRequestFilters(_settings)
    setSettings({
      ...settings,
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
      },
      selectedCompareBy,
      selectedFilterTagsData: _settings.selectedFilterTagsData,
    })
    setShowApply(false)
  }

  useEffect(
    () => () => {
      console.log('Early Warning Report Component Unmount')
      resetAllReports()
    },
    []
  )

  useTabNavigation({
    settings,
    reportId,
    history,
    loc,
    updateNavigation,
    extraFilters: {
      selectedCompareBy:
        search.selectedCompareBy || settings.selectedCompareBy.key,
    },
  })

  const isWithoutFilters = isEmpty(settings.requestFilters)

  return (
    <StyledReportContainer>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      >
        <Filters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onGoClick}
          history={history}
          location={location}
          search={search}
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      <EduIf condition={firstLoad && isWithoutFilters}>
        <EduThen>
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        </EduThen>
        <EduElse>
          <ReportDescription>
            <div>
              Early Warning{' '}
              <EduButton isGhost width="70px" height="30px" ml="20px">
                <IconQuestionCircle />
                Help
              </EduButton>
              <DashedLine margin="0 400px 0 20px" dashWidth="4px" />
            </div>
            <p>
              View students at risk based on their academic and attendance
              performance and plan interventions.
            </p>
          </ReportDescription>
          <ReportView
            loc={loc}
            location={location}
            selectedCompareBy={selectedCompareBy}
            compareByOptions={compareByOptions}
            settings={settings}
            setRiskTimelineFilters={setRiskTimelineFilters}
          />
        </EduElse>
      </EduIf>
    </StyledReportContainer>
  )
}

export default connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    userRole: getUserRole(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
  }
)(EarlyWarningReport)
