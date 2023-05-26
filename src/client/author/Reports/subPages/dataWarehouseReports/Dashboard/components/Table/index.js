import React, { useCallback, useMemo } from 'react'
import { round } from 'lodash'
import {
  lightGreen13,
  lightRed6,
  black,
  darkRed4,
  lightGreen10,
  themeColor,
} from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { Tooltip } from 'antd'

import { FlexContainer, EduIf, EduThen, EduElse } from '@edulastic/common'
import { IconInfo } from '@edulastic/icons'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { CustomStyledTable } from '../common/styledComponents'
import TableHeaderCell from './TableHeaderCell'

import {
  academicSummaryFiltersTypes,
  districtAvgDimension,
  tableFilterTypes,
} from '../../utils'
import { getTableColumns, onCsvConvert } from './utils'
import { compareByKeys } from '../../../common/utils'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  StyledDropDownContainer,
  StyledLabel,
} from '../../../../../common/styled'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'

const {
  DB_SORT_ORDER_TYPES,
  tableToDBSortOrderMap,
  EXTERNAL_TEST_KEY_SEPARATOR,
} = reportUtils.common

const DashboardTable = ({
  tableFilters,
  setTableFilters,
  academicSummaryFilters,
  setAcademicSummaryFilters,
  onTableHeaderCellClick,
  getTableDrillDownUrl,
  districtAveragesData,
  tableData,
  selectedPerformanceBand,
  isCsvDownloading,
  rowSelection,
  availableTestTypes,
  hasTableContent,
  emptyContainerDesc,
}) => {
  const {
    academicTestType: { key: academicTestType },
  } = academicSummaryFilters
  const {
    metricInfo: districtAveragesMetricInfo,
    avgAttendance: districtAvgAttendance,
  } = districtAveragesData
  const { avgScore: districtAvgScore, aboveAvgCount, belowAvgCount } =
    districtAveragesMetricInfo?.[academicTestType] || {}
  const districtAvgScoreStr = districtAvgScore
    ? `${round(districtAvgScore)}${
        academicTestType.includes(EXTERNAL_TEST_KEY_SEPARATOR) ? '' : '%'
      }`
    : 'N/A'
  const { metricInfo: tableMetricInfo } = tableData

  const metricInfo = useMemo(() => {
    const districtAvgRecord = {
      dimension: districtAvgDimension,
      avgAttendance: districtAvgAttendance,
      performance: districtAveragesMetricInfo,
    }
    return [districtAvgRecord, ...tableMetricInfo]
  }, [districtAvgAttendance, districtAveragesMetricInfo, tableMetricInfo])

  const isStudentCompareBy =
    tableFilters[tableFilterTypes.COMPARE_BY].key === compareByKeys.STUDENT

  const tableColumns = getTableColumns({
    metricInfo,
    tableFilters,
    isStudentCompareBy,
    getTableDrillDownUrl,
    selectedPerformanceBand,
    selectedTestType: academicTestType,
    availableTestTypes,
  })

  const handleTableChange = useCallback(
    (_pagination, _filters, sorter) => {
      setTableFilters((activeTableFilters) => {
        const curSortKey =
          sorter.columnKey === 'dimension'
            ? activeTableFilters[tableFilterTypes.COMPARE_BY].key
            : sorter.columnKey
        const curSortOrder =
          tableToDBSortOrderMap[sorter.order] || DB_SORT_ORDER_TYPES.ASCEND
        if (
          activeTableFilters.sortKey === curSortKey &&
          activeTableFilters.sortOrder === curSortOrder
        )
          return activeTableFilters
        return {
          ...activeTableFilters,
          sortKey: curSortKey,
          sortOrder: curSortOrder,
        }
      })
    },
    [setTableFilters]
  )

  return (
    <>
      <FlexContainer
        justifyContent="space-between"
        padding="0px 10px 10px 10px"
        flexWrap="wrap"
      >
        <FlexContainer alignItems="center" justifyContent="left">
          <TableHeaderCell
            title={`Above/Equal to Overall Avg.: ${districtAvgScoreStr}`}
            value={aboveAvgCount}
            color={lightGreen13}
            tableHeaderCellClick={() => {
              onTableHeaderCellClick(
                tableFilterTypes.ABOVE_EQUAL_TO_AVG,
                aboveAvgCount
              )
            }}
            borderColor={lightGreen10}
            isSelected={tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG]}
          />
          <TableHeaderCell
            title={`Below Overall Avg.: ${districtAvgScoreStr}`}
            value={belowAvgCount}
            color={lightRed6}
            tableHeaderCellClick={() => {
              onTableHeaderCellClick(tableFilterTypes.BELOW_AVG, belowAvgCount)
            }}
            borderColor={darkRed4}
            isSelected={tableFilters[tableFilterTypes.BELOW_AVG]}
          />
          <Tooltip title="Click on the tiles to filter the table">
            <IconInfo fill={themeColor} />
          </Tooltip>
        </FlexContainer>
        <FlexContainer alignItems="center">
          <StyledLabel
            fontWeight="bold"
            fontSize="12px"
            textColor={black}
            padding="0 10px 0 0"
          >
            BASED ON TEST TYPE
          </StyledLabel>
          <StyledDropDownContainer
            flex="0 0 210px"
            xs={24}
            sm={12}
            lg={6}
            padding="25px 0"
          >
            <ControlDropDown
              height="40px"
              by={academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]}
              selectCB={(e, selected, comData) =>
                setAcademicSummaryFilters({
                  ...academicSummaryFilters,
                  [comData]: selected,
                })
              }
              data={availableTestTypes}
              comData={academicSummaryFiltersTypes.TEST_TYPE}
              prefix="Test Type"
              showPrefixOnSelected={false}
              containerClassName="dashboard-based-on-test-type"
            />
          </StyledDropDownContainer>
        </FlexContainer>
      </FlexContainer>
      <EduIf condition={hasTableContent}>
        <EduThen>
          <CsvTable
            dataSource={metricInfo}
            columns={tableColumns}
            tableToRender={CustomStyledTable}
            onChange={handleTableChange}
            onCsvConvert={onCsvConvert}
            rowSelection={rowSelection}
            isCsvDownloading={isCsvDownloading}
            isStudentCompareBy={isStudentCompareBy}
            pagination={false}
          />
        </EduThen>
        <EduElse>
          <StyledEmptyContainer description={emptyContainerDesc} />
        </EduElse>
      </EduIf>
    </>
  )
}

export default DashboardTable
