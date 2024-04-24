import React from 'react'
import { Link } from 'react-router-dom'
import next from 'immer'
import qs from 'qs'

import { Tooltip } from 'antd'
import { roleuser } from '@edulastic/constants'
import CsvTable from '../../../../common/components/tables/CsvTable'
import { StyledTable, TooltipDiv } from './styled'

import { downloadCSV } from '../../../../common/util'
import { TABLE_PAGINATION_STYLE } from '../../../../../../common/styled'

const sortNumbers = (key) => (a, b) =>
  (Number(a[key]) || 0) - (Number(b[key]) || 0)

const sortText = (key) => (a, b) =>
  (a[key] || '').toLowerCase().localeCompare((b[key] || '').toLowerCase())

const TooltipEllipsisText = ({ text }) => (
  <Tooltip title={text} placement="topLeft">
    <TooltipDiv>{text}</TooltipDiv>
  </Tooltip>
)

const ActivityTable = ({
  data,
  filter,
  columns,
  isCsvDownloading,
  filters,
  activityBy = 'school',
}) => {
  const tableData = Object.keys(filter).length
    ? data.filter((item) => filter[item[`${activityBy}Name`] || '-'])
    : data

  const onCsvConvert = (csvData) =>
    downloadCSV(`Activity by ${activityBy} Report.csv`, csvData)

  const _columns = next(columns, (rawColumns) => {
    if (activityBy === 'school') {
      rawColumns[0].sorter = sortText('schoolName')
      rawColumns[0].render = (text, record) => {
        const queryStr = qs.stringify({
          ...filters,
          schoolIds: record.schoolId,
        })
        return text ? (
          <Link to={`/author/reports/performance-over-time?${queryStr}`}>
            <TooltipEllipsisText text={text} />
          </Link>
        ) : (
          '-'
        )
      }
      rawColumns[2].render = (text) => text
      rawColumns[2].sorter = sortText('teacherCount')
    } else {
      rawColumns[0].sorter = sortText('teacherName')
      rawColumns[0].render = (text, record) => {
        if (roleuser.DA_SA_ROLE_ARRAY.includes(record.role)) {
          return text
        }
        const queryStr = qs.stringify({
          ...filters,
          teacherIds: record.teacherId,
        })
        return (
          <Link to={`/author/reports/performance-over-time?${queryStr}`}>
            <TooltipEllipsisText text={text} />
          </Link>
        )
      }
      rawColumns[1].render = (text) =>
        text ? <TooltipEllipsisText text={text} /> : '-'
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

  console.log({
    dataSource: { tableData },
    columns: { _columns },
    tableToRender: { StyledTable },
  })
  return (
    <CsvTable
      isCsvDownloading={isCsvDownloading}
      onCsvConvert={onCsvConvert}
      dataSource={tableData}
      columns={_columns}
      tableToRender={StyledTable}
      scroll={{ x: '100%' }}
      pagination={{
        style: TABLE_PAGINATION_STYLE,
        pageSize: 10,
      }}
    />
  )
}

export default ActivityTable
