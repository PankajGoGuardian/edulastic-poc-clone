import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'

import next from 'immer'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import CsvTable from '../../../common/components/tables/CsvTable'

import { StyledCard, DashedLine } from '../../../common/styled'
import {
  StyledRow,
  // StyledTable,
} from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { compareByKeys } from '../../multipleAssessmentReport/PreVsPost/utils'
import TableFilters from './TableFilter'
import HorizontalStackedBarChart from './HorizontalStackedChart'
import { StyledTable } from '../../singleAssessmentReport/QuestionAnalysis/componenets/styled'

const columns = [
  {
    title: 'compare By',
    key: 'compareBy',
    dataIndex: 'dimension.name',
    align: 'left',
  },
  {
    title: 'AVG ATTENDANCE',
    key: 'avgAttendance',
    align: 'center',
    dataIndex: 'avgAttendance',
  },
  {
    title: 'TARDIES',
    key: 'tardies',
    align: 'center',
    dataIndex: 'tardyEventCount',
  },
  {
    title: 'ATTENDANCE DISTRIBUTION',
    key: 'attendanceDistribution',
    align: 'center',
    dataIndex: '',
  },
]

export const onCsvConvert = (data) =>
  downloadCSV(`Pre Vs Post Test Comparison.csv`, data)

export const getTableColumns = () => {
  const tableColumns = next(columns, (_columns) => {
    const attendanceDistributionColumn = _columns.findIndex(
      (col) => col.key === 'attendanceDistribution'
    )
    _columns[attendanceDistributionColumn].render = (_, record) => {
      const { attendanceDistribution } = record
      return <HorizontalStackedBarChart data={attendanceDistribution} />
    }
  })
  return tableColumns
}

export const compareByOptions = [
  { key: compareByKeys.SCHOOL, title: 'School', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.TEACHER, title: 'Teacher', hiddenFromRole: ['teacher'] },
  { key: compareByKeys.CLASS, title: 'Class' },
]

const PerformanceTable = ({
  dataSource,
  selectedTableFilters,
  setTableFilters,
  isCsvDownloading = false,
  isSharedReport = false,
}) => {
  const tableColumns = getTableColumns()
  return (
    <StyledCard>
      <StyledRow type="flex" justify="space-between" margin="20px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Change By {selectedTableFilters.compareBy.title}
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={compareByOptions}
          selectedTableFilters={selectedTableFilters}
          isSharedReport={isSharedReport}
        />
      </StyledRow>
      <CsvTable
        dataSource={dataSource}
        columns={tableColumns}
        tableToRender={StyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
      />
    </StyledCard>
  )
}

PerformanceTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PerformanceTable
