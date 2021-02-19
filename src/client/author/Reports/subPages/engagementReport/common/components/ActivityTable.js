import React from 'react'
import { Link } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'

import { Tooltip } from 'antd'
import CsvTable from '../../../../common/components/tables/CsvTable'
import { StyledTable } from './styled'

import { downloadCSV } from '../../../../common/util'
import staticDropDownData from '../static/staticDropDownData.json'

const defaultAssessmentTypes = staticDropDownData.assessmentType
  .map((o) => o.key)
  .slice(1)
  .join()

const sortNumbers = (key) => (a, b) =>
  (Number(a[key]) || 0) - (Number(b[key]) || 0)

const sortText = (key) => (a, b) =>
  (a[key] || '').toLowerCase().localeCompare((b[key] || '').toLowerCase())

const ActivityTable = ({
  dataSource,
  columns,
  isCsvDownloading,
  filters,
  activityBy = 'school',
}) => {
  const onCsvConvert = (data) =>
    downloadCSV(`Activity by ${activityBy} Report.csv`, data)

  const _columns = next(columns, (rawColumns) => {
    if (activityBy === 'school') {
      rawColumns[0].sorter = sortText('schoolName')
      rawColumns[0].render = (text, record) => {
        const queryStr = qs.stringify({
          ...filters,
          assessmentTypes: filters.assessmentTypes || defaultAssessmentTypes,
          schoolIds: record.schoolId,
        })
        return (
          <Link to={`/author/reports/performance-over-time?${queryStr}`}>
            {text}
          </Link>
        )
      }
      rawColumns[2].render = (text) => text
      rawColumns[2].sorter = sortText('teacherCount')
    } else {
      rawColumns[0].sorter = sortText('teacherName')
      rawColumns[0].render = (text, record) => {
        const queryStr = qs.stringify({
          ...filters,
          assessmentTypes: filters.assessmentTypes || defaultAssessmentTypes,
          teacherIds: record.teacherId,
        })
        return (
          <Link to={`/author/reports/performance-over-time?${queryStr}`}>
            {text}
          </Link>
        )
      }
      rawColumns[1].render = (text) => (
        <Tooltip title={text} placement="top">
          <div
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        </Tooltip>
      )
      rawColumns[1].sorter = sortText('schoolNames')
    }
    rawColumns[activityBy === 'school' ? 1 : 2].render = (text) => text
    rawColumns[activityBy === 'school' ? 1 : 2].sorter = sortNumbers(
      'testCount'
    )
    rawColumns[activityBy === 'school' ? 1 : 2].defaultSortOrder = 'descend'
    rawColumns[3].render = (text) => text
    rawColumns[3].sorter = sortNumbers('studentCount')
  })

  return (
    <CsvTable
      isCsvDownloading={isCsvDownloading}
      onCsvConvert={onCsvConvert}
      dataSource={dataSource}
      columns={_columns}
      tableToRender={StyledTable}
      scroll={{ x: '100%' }}
      pagination={{
        pageSize: 10,
      }}
    />
  )
}

export default ActivityTable
