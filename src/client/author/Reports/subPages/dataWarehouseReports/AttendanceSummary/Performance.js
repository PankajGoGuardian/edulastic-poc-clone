import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { reportUtils } from '@edulastic/constants'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { Link } from 'react-router-dom'
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
} from './utils/constants'
import {
  compareByFilterFieldKeys,
  nextCompareByOptionsMap,
} from '../Dashboard/utils'

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
      render: (value, record) => {
        const canDrillDown =
          [
            compareByEnums.CLASS,
            compareByEnums.SCHOOL,
            compareByEnums.GROUP,
          ].includes(compareBy) ||
          (compareBy === compareByEnums.TEACHER && record.students < 100)
        let url = null
        if (canDrillDown) {
          const filterField = compareByFilterFieldKeys[compareBy]
          url = new URL(window.location.href)
          url.searchParams.set(filterField, record.dimension._id)
          url.searchParams.set(
            'selectedCompareBy',
            nextCompareByOptionsMap[compareBy]
          )
        } else if (compareBy === compareByEnums.STUDENT) {
          const { search } = window.location
          url = new URL(
            `${window.location.origin}/author/reports/whole-learner-report/student/${record.dimension._id}?${search}`
          )
        } else if (value) {
          const filterField = compareByFilterFieldKeys[compareBy]
          url = new URL(window.location.href)
          url.searchParams.set(filterField, record.dimension._id)
          url.searchParams.set('selectedCompareBy', compareByEnums.STUDENT)
        }
        const text = value || '-'
        return (
          <EduIf condition={!!url}>
            <EduThen>
              <Link to={url} target={url?.href}>
                {text}
              </Link>
            </EduThen>
            <EduElse>{text}</EduElse>
          </EduIf>
        )
      },
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
  downloadCSV(`Attendance Summary.csv`, data)

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
  page,
  setPage,
  compareBy,
  setCompareBy,
}) => {
  useEffect(() => {
    setPage(1)
    setSortOrder('')
    setSortKey('')
  }, [settings.requestFilters])
  const columns = useMemo(() => {
    return getTableColumns(sortOrder, sortKey, compareBy)
  }, [sortOrder, sortKey, compareBy])

  const _setCompareBy = (value) => {
    setCompareBy(value)
    setSortOrder('')
    setSortKey('')
    setPage(1)
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
          pagination={false}
          isCsvDownloading={isCsvDownloading}
          onChange={(_, __, column) => {
            setSortKey(column.columnKey)
            setSortOrder(column.order)
          }}
        />
        <EduIf condition={totalRows > pageSize}>
          <Pagination
            style={{ marginTop: '10px' }}
            onChange={setPage}
            current={page}
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
