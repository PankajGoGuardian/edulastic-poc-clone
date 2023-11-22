import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, head, isEmpty } from 'lodash'

import { SpinLoader, notification } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import TableTooltipRow from '../../../common/components/tooltip/TableTooltipRow'
import AnalyseByFilter from '../common/components/filters/AnalyseByFilter'
import TrendStats from '../common/components/trend/TrendStats'
import TrendTable from '../common/components/trend/TrendTable'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { NoDataContainer } from '../../../common/styled'
import { getCsvDownloadingState } from '../../../ducks'
import { getUserRole } from '../../../../src/selectors/user'
import {
  getReportsStudentProgress,
  getReportsStudentProgressLoader,
  getStudentProgressRequestAction,
  getReportsStudentProgressError,
  resetStudentProgressAction,
} from './ducks'
import { useGetBandData } from './hooks'

import dropDownData from './static/json/dropDownData.json'
import tableColumns from './static/json/tableColumns.json'

const { downloadCSV, filterAccordingToRole, formatName } = reportUtils.common

const DefaultBandInfo = [
  {
    threshold: 70,
    aboveStandard: 1,
    name: 'Proficient',
  },
  {
    threshold: 50,
    aboveStandard: 1,
    name: 'Basic',
  },
  {
    threshold: 0,
    aboveStandard: 0,
    name: 'Below Basic',
  },
]

const compareBy = {
  key: 'student',
  title: 'Student',
}

const StudentProgress = ({
  getStudentProgressRequest,
  resetStudentProgress,
  studentProgress,
  MARFilterData,
  isCsvDownloading,
  settings,
  loading,
  error,
  role,
  pageTitle,
  location,
  ddfilter,
  sharedReport,
  toggleFilter,
}) => {
  const [userRole, sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?.sharedBy?.role || role,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )
  const profiles = get(MARFilterData, 'data.result.bandInfo', [])

  const bandInfo =
    profiles.find(
      (profile) =>
        profile._id ===
        (sharedReportFilters || settings.requestFilters).profileId
    )?.performanceBand ||
    profiles[0]?.performanceBand ||
    DefaultBandInfo

  // support for tests pagination from backend
  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 25,
  })

  useEffect(() => () => resetStudentProgress(), [])

  // set initial page filters
  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  // get paginated data
  useEffect(() => {
    const q = { ...settings.requestFilters, ...pageFilters, ...ddfilter }
    if ((q.termId || q.reportId) && pageFilters.page) {
      getStudentProgressRequest(q)
    }
  }, [pageFilters])

  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData))
  const [selectedTrend, setSelectedTrend] = useState('')
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])
  const [metricInfo, setMetricInfo] = useState(
    get(studentProgress, 'data.result.metricInfo', [])
  )

  useEffect(() => {
    const metrics = get(studentProgress, 'data.result.metricInfo', [])
    setMetricInfo(metrics)
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(studentProgress) &&
      !metrics.length
    ) {
      toggleFilter(null, true)
    }
  }, [studentProgress])

  const { metaInfo = [], testsCount = 0, incompleteTests = [] } = get(
    studentProgress,
    'data.result',
    {}
  )

  const filteredInfoWithIncompleteTestData = metricInfo.map((metric) => {
    metric.isIncomplete = incompleteTests.includes(metric.testId)
    return metric
  })

  const [data, trendCount] = useGetBandData(
    filteredInfoWithIncompleteTestData,
    compareBy.key,
    metaInfo,
    selectedTrend,
    bandInfo
  )

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (isEmpty(metricInfo)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }
  const customTableColumns = filterAccordingToRole(tableColumns, userRole)

  const onTrendSelect = (trend) =>
    setSelectedTrend(trend === selectedTrend ? '' : trend)
  const onCsvConvert = (_data) => downloadCSV(`Student Progress.csv`, _data)

  const dataSource = data
    .map((d) => ({
      ...d,
      studentName: formatName(d),
      schoolName: isEmpty(d.schoolName) ? '-' : d.schoolName,
    }))
    .sort((a, b) =>
      a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
    )

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ id }) =>
      setCheckedStudents(
        checkedStudents.includes(id)
          ? checkedStudents.filter((i) => i !== id)
          : [...checkedStudents, id]
      ),
    onSelectAll: (flag) =>
      setCheckedStudents(flag ? dataSource.map((d) => d.id) : []),
  }

  const checkedStudentsForModal = dataSource
    .filter((d) => checkedStudents.includes(d.id))
    .map(({ id, firstName, lastName, username }) => ({
      _id: id,
      firstName,
      lastName,
      username,
    }))

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length < 1) {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    } else {
      setShowAddToGroupModal(true)
    }
  }

  return (
    <>
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
      <TrendStats
        heading="Student progress over time"
        trendCount={trendCount}
        selectedTrend={selectedTrend}
        onTrendSelect={onTrendSelect}
        handleAddToGroupClick={handleAddToGroupClick}
        isSharedReport={isSharedReport}
        renderFilters={() => (
          <AnalyseByFilter
            onFilterChange={setAnalyseBy}
            analyseBy={analyseBy}
          />
        )}
      />
      <TrendTable
        showTestIncompleteText={!!incompleteTests?.length}
        filters={sharedReportFilters || settings.requestFilters}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        data={dataSource}
        rowSelection={rowSelection}
        compareBy={compareBy}
        analyseBy={analyseBy}
        ddfilter={ddfilter}
        rawMetric={filteredInfoWithIncompleteTestData}
        customColumns={customTableColumns}
        isCellClickable
        location={location}
        pageTitle={pageTitle}
        isSharedReport={isSharedReport}
        backendPagination={{
          ...pageFilters,
          itemsCount: testsCount,
        }}
        setBackendPagination={setPageFilters}
        toolTipContent={(record) => (
          <>
            <TableTooltipRow
              title={`Student Name : `}
              value={record.studentName}
            />
            {userRole === 'teacher' ? (
              <TableTooltipRow
                title={`Class Name : `}
                value={record.groupName}
              />
            ) : (
              <>
                <TableTooltipRow
                  title={`School Name : `}
                  value={record.schoolName || `-`}
                />
                <TableTooltipRow
                  title={`Teacher Name : `}
                  value={record.teacherName}
                />
              </>
            )}
          </>
        )}
      />
    </>
  )
}

const enhance = connect(
  (state) => ({
    studentProgress: getReportsStudentProgress(state),
    loading: getReportsStudentProgressLoader(state),
    error: getReportsStudentProgressError(state),
    role: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getStudentProgressRequest: getStudentProgressRequestAction,
    resetStudentProgress: resetStudentProgressAction,
  }
)

export default enhance(StudentProgress)
