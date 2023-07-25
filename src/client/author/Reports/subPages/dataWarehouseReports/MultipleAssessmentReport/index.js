import React, { useEffect, useMemo, useState } from 'react'
import qs from 'qs'
import { connect } from 'react-redux'
import { isEmpty, get, mapValues, includes, filter, pick } from 'lodash'
import { Checkbox, Spin } from 'antd'
import { IconInfo } from '@edulastic/icons'
import { blueButton } from '@edulastic/colors'

import {
  EduIf,
  FlexContainer,
  SpinLoader,
  notification,
} from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import {
  helpLinks,
  reportGroupType,
  reportNavType,
} from '@edulastic/constants/const/report'
import {
  TABLE_SORT_ORDER_TYPES,
  tableToDBSortOrderMap,
} from '@edulastic/constants/reportUtils/common'

import { SubHeader } from '../../../common/components/Header'
import {
  NoDataContainer,
  ReportContainer,
  StyledH3,
} from '../../../common/styled'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import SectionLabel from '../../../common/components/SectionLabel'
import SectionDescription from '../../../common/components/SectionDescription'
import MultipleAssessmentReportFilters from './components/Filters'
import Chart from './components/Chart'
import Table from './components/Table'
import TableFilters from './components/TableFilters'

import { resetAllReportsAction } from '../../../common/reportsRedux'
import {
  fetchInterventionsByGroupsRequest,
  fetchInterventionsByGroupsSuccess,
  fetchUpdateTagsDataAction,
  getCsvDownloadingState,
  getInterventionsByGroup,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import {
  getFeedTypes,
  getFeedTypesAction,
} from '../../../../sharedDucks/dataWarehouse'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import {
  getUserRole,
  getOrgDataSelector,
  getCurrentTerm,
} from '../../../../src/selectors/user'
import { actions, selectors } from './ducks'

import {
  getCompareByOptions,
  getChartData,
  getTableData,
  sortKeys,
  TABLE_PAGE_SIZE,
  staticDropDownData,
} from './utils'

import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { getSelectedCompareBy } from '../../../common/util'
import useTabNavigation from '../../../common/hooks/useTabNavigation'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import { isAddToStudentGroupEnabled } from '../common/utils'
import { ACADEMIC } from '../GoalsAndInterventions/constants/form'

const { downloadCSV } = reportUtils.common

const onCsvConvert = (data) =>
  downloadCSV(`Data Studio - Performance Trends.csv`, data)

const MultipleAssessmentReport = ({
  // value props
  loc,
  location,
  history,
  sharingState,
  sharedReportList,
  isCsvDownloading,
  userRole: _userRole,
  orgData,
  defaultTermId,
  showApply,
  breadcrumbData,
  isCliUser,
  isPrinting,
  updateNavigation,
  // value props (from report selectors)
  firstLoad,
  showFilter,
  loadingFiltersData,
  prevFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  selectedFilterTagsData,
  // selectedPerformanceBandProfileId,
  // selectedPerformanceBand,
  loadingReportChartData,
  loadingReportTableData,
  settings,
  reportChartData,
  reportTableData,
  error,
  // action props
  onRefineResultsCB,
  resetAllReports,
  setSharingState,
  // action props (from report actions)
  setDWMARFirstLoad,
  fetchDWMARFiltersDataRequest,
  setDWMARFiltersTabKey,
  setDWMARFilters,
  setDWMARFilterTagsData,
  setDWMARPrevFiltersData,
  resetDWMARFiltersData,
  setDWMARSettings,
  fetchDWMARChartDataRequest,
  fetchDWMARTableDataRequest,
  fetchUpdateTagsData,
  selectedTests,
  setSelectedTests,
  fetchInterventionsByGroups,
  setInterventionsByGroup,
  interventionsData,
  feedTypes,
  fetchFeedTypes,
}) => {
  const [sortFilters, setSortFilters] = useState({
    sortKey: sortKeys.COMPARE_BY,
    sortOrder: TABLE_SORT_ORDER_TYPES.ASCEND,
  })
  const [pageFilters, setPageFilters] = useState({
    page: 0,
    pageSize: TABLE_PAGE_SIZE,
  })
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )
  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )
  const [userRole, sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?.sharedBy?.role || _userRole,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )
  const compareByOptions = useMemo(() => [...getCompareByOptions(userRole)], [
    userRole,
  ])

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }
  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const search = useUrlSearchParams(location)
  const selectedCompareBy = getSelectedCompareBy({
    search,
    settings,
    compareByOptions,
  })

  const onGoClick = (_settings) => {
    const _requestFilters = {}
    Object.keys(_settings.requestFilters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.requestFilters[filterType] === 'All' ||
        _settings.requestFilters[filterType] === 'all'
          ? ''
          : _settings.requestFilters[filterType]
    })
    const requestFilterKeys = Object.keys(staticDropDownData.requestFilters)
    setDWMARSettings({
      requestFilters: {
        ...pick(_requestFilters, requestFilterKeys),
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
        testIds: _requestFilters.testIds || '',
      },
      frontEndFilters: { externalScoreType: _requestFilters.externalScoreType },
      selectedFilterTagsData: _settings.selectedFilterTagsData,
      selectedCompareBy,
    })
    setShowApply(false)
  }

  const updateFilterDropdownCB = (selected) => {
    setDWMARSettings({ ...settings, selectedCompareBy: selected })
  }

  useEffect(() => {
    if (feedTypes === null) {
      fetchFeedTypes()
    }
  }, [feedTypes])

  useEffect(
    () => () => {
      console.log('Multiple Assessment Report Component Unmount')
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
      selectedCompareBy: settings.selectedCompareBy.key,
    },
  })

  // get report data
  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      fetchDWMARChartDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings.requestFilters, settings.selectedCompareBy.key, sortFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: settings.selectedCompareBy.key,
      sortKey: sortFilters.sortKey,
      sortOrder: tableToDBSortOrderMap[sortFilters.sortOrder],
      ...pageFilters,
      requireTotalCount: pageFilters.page === 1,
    }
    if ((q.termId || q.reportId) && pageFilters.page) {
      fetchDWMARTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [pageFilters])

  useEffect(() => {
    const { internalMetricsForChart, externalMetricsForChart } = get(
      reportChartData,
      'data.result',
      {}
    )
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loadingReportChartData &&
      !loadingReportTableData &&
      !isEmpty(reportChartData) &&
      !isEmpty(reportTableData) &&
      isEmpty(internalMetricsForChart) &&
      isEmpty(externalMetricsForChart)
    ) {
      toggleFilter(null, true)
    }
  }, [reportChartData, reportTableData])

  const {
    incompleteTests,
    selectedPerformanceBand,
    chartData,
  } = useMemo(() => {
    // performance band for chart should update post chart data API response
    const { bandInfo = [] } = get(filtersData, 'data.result', {})
    const _selectedPerformanceBand = (
      bandInfo.find(
        (x) =>
          x._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || bandInfo[0]
    )?.performanceBand
    // curate chart data from API response
    const {
      internalMetricsForChart = [],
      externalMetricsForChart = [],
      incompleteTests: _incompleteTests = [],
      externalBands = [],
    } = get(reportChartData, 'data.result', {})
    const _internalMetricsForChart = internalMetricsForChart.map((d) => ({
      ...d,
      isIncomplete: _incompleteTests.includes(d.testId),
    }))
    const _chartData = getChartData(
      _internalMetricsForChart,
      externalMetricsForChart,
      _selectedPerformanceBand,
      externalBands,
      settings.frontEndFilters
    )
    return {
      incompleteTests: _incompleteTests,
      selectedPerformanceBand: _selectedPerformanceBand,
      chartData: _chartData,
    }
  }, [reportChartData])

  const { rowsCount = 0 } = get(reportTableData, 'data.result', {})

  const tableData = useMemo(() => {
    const { metricInfo = [] } = get(reportTableData, 'data.result', {})
    const { externalBands = [] } = get(reportChartData, 'data.result', {})
    const feedTypeKeys = feedTypes.map(({ key }) => key)
    let externalMetricsForTable = metricInfo
      .filter(({ testType }) => feedTypeKeys.includes(testType))
      .map(({ testType: externalTestType, ...t }) => ({
        ...t,
        externalTestType,
      }))
    const internalMetricsForTable = metricInfo
      .filter(({ testType }) => !feedTypeKeys.includes(testType))
      .map((t) => ({
        ...t,
        isIncomplete: incompleteTests.includes(t.testId),
      }))
    if (isEmpty(externalBands) && !isEmpty(externalMetricsForTable)) {
      externalMetricsForTable = []
    }
    return getTableData(
      internalMetricsForTable,
      externalMetricsForTable,
      selectedPerformanceBand,
      externalBands,
      settings.selectedCompareBy.key,
      sortFilters,
      settings.frontEndFilters
    )
  }, [
    reportChartData,
    reportTableData,
    incompleteTests,
    selectedPerformanceBand,
    feedTypes,
  ])

  const filteredOverallAssessmentsData = filter(chartData, (test) =>
    selectedTests.length ? includes(selectedTests, test.uniqId) : true
  )

  // handle add student to group
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ id }) => {
      return setCheckedStudents(
        checkedStudents.includes(id)
          ? checkedStudents.filter((i) => i !== id)
          : [...checkedStudents, id]
      )
    },
    onSelectAll: (flag) =>
      setCheckedStudents(flag ? tableData.map(({ id }) => id) : []),
  }

  const checkedStudentsForModal = tableData
    .filter(({ id }) => checkedStudents.includes(id))
    .map(({ id, studentName }) => {
      const name = studentName.split(',')
      return {
        _id: id,
        firstName: name[0],
        lastName: name?.[1],
      }
    })

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    selectedCompareBy?.key
  )

  const _rowSelection = showAddToStudentGroupBtn ? rowSelection : null

  const [showInterventions, setShowInterventions] = useState(false)

  const onShowInterventionClick = () => {
    setShowInterventions((val) => !val)
  }

  useEffect(() => {
    const startDate = Math.min(...chartData.map((ele) => ele.assessmentDate))
    const endDate = Math.max(...chartData.map((ele) => ele.assessmentDate))
    let groupIds = ''
    const termId = settings.requestFilters?.termId
    if (settings.requestFilters.groupIds.length)
      groupIds += settings.requestFilters.groupIds
    if (settings.requestFilters.classIds.length)
      groupIds =
        (groupIds.length ? `${groupIds},` : groupIds) +
        settings.requestFilters.classIds
    if (
      groupIds.length &&
      termId &&
      Number.isInteger(startDate) &&
      Number.isInteger(endDate)
    ) {
      const groupIdsArr =
        typeof groupIds === 'string' ? groupIds.split(',') : undefined
      fetchInterventionsByGroups({
        type: [ACADEMIC],
        groupIds: groupIdsArr,
        startDate,
        endDate,
        termId,
      })
    } else {
      setInterventionsByGroup([])
    }
  }, [chartData])

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...settings.requestFilters,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
        />
      )}
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        <MultipleAssessmentReportFilters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onGoClick}
          history={history}
          location={location}
          showApply={showApply}
          firstLoad={firstLoad}
          userRole={userRole}
          orgData={orgData}
          defaultTermId={defaultTermId}
          // value props (from report selectors)
          loadingFiltersData={loadingFiltersData}
          prevFiltersData={prevFiltersData}
          filtersData={filtersData}
          filtersTabKey={filtersTabKey}
          filters={filters}
          filterTagsData={filterTagsData}
          selectedFilterTagsData={selectedFilterTagsData}
          // action props (others)
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          // action props (from report actions)
          setFirstLoad={setDWMARFirstLoad}
          fetchFiltersDataRequest={fetchDWMARFiltersDataRequest}
          setFiltersTabKey={setDWMARFiltersTabKey}
          setFilters={setDWMARFilters}
          setFilterTagsData={setDWMARFilterTagsData}
          setPrevFiltersData={setDWMARPrevFiltersData}
          resetFiltersData={resetDWMARFiltersData}
          fetchUpdateTagsData={fetchUpdateTagsData}
        />
      </SubHeader>
      <ReportContainer>
        {firstLoad && <Spin size="large" />}
        {loadingReportChartData || loadingReportTableData ? (
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        ) : error && error.dataSizeExceeded ? (
          <DataSizeExceeded />
        ) : isEmpty(chartData) ? (
          <NoDataContainer>
            {settings.requestFilters?.termId
              ? 'No data available currently.'
              : ''}
          </NoDataContainer>
        ) : (
          <>
            <SectionLabel
              $margin="30px 0px 10px 0px"
              style={{ fontSize: '20px' }}
              showHelp
              url={helpLinks[reportNavType.MULTIPLE_ASSESSMENT_REPORT_DW]}
            >
              Performance Trends
            </SectionLabel>
            <SectionDescription>
              View whether the student&apos;s performance is improving over time
              and take necessary interventions.
            </SectionDescription>
            <FlexContainer justifyContent="flex-start" alignItems="center">
              <StyledH3 margin="30px 0 0 0">
                Performance across Assessments
              </StyledH3>
              <EduIf condition={interventionsData.length}>
                <Checkbox
                  style={{ margin: '30px 0 0 16px' }}
                  onChange={onShowInterventionClick}
                  checked={showInterventions}
                >
                  Show Interventions{' '}
                </Checkbox>
                <IconInfo
                  style={{ marginTop: '30px' }}
                  fill={blueButton}
                  width={16}
                  height={16}
                />
              </EduIf>
            </FlexContainer>
            <Chart
              chartData={chartData}
              selectedPerformanceBand={selectedPerformanceBand}
              selectedTests={selectedTests}
              setSelectedTests={setSelectedTests}
              showInterventions={showInterventions}
              interventionsData={interventionsData}
            />
            <FeaturesSwitch
              inputFeatures="studentGroups"
              actionOnInaccessible="hidden"
            >
              <AddToGroupModal
                groupType="custom"
                visible={showAddToGroupModal}
                onCancel={() => setShowAddToGroupModal(false)}
                checkedStudents={checkedStudentsForModal}
              />
            </FeaturesSwitch>
            <TableFilters
              updateFilterDropdownCB={updateFilterDropdownCB}
              compareByOptions={compareByOptions}
              selectedCompareBy={selectedCompareBy}
              handleAddToGroupClick={handleAddToGroupClick}
              showAddToStudentGroupBtn={showAddToStudentGroupBtn}
            />
            <Table
              tableData={tableData}
              overallAssessmentsData={filteredOverallAssessmentsData}
              showIncompleteTestsMessage={!!incompleteTests.length}
              settings={settings}
              isSharedReport={isSharedReport}
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
              isPrinting={isPrinting}
              rowsCount={rowsCount}
              sortFilters={sortFilters}
              setSortFilters={setSortFilters}
              pageFilters={pageFilters}
              setPageFilters={setPageFilters}
              rowSelection={_rowSelection}
            />
          </>
        )}
      </ReportContainer>
    </>
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
    interventionsData: getInterventionsByGroup(state),
    feedTypes: getFeedTypes(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    fetchInterventionsByGroups: fetchInterventionsByGroupsRequest,
    setInterventionsByGroup: fetchInterventionsByGroupsSuccess,
    fetchFeedTypes: getFeedTypesAction,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.MULTIPLE_ASSESSMENT_REPORT_DW,
        ...opts,
      }),
  }
)

export default enhance(MultipleAssessmentReport)
