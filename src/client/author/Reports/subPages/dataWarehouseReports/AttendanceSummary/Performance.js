import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { roleuser, reportUtils } from '@edulastic/constants'
import { EduIf, SpinLoader } from '@edulastic/common'
import CsvTable from '../../../common/components/tables/CsvTable'

import { StyledCard } from '../../../common/styled'
import TableFilters from './TableFilter'
import HorizontalStackedBarChart from './HorizontalStackedChart'
import { StyledTable } from '../../singleAssessmentReport/QuestionAnalysis/componenets/styled'
import { useAttendanceDetailsFetch } from './hooks/useFetch'
import {
  compareByEnums,
  compareByOptions,
  compareByToPluralName,
  pageSize,
} from './constants'

const { downloadCSV } = reportUtils.common

const getTableColumns = (sortOrder, sortKey, compareBy) => {
  return [
    {
      title: compareByToPluralName[compareBy],
      key: 'dimension',
      dataIndex: 'dimension.name',
      align: 'left',
      sorter: true,
    },
    {
      title: 'AVG ATTENDANCE',
      key: 'attendance',
      align: 'center',
      dataIndex: 'avgAttendance',
      render: (text) => `${text}%`,
      sorter: true,
    },
    {
      title: 'TARDIES',
      key: 'tardies',
      align: 'center',
      dataIndex: 'tardyEventCount',
      sorter: true,
    },
    {
      title: 'ATTENDANCE DISTRIBUTION',
      key: 'attendanceDistribution',
      align: 'center',
      dataIndex: 'attendanceDistribution',
      render: (attendanceDistribution) => {
        return <HorizontalStackedBarChart data={attendanceDistribution} />
      },
    },
  ].map((item) => {
    if (item.key === sortKey) {
      item.sortOrder = sortOrder
    }
    return item
  })
}

export const onCsvConvert = (data) =>
  downloadCSV(`Pre Vs Post Test Comparison.csv`, data)

const PerformanceTable = ({
  isCsvDownloading = false,
  filters = {},
  userRole,
}) => {
  const [compareBy, setCompareBy] = useState(
    userRole === roleuser.TEACHER ? compareByEnums.CLASS : compareByEnums.SCHOOL
  )
  const [sortOrder, setSortOrder] = useState(undefined)
  const [sortKey, setSortKey] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [data, loading] = useAttendanceDetailsFetch({
    filters,
    compareBy,
    sortOrder,
    sortKey,
    pageNo,
    pageSize,
  })
  useEffect(() => {
    setPageNo(1)
    setSortOrder(undefined)
    setSortKey('')
  }, [filters])
  const columns = useMemo(() => {
    return getTableColumns(sortOrder, sortKey, compareBy)
  }, [sortOrder, sortKey])

  const _setCompareBy = (value) => {
    setCompareBy(value)
    setSortOrder(undefined)
    setSortKey('')
    setPageNo(1)
  }

  return (
    <StyledCard>
      <TableFilters
        compareByOptions={compareByOptions}
        setCompareBy={_setCompareBy}
        compareBy={compareBy}
      />
      <EduIf condition={loading}>
        <SpinLoader
          tip={`Loading ${compareByToPluralName[compareBy]} data`}
          height="200px"
        />
      </EduIf>
      <EduIf condition={!loading}>
        <CsvTable
          dataSource={data}
          columns={columns}
          tableToRender={StyledTable}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          onChange={(_, __, column) => {
            setSortKey(column.columnKey)
            setSortOrder(column.order)
          }}
        />
        {/* TODO: update condition = data.totalRows.length > pageSize  as well as total */}
        <EduIf condition={data.length > 1}>
          <Pagination
            style={{ marginTop: '10px' }}
            onChange={setPageNo}
            current={pageNo}
            pageSize={pageSize}
            total={50}
          />
        </EduIf>
      </EduIf>
    </StyledCard>
  )
}

PerformanceTable.propTypes = {
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PerformanceTable
