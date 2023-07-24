import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'

import { helpLinks, reportNavType } from '@edulastic/constants/const/report'
import { SubHeader } from '../../../common/components/Header'
import { StyledReportContainer } from '../../../common/styled'

import ReportView from './ReportView'
import Filters from './components/Filters'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import {
  buildRequestFilters,
  compareByOptions as compareByOptionsRaw,
} from '../common/utils'
import { selectors, actions } from './ducks'
import { getFeedTypes } from '../../../../sharedDucks/dataWarehouse'
import { resetAllReportsAction } from '../../../common/reportsRedux'
import { getSelectedCompareBy } from '../../../common/util'
import { getUserRole } from '../../../../src/selectors/user'
import SectionLabel from '../../../common/components/SectionLabel'
import SectionDescription from '../../../common/components/SectionDescription'

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
  settings,
  firstLoad,
  resetAllReports,
  feedTypes,
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
          <SectionLabel
            style={{ fontSize: '20px' }}
            $margin="30px 0px 10px 0px"
            showHelp
            url={helpLinks[reportNavType.DW_EARLY_WARNING_REPORT]}
          >
            Early Warning
          </SectionLabel>
          <SectionDescription $margin="0px 0px 30px 0px">
            View students at risk based on their academic and attendance
            performance and plan interventions.
          </SectionDescription>
          <ReportView
            loc={loc}
            location={location}
            selectedCompareBy={selectedCompareBy}
            compareByOptions={compareByOptions}
            settings={settings}
            history={history}
            search={search}
            feedTypes={feedTypes}
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
    feedTypes: getFeedTypes(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
  }
)(EarlyWarningReport)
