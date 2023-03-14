import React, { useMemo } from 'react'
import next from 'immer'
import { min } from 'lodash'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { IconExternalLink } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { StyledTag } from '../../../common/styled'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import { CompareByContainer } from '../common/styledComponents'
import { DashedLine } from '../../../../../common/styled'

const tableColumnsData = [
  {
    dataIndex: 'compareBy',
    key: 'compareBy',
    align: 'center',
    fixed: 'left',
    width: '250px',
  },
  {
    dataIndex: 'avgAttendance',
    key: 'avgAttendance',
    title: 'AVG. ATTENDANCE',
    align: 'center',
    width: 200,
    className: 'avg-attendance-column-header',
  },
  {
    dataIndex: 'avgScorePercentage',
    key: 'avgScorePercentage',
    align: 'center',
    width: 200,
  },
  {
    dataIndex: 'performanceDistribution',
    key: 'performanceDistribution',
    title: 'Performance Distribution',
    align: 'center',
    className: 'performance-distribution-column-header',
  },
  {
    dataIndex: 'link',
    key: 'link',
    title: 'PERFORMANCE TRENDS',
    align: 'center',
    fixed: 'right',
    width: 200,
    render: () => <IconExternalLink />,
  },
]

export const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Dashboard Report.csv`, data)

export const getTableColumns = (compareBy) => {
  console.log(compareBy)
  return useMemo(
    () =>
      next(tableColumnsData, (_columns) => {
        // compareBy column
        const compareByIdx = _columns.findIndex(
          (col) => col.key === 'compareBy'
        )
        _columns[compareByIdx].title = compareBy.title
        _columns[compareByIdx].render = (value) => {
          const maxCharsInColumn = 25
          const dashedLineMarginX =
            96 - 3.5 * min([value.length, maxCharsInColumn])
          return value ? (
            <Tooltip title={value}>
              <div>
                <CompareByContainer>{value}</CompareByContainer>
                <DashedLine
                  dashColor={themeColor}
                  dashWidth="2px"
                  margin={`4px ${dashedLineMarginX}px`}
                  height="1.3px"
                />
              </div>
            </Tooltip>
          ) : (
            '-'
          )
        }

        // Avg Score Column
        const avgScoreColumnIdx = _columns.findIndex(
          (col) => col.key === 'avgScorePercentage'
        )
        _columns[avgScoreColumnIdx].title = (
          <>
            <StyledTag border="1.5px solid black" font="bold" margin="5px 0">
              EDULASTIC
            </StyledTag>
            <div>AVG. SCORE</div>
          </>
        )

        // Performance Distribution Column
        const performanceDistributionColumnIdx = _columns.findIndex(
          (col) => col.key === 'performanceDistribution'
        )
        _columns[performanceDistributionColumnIdx].render = (
          performanceDistribution
        ) => <HorizontalBar data={performanceDistribution} />
      }),
    [compareBy]
  )
}
