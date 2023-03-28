import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Pagination, Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { EduIf, SpinLoader } from '@edulastic/common'
import CsvTable from '../../../common/components/tables/CsvTable'

import { StyledCard, DashedLine } from '../../../common/styled'
import { StyledRow } from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import TableFilters from './TableFilter'
import HorizontalStackedBarChart from './HorizontalStackedChart'
import { StyledTable } from '../../singleAssessmentReport/QuestionAnalysis/componenets/styled'
import { useAttendanceDetailsFetch } from './hooks/useFetch'
import {
  compareByKeys,
  compareByOptions,
  compareByToPluralName,
  pageSize,
} from './constants'

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

const PerformanceTable = ({ isCsvDownloading = false, filters = {} }) => {
  const [compareBy, setCompareBy] = useState(compareByKeys.SCHOOL)
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
  const columns = useMemo(() => {
    return getTableColumns(sortOrder, sortKey, compareBy)
  }, [sortOrder, sortKey])
  return (
    <StyledCard>
      <StyledRow type="flex" justify="space-between" margin="20px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Change By {compareByToPluralName[compareBy]}
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
        <TableFilters
          compareByOptions={compareByOptions}
          setCompareBy={setCompareBy}
          compareBy={compareBy}
        />
      </StyledRow>
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
        <EduIf condition>
          <Pagination
            style={{ marginTop: '10px' }}
            onChange={setPageNo}
            current={pageNo}
            pageSize={pageSize}
            total={200}
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
