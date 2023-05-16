import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Tooltip } from 'antd'
import { IconInfo } from '@edulastic/icons'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'

import { StyledTable } from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import TableTooltipRow from '../../../../../common/components/tooltip/TableTooltipRow'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const { downloadCSV } = reportUtils.common

const {
  viewByMode,
  analyzeByMode,
  compareByColumns,
  compareByStudentsColumns,
  getAnalyzedTableData,
  formatScore,
  getAnalyzeByConfig,
  getStandardColumnsData,
} = reportUtils.performanceByStandards

const AnalysisTable = styled(StyledTable)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          white-space: nowrap;
        }
      }
      .ant-table-body {
        overflow-x: auto !important;
      }

      @media print {
        .ant-table-body {
          overflow-x: hidden !important;
        }
      }
    }
    .ant-table-fixed-left {
      .ant-table-thead {
        th {
          padding: 8px;
          color: #aaafb5;
          font-weight: 900;
          text-transform: uppercase;
          border: 0px;
          .ant-table-column-title {
            font-size: 10px;
          }
        }
      }
      .ant-table-tbody {
        td {
          padding: 10px 0px 10px 8px;
          font-size: 11px;
          color: #434b5d;
          font-weight: 600;
          @media (min-width: ${extraDesktopWidthMax}) {
            font-size: 14px;
          }
        }
      }
    }
  }
  .ant-table-tbody {
    td {
      min-width: 100px;
      padding: 0;
      &:nth-child(1) {
        padding: 10px 8px;
      }
    }
  }
`

const ScoreCell = styled.div`
  background: ${(props) => props.color};
  padding: 10px 8px;

  @media print {
    background-color: ${(props) => props.color};
    -webkit-print-color-adjust: exact;
  }
`

const columnHashMap = {
  teacher: 'teacherName',
  class: 'groupName',
  school: 'schoolName',
}

/**
 * converts table header string starting from 4th column
 * From
 * "1-ESS1-2 POINTS - 1 50%"
 * TO
 * "1-ESS1-2 (POINTS - 1) (50%)"
 */
const onCsvConvert = (data) => {
  const splittedData = data.split('\n')
  const header = splittedData[0]
  const columns = header.split(',')
  for (let i = 3; i < columns.length; i++) {
    const str = columns[i]
    const _str = str.toLocaleLowerCase()
    const indexOfPoints = _str.lastIndexOf('points')
    const indexOfLastSpace = _str.lastIndexOf(' ')

    const transformedStr = `${str.substring(
      0,
      indexOfPoints - 1
    )}(${str
      .substring(indexOfPoints, indexOfLastSpace)
      .replace(/\s/g, '')})(Avg-${str.substring(
      indexOfLastSpace + 1,
      str.length - 1
    )})"`
    columns[i] = transformedStr
  }
  const _header = columns.join(',')
  splittedData[0] = _header
  const finalData = splittedData.join('\n')
  downloadCSV(`Performance By Standard Report.csv`, finalData)
}

const PerformanceAnalysisTable = ({
  report,
  viewBy,
  analyzeBy,
  compareBy,
  selectedStandards,
  selectedDomains,
  isCsvDownloading,
}) => {
  const { scaleInfo, skillInfo } = report
  const [tableData, aggSummaryStats] = getAnalyzedTableData(
    report,
    viewBy,
    compareBy
  )
  const standardColumnsData = getStandardColumnsData(
    skillInfo,
    viewBy,
    selectedStandards,
    selectedDomains
  )
  const analyzeByConfig = getAnalyzeByConfig(analyzeBy, scaleInfo)

  const makeOverallColumn = () => {
    const { selected, dataField } = standardColumnsData

    const getAverage = (student) => {
      const standardMetrics = Object.values(student.standardMetrics).filter(
        (metric) => selected.includes(metric[dataField]) || !selected.length
      )
      const field = analyzeByConfig.field
      const sumTotal = (total, metric) => total + metric[field]
      const overall = standardMetrics.reduce(sumTotal, 0)
      return overall / (standardMetrics.length || 1)
    }

    return {
      title: (
        <div
          style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <span>Avg. {viewBy} Performance</span>
          <Tooltip
            title={`This is the average performance across all the ${viewBy}s assessed`}
          >
            <IconInfo height={10} style={{ marginRight: '10px' }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'overall',
      key: 'overall',
      fixed: 'left',
      width: 160,
      align: 'center',
      sorter: (a, b) => getAverage(a) - getAverage(b),
      render: (data, record) =>
        analyzeByConfig.getOverall(record.standardMetrics),
    }
  }

  const makeStandardColumn = (skill) => {
    const columnConfig = standardColumnsData.getColumnConfig(skill)
    const aggSummaryStat = aggSummaryStats[columnConfig.key] || {}
    const totalPoints = aggSummaryStat.totalMaxScore || 0
    const aggColumnValue = aggSummaryStat[analyzeByConfig.field] || ''
    return {
      title: (
        <p>
          {columnConfig.title}
          <br />
          Points - {parseFloat(totalPoints.toFixed(2))}
          <br />
          {formatScore(aggColumnValue, analyzeBy)}
        </p>
      ),
      dataIndex: 'standardMetrics',
      key: columnConfig.key,
      render: (data, record) => {
        const standard = record.standardMetrics[columnConfig.key]
        if (!standard) {
          return <ScoreCell color="white">N/A</ScoreCell>
        }
        const color = analyzeByConfig.getColor(standard)
        const compareByColumn = compareByColumns[compareBy]
        const compareByColumnValue =
          compareBy === 'students'
            ? `${record.firstName} ${record.lastName}`
            : record[columnHashMap[compareBy]]
            ? record[columnHashMap[compareBy]]
            : record[compareBy]
        const lastTooltipRow =
          analyzeBy === analyzeByMode.MASTERY_LEVEL
            ? {
                title: 'Mastery Code: ',
                value: `${standard[analyzeByConfig.field]}`,
              }
            : analyzeBy === analyzeByMode.MASTERY_SCORE
            ? {
                title: 'Mastery Score: ',
                value: `${standard[analyzeByConfig.field]}`,
              }
            : null
        return (
          <CustomTableTooltip
            placement="top"
            title={
              <div>
                <TableTooltipRow
                  title={`${compareByColumn.title}: `}
                  value={compareByColumnValue || ' -'}
                />
                <TableTooltipRow
                  title={`${
                    viewBy === viewByMode.STANDARDS ? 'Standard' : 'Domain'
                  } : `}
                  value={columnConfig.title}
                />
                <TableTooltipRow
                  title={`Avg. Score ${
                    analyzeBy === analyzeByMode.RAW_SCORE ? '' : '(%)'
                  } : `}
                  value={
                    analyzeBy === analyzeByMode.RAW_SCORE
                      ? formatScore(standard.rawScore, analyzeByMode.RAW_SCORE)
                      : formatScore(standard.avgScore, analyzeByMode.SCORE)
                  }
                />
                {lastTooltipRow ? (
                  <TableTooltipRow {...lastTooltipRow} />
                ) : null}
              </div>
            }
            getCellContents={() => (
              <ScoreCell color={color}>
                {formatScore(standard[analyzeByConfig.field], analyzeBy)}
              </ScoreCell>
            )}
          />
        )
      },
    }
  }

  const makeStandardColumns = () => {
    const { selected, dataField, columnsData } = standardColumnsData
    return columnsData
      .filter(
        (skill) => selected.includes(skill[dataField]) || !selected.length
      )
      .map(makeStandardColumn)
  }

  const getTableColumns = () => {
    /**
     * compareByColumn is destructured to create a new object everytime
     * so that change detection can detect and return correct fixed columns
     */
    const _columns = [
      { ...compareByColumns[compareBy] },
      makeOverallColumn(standardColumnsData, analyzeByConfig),
      ...makeStandardColumns(),
    ]
    if (compareBy === 'students') {
      let index = 1
      for (const column of compareByStudentsColumns) {
        _columns.splice(index++, 0, column)
      }
    }
    return _columns
  }

  const columns = getTableColumns()

  const scrollX = useMemo(() => columns?.length * 160 || '100%', [
    columns?.length,
  ])

  return (
    <CsvTable
      data-testid="PerformanceAnalysisTable"
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
      tableToRender={AnalysisTable}
      dataSource={tableData}
      scroll={{ x: scrollX }}
      columns={columns}
    />
  )
}

PerformanceAnalysisTable.propTypes = {
  report: PropTypes.object,
  viewBy: PropTypes.string.isRequired,
  analyzeBy: PropTypes.string.isRequired,
  compareBy: PropTypes.string.isRequired,
  selectedStandards: PropTypes.array,
  selectedDomains: PropTypes.array,
}

PerformanceAnalysisTable.defaultProps = {
  report: {
    metricInfo: [],
    skillInfo: [],
    studInfo: [],
    teacherInfo: [],
  },
  selectedStandards: [],
  selectedDomains: [],
}

export default PerformanceAnalysisTable
