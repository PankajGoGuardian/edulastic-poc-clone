import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { reportUtils } from '@edulastic/constants'
import { EduIf, SpinLoader } from '@edulastic/common'
import CsvTable from '../../../common/components/tables/CsvTable'
import { StyledCard } from '../../../common/styled'
import TableFilters from './TableFilter'
import {
  StudentBand,
  HorizontalStackedBarChart,
} from './HorizontalStackedChart'
import { StyledTable } from '../../singleAssessmentReport/QuestionAnalysis/componenets/styled'
import {
  compareByEnums,
  compareByOptions,
  compareByToPluralName,
  pageSize,
  sortKeys,
  sortOrders,
} from './utils/constants'

const { downloadCSV } = reportUtils.common

const getTableColumns = (sortOrder, sortKey, compareBy) => {
  let attendanceDistributionColumn = {
    title: 'ATTENDANCE DISTRIBUTION',
    key: 'attendanceDistribution',
    align: 'center',
    dataIndex: 'attendanceDistribution',
    render: (attendanceDistribution) => {
      return <HorizontalStackedBarChart data={attendanceDistribution} />
    },
  }
  if (compareBy === compareByEnums.STUDENT) {
    attendanceDistributionColumn = {
      title: 'ATTENDANCE',
      key: 'studentBand',
      align: 'center',
      dataIndex: 'studentBand',
      render: (studentBand) => {
        return <StudentBand data={studentBand} />
      },
    }
  }
  return [
    {
      title: compareByToPluralName[compareBy],
      key: sortKeys.DIMENSION,
      dataIndex: 'dimension.name',
      align: 'left',
      sorter: true,
    },
    {
      title: 'AVG ATTENDANCE',
      key: sortKeys.ATTENDANCE,
      align: 'center',
      dataIndex: 'avgAttendance',
      render: (text) => `${Math.round(text)}%`,
      sorter: true,
    },
    {
      title: 'TARDIES',
      key: sortKeys.TARDIES,
      align: 'center',
      dataIndex: 'tardyEventCount',
      sorter: true,
    },
    attendanceDistributionColumn,
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
  settings = {},
  data,
  totalRows,
  loading,
  sortOrder,
  setSortOrder,
  sortKey,
  setSortKey,
  pageNo,
  setPageNo,
  compareBy,
  setCompareBy,
}) => {
  useEffect(() => {
    setPageNo(1)
    setSortOrder(sortOrders.ASCEND)
    setSortKey(sortKeys.DIMENSION)
  }, [settings.requestFilters])
  const columns = useMemo(() => {
    return getTableColumns(sortOrder, sortKey, compareBy)
  }, [sortOrder, sortKey, compareBy])

  const _setCompareBy = (value) => {
    setCompareBy(value)
    setSortOrder(sortOrders.ASCEND)
    setSortKey(sortKeys.DIMENSION)
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
        <EduIf condition={totalRows > pageSize}>
          <Pagination
            style={{ marginTop: '10px' }}
            onChange={setPageNo}
            current={pageNo}
            pageSize={pageSize}
            total={totalRows}
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
