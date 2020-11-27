import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, head, toLower } from 'lodash'

import { SpinLoader, notification } from '@edulastic/common'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import TableTooltipRow from '../../../common/components/tooltip/TableTooltipRow'
import AnalyseByFilter from '../common/components/filters/AnalyseByFilter'
import TrendStats from '../common/components/trend/TrendStats'
import TrendTable from '../common/components/trend/TrendTable'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import {
  downloadCSV,
  filterAccordingToRole,
  getFormattedName,
} from '../../../common/util'
import { getCsvDownloadingState } from '../../../ducks'
import { getUserRole } from '../../../../src/selectors/user'
import { getFiltersSelector } from '../common/filterDataDucks'
import {
  getReportsStudentProgress,
  getReportsStudentProgressLoader,
  getStudentProgressRequestAction,
  getReportsStudentProgressError,
} from './ducks'
import { useGetBandData } from './hooks'

import dropDownData from './static/json/dropDownData.json'
import tableColumns from './static/json/tableColumns.json'

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
  studentProgress,
  MARFilterData,
  isCsvDownloading,
  settings,
  loading,
  error,
  role,
  filters,
  pageTitle,
  location,
  ddfilter,
  sharedReport,
}) => {
  const [userRole, isSharedReport] = useMemo(
    () => [sharedReport?.sharedBy?.role || role, !!sharedReport?._id],
    [sharedReport]
  )
  const profiles = MARFilterData?.data?.result?.bandInfo || []

  const bandInfo =
    profiles.find((profile) => profile._id === filters.profileId)
      ?.performanceBand ||
    profiles[0]?.performanceBand ||
    DefaultBandInfo

  useEffect(() => {
    const { requestFilters = {} } = settings
    const { termId, reportId } = requestFilters
    if (termId || reportId) {
      getStudentProgressRequest({ ...requestFilters })
    }
  }, [settings])

  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData))

  const [selectedTrend, setSelectedTrend] = useState('')
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])
  const [metricInfo, setMetricInfo] = useState(
    get(studentProgress, 'data.result.metricInfo', [])
  )

  useEffect(() => {
    setMetricInfo(get(studentProgress, 'data.result.metricInfo', []))
  }, [studentProgress])

  useEffect(() => {
    const filteredInfo = get(
      studentProgress,
      'data.result.metricInfo',
      []
    ).filter((info) => {
      if (ddfilter.gender !== 'all' && ddfilter.gender !== info.gender) {
        return false
      }
      if (
        ddfilter.frlStatus !== 'all' &&
        toLower(ddfilter.frlStatus) !== toLower(info.frlStatus)
      ) {
        return false
      }
      if (
        ddfilter.ellStatus !== 'all' &&
        toLower(ddfilter.ellStatus) !== toLower(info.ellStatus)
      ) {
        return false
      }
      if (
        ddfilter.iepStatus !== 'all' &&
        toLower(ddfilter.iepStatus) !== toLower(info.iepStatus)
      ) {
        return false
      }
      if (ddfilter.race !== 'all' && ddfilter.race !== info.race) {
        return false
      }
      return true
    })
    setMetricInfo(filteredInfo)
  }, [ddfilter])

  const { orgData = [], testData = [] } = get(MARFilterData, 'data.result', {})
  const [data, trendCount] = useGetBandData(
    metricInfo,
    compareBy.key,
    orgData,
    selectedTrend,
    bandInfo
  )

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }
  const customTableColumns = filterAccordingToRole(tableColumns, userRole)

  const onTrendSelect = (trend) =>
    setSelectedTrend(trend === selectedTrend ? '' : trend)
  const onCsvConvert = (_data) => downloadCSV(`Student Progress.csv`, _data)

  const dataSource = data
    .map((d) => ({ ...d, studentName: getFormattedName(d.studentName) }))
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
        heading="How well are students progressing ?"
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
        filters={filters}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        data={dataSource}
        rowSelection={rowSelection}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        ddfilter={ddfilter}
        rawMetric={metricInfo}
        customColumns={customTableColumns}
        isCellClickable
        location={location}
        pageTitle={pageTitle}
        isSharedReport={isSharedReport}
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
                  value={record.schoolName}
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
    filters: getFiltersSelector(state),
    role: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getStudentProgressRequest: getStudentProgressRequestAction,
  }
)

export default enhance(StudentProgress)
