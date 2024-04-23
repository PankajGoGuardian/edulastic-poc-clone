import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { omit } from 'lodash'
import { getOrgDataSelector } from '../../../../src/selectors/user'
import { SubHeader } from '../../../common/components/Header'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import {
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import useTabNavigation from '../../../common/hooks/useTabNavigation'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { buildRequestFilters } from '../common/utils'
import { selectors, actions } from './ducks'
import Filters from './components/Filters'
import { resetAllReportsAction } from '../../../common/reportsRedux'
import Container from './Container'
import { attendanceBandInfo } from './ducks/selectors'

const AttendanceReport = ({
  loc,
  breadcrumbData,
  isCliUser,
  onRefineResultsCB,
  showFilter,
  location,
  history,
  isPrinting,
  settings,
  setSettings,
  showApply,
  setShowApply,
  resetAllReports,
  updateNavigation,
  sharedReportList,
  _filters,
  attendanceBands,
}) => {
  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const search = useUrlSearchParams(location)
  const reportId = search.reportId
  const [profileId, setProfileId] = useState(search.profileId || null)
  const onApplyFilter = (_settings) => {
    const _requestFilters = buildRequestFilters(_settings)
    setSettings({
      ...settings,
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
      },
      selectedFilterTagsData: _settings.selectedFilterTagsData,
    })
    setShowApply(false)
  }

  const showAbsents = useMemo(
    () => attendanceBands.find((band) => band._id === profileId)?.analyze_by,
    [profileId, attendanceBands]
  )

  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )
  useEffect(
    () => () => {
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

  const onSetProfileId = (_profileId) => {
    let searchString = `${qs.stringify(
      omit(_filters, ['profileId', 'groupBy'])
    )}&profileId=${_profileId}`
    const _search = qs.parse(location.search)
    if (_search.groupBy) {
      searchString = `${searchString}&groupBy=${_search.groupBy}`
    }
    history.push(`${location.pathname}?${searchString}`)
    setProfileId(_profileId)
  }

  return (
    <>
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        <Filters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onApplyFilter}
          history={history}
          location={location}
          search={search}
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          setProfileId={onSetProfileId}
          profileId={profileId}
        />
      </SubHeader>
      <Container
        toggleFilter={toggleFilter}
        profileId={profileId}
        sharedReport={sharedReport}
        history={history}
        location={location}
        filters={_filters}
        showAbsents={showAbsents}
      />
    </>
  )
}

const { setSettings } = actions
const { settings, firstLoad, filters } = selectors
const enhance = connect(
  (state) => ({
    isBeingShared: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    orgData: getOrgDataSelector(state),
    settings: settings(state),
    firstLoad: firstLoad(state),
    _filters: filters(state),
    attendanceBands: attendanceBandInfo(state),
  }),
  {
    resetAllReports: resetAllReportsAction,
    setIsBeingShared: setSharingStateAction,
    setSettings,
  }
)

export default enhance(AttendanceReport)
