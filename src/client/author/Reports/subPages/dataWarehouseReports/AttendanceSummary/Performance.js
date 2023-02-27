import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'
import { every, isEmpty } from 'lodash'

import next from 'immer'
import { notification } from '@edulastic/common'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import CsvTable from '../../../common/components/tables/CsvTable'
// import TableFilters from '../../../common/components/'

import { StyledCard, DashedLine } from '../../../common/styled'
import {
  StyledRow,
  StyledTable,
} from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'
// import { StyledTable, StyledRow } from '../../common/styledComponents'
// import { getTableColumns, onCsvConvert } from './utils'
import IncompleteTestsMessage from '../../../common/components/IncompleteTestsMessage'
// import { addStudentToGroupFeatureEnabled } from '../../utils'
// import TableFilters from '../../../../src/components/common/TableFilters'
// import { StyledTableButton } from '../../../../../common/styled'
import { compareByKeys } from '../../multipleAssessmentReport/PreVsPost/utils'
import TableFilters from './TableFilter'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import HorizontalStackedBarChart from './HorizontalStackedChart'
// import { compareByStudentsColumns } from '@edulastic/constants/reportUtils/singleAssessmentReport/performanceByStandards'
// import { addStudentToGroupFeatureEnabled } from '../../multipleAssessmentReport/PreVsPost/utils'
const genericColumnsForTable = [
  {
    title: 'compareBy',
    key: 'compareBy',
    dataIndex: 'compareByColumnTitle',
    width: 150,
    align: 'left',
  },
  {
    title: 'AVG ATTENDANCE',
    key: 'avgAttendance',
    width: 188,
    align: 'center',
    dataIndex: 'studentsCount',
  },
  {
    title: 'TARDIES',
    width: 200,
    key: 'tardies',
    align: 'center',
    dataIndex: 'testName',
    visibleOn: ['browser'],
  },
  {
    title: 'EDULASTIC',
    key: 'edulastic',
    dataIndex: 'avgScore',
    width: 188,
    align: 'center',
    visibleOn: ['browser'],
  },
  {
    title: 'IREADY',
    key: 'iready',
    dataIndex: 'preAvgScorePercentage',
    align: 'center',
    visibleOn: ['csv'],
  },
  {
    title: 'CAASPP',
    key: 'caasp',
    dataIndex: 'postAvgScorePercentage',
    align: 'center',
    visibleOn: ['csv'],
  },
  {
    title: 'ATTENDANCE DISTRIBUTION',
    width: 188,
    key: 'attendanceDistribution',
    align: 'center',
    dataIndex: '',
    visibleOn: ['browser'],
  },
]

const compareByStudentColumns = [
  {
    title: 'compareBy',
    key: 'compareBy',
    dataIndex: 'compareByColumnTitle',
    align: 'left',
    width: 100,
  },
  {
    title: 'School',
    key: 'school',
    width: 150,
    align: 'center',
    dataIndex: 'schoolName',
  },
  {
    title: 'Teacher',
    key: 'teacher',
    width: 90,
    align: 'center',
    dataIndex: 'teacherName',
  },
  {
    title: 'Class',
    key: 'class',
    width: 90,
    dataIndex: 'className',
  },
  {
    title: 'Test',
    width: 90,
    key: 'test',
    align: 'center',
    dataIndex: 'testName',
    visibleOn: ['browser'],
  },
  {
    title: 'Avg. Performance',
    key: 'avgPerformance',
    dataIndex: 'avgScore',
    width: 120,
    align: 'center',
    visibleOn: ['browser'],
  },
  {
    title: 'Change',
    key: 'change',
    width: 70,
    align: 'center',
    dataIndex: '',
  },
]

export const onCsvConvert = (data) =>
  downloadCSV(`Pre Vs Post Test Comparison.csv`, data)

export const getTableColumns = (
  selectedCompareBy,
  // analyseBy,
  selectedPerformanceBand
  // dataSource
) => {
  const compareBy = selectedCompareBy.key
  const tableColumnsData =
    compareBy === compareByKeys.STUDENT
      ? compareByStudentColumns
      : genericColumnsForTable

  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByColumnIdx = _columns.findIndex(
      (col) => col.key === 'compareBy'
    )
    _columns[compareByColumnIdx].title = selectedCompareBy.title
    _columns[compareByColumnIdx].render = (_, record) => {
      const value = record.compareByColumnTitle
      if (isEmpty(value)) return '-'
      return value
    }

    // Test names column
    // const testColumnIdx = _columns.findIndex((col) => col.key === 'test')
    // _columns[testColumnIdx].render = (_, record) => (
    //   <TestNamesCell record={record} />
    // )

    // Avg Peformance column
    // const avgPerformanceColumnIdx = _columns.findIndex(
    //   (col) => col.key === 'avgPerformance'
    // )
    // _columns[avgPerformanceColumnIdx].render = (_, record) => (
    //   <AvgPerformance record={record} analyseBy={analyseBy} />
    // )

    // Performance change column
    // const changeColumnIdx = _columns.findIndex((col) => col.key === 'change')
    // _columns[changeColumnIdx].render = (_, record) => (
    //   <PerformanceChange record={record} />
    // )

    // Performance band column
    if (compareBy !== compareByKeys.STUDENT) {
      const attendanceDistributionColumn = _columns.findIndex(
        (col) => col.key === 'attendanceDistribution'
      )
      _columns[attendanceDistributionColumn].render = (_, record) => {
        const { preBandProfile, postBandProfile, studentsCount } = record
        return (
          <div>
            <HorizontalStackedBarChart
              data={[preBandProfile]}
              studentsCount={studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
            />
            <HorizontalStackedBarChart
              data={[postBandProfile]}
              studentsCount={studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
            />
          </div>
        )
      }
    }
  })

  // additional columns required only for download csv
  // const performanceBandColumns = flatMap(dataSource, (d) => {
  //   const { preBandProfile, postBandProfile } = d
  //   const preBandColumns = map(Object.keys(preBandProfile), (key) => ({
  //     title: key,
  //     dataIndex: '',
  //     align: 'center',
  //     visibleOn: ['csv'],
  //     render: (_, record) => record.preBandProfile[key],
  //   }))
  //   const postBandColumns = map(Object.keys(postBandProfile), (key) => ({
  //     title: key,
  //     dataIndex: '',
  //     align: 'center',
  //     visibleOn: ['csv'],
  //     render: (_, record) => record.postBandProfile[key],
  //   }))

  //   return [...preBandColumns, ...postBandColumns]
  // })
  // if (compareBy === compareByKeys.STUDENT)
  //   tableColumns.push(...performanceBandColumns)

  return tableColumns
}

export const addStudentToGroupFeatureEnabled = (
  compareByKey,
  isSharedReport
) => {
  return every([compareByKey === compareByKeys.STUDENT, !isSharedReport])
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
  {
    key: compareByKeys.STUDENT,
    title: 'Student',
    hiddenFromRole: ['district-admin', 'school-admin'],
  },
  { key: compareByKeys.RACE, title: 'Race' },
  { key: compareByKeys.GENDER, title: 'Gender' },
  { key: compareByKeys.FRL_STATUS, title: 'FRL Status' },
  { key: compareByKeys.ELL_STATUS, title: 'ELL Status' },
  { key: compareByKeys.IEP_STATUS, title: 'IEP Status' },
  { key: compareByKeys.HISPANIC_ETHNICITY, title: 'Hispanic Ethnicity' },
]

export const analyseByOptions = [
  { key: 'score', title: 'Score %' },
  { key: 'rawScore', title: 'Raw Score' },
]

const PerformanceTable = ({
  dataSource,
  rowSelection,
  selectedTableFilters,
  setTableFilters,
  selectedPerformanceBand,
  isCsvDownloading = false,
  isSharedReport = false,
  // hasIncompleteTests,
}) => {
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [checkedStudentsForModal] = useState([])
  // get table columns
  const tableColumns = getTableColumns(
    selectedTableFilters.compareBy,
    // selectedTableFilters.analyseBy.key,
    selectedPerformanceBand,
    dataSource
  )

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length < 1) {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    } else {
      setShowAddToGroupModal(true)
    }
  }

  const _rowSelection = addStudentToGroupFeatureEnabled(
    selectedTableFilters.compareBy.key,
    isSharedReport
  )
    ? rowSelection
    : null
  return (
    <StyledCard>
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
      <StyledRow type="flex" justify="space-between" margin="20px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Change By {selectedTableFilters.compareBy.title}
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={compareByOptions}
          analyseByOptions={analyseByOptions}
          handleAddToGroupClick={handleAddToGroupClick}
          selectedTableFilters={selectedTableFilters}
          isSharedReport={isSharedReport}
        />
      </StyledRow>
      <CsvTable
        dataSource={dataSource}
        columns={tableColumns}
        rowSelection={_rowSelection}
        tableToRender={StyledTable}
        pagination={{ hideOnSinglePage: true, pageSize: 25 }}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        scroll={{ x: '100%' }}
      />
      <StyledRow type="flex" align="middle">
        <IncompleteTestsMessage hasIncompleteTests={0} />
      </StyledRow>
    </StyledCard>
  )
}

PerformanceTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PerformanceTable
