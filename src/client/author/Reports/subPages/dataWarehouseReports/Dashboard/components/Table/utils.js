import React from 'react'
import next from 'immer'
import { flatMap, min } from 'lodash'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { IconExternalLink } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { StyledTag } from '../../../common/styled'
import { availableTestTypes } from '../../utils'
import HorizontalBar from '../common/HorizontalBar'
import { CompareByContainer } from '../common/styledComponents'
import { DashedLine } from '../../../../../common/styled'

const tableColumnsData = [
  {
    dataIndex: 'compareBy',
    key: 'compareBy',
    align: 'center',
    fixed: 'left',
    width: 200,
  },
  {
    dataIndex: 'avgAttendance',
    key: 'avgAttendance',
    title: 'AVG. ATTENDANCE',
    align: 'center',
    width: 150,
    className: 'avg-attendance-column-header',
  },
  // next up are dynamic columns for each assessment type
]

export const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Dashboard Report.csv`, data)

export const getTableColumns = (tableData, compareBy) => {
  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex((col) => col.key === 'compareBy')
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].dataIndex = compareBy.key
    _columns[compareByIdx].render = (data) => {
      const maxCharsInColumn = 25
      const dashedLineMarginX = 96 - 3.5 * min([data.length, maxCharsInColumn])
      return data ? (
        <Tooltip title={data}>
          <div>
            <CompareByContainer>{data}</CompareByContainer>
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
    _columns[compareByIdx].defaultSortOrder = 'ascend'

    // dynamic columns
    const testTypesBasedColumns = flatMap(availableTestTypes, (testType) => {
      const isAvailable = Object.keys(tableData[0]).filter(
        (key) => key === testType.key
      )[0]
      const isEdulastic = testType.key === 'Edulastic'
      if (isAvailable) {
        return [
          {
            key: 'avgScore',
            title: (
              <>
                <EduIf condition={isEdulastic}>
                  <StyledTag
                    border="1.5px solid black"
                    font="bold"
                    marginBlock="5px"
                  >
                    {testType.key}
                  </StyledTag>
                </EduIf>
                <EduIf condition={!isEdulastic}>
                  <StyledTag color="black" marginBlock="5px">
                    {testType.key}
                  </StyledTag>
                </EduIf>
                <div>AVG. SCORE</div>
              </>
            ),
            dataIndex: 'a',
            align: 'center',
            width: '120px',
            visibleOn: ['browser'],
            render: (_, record) =>
              `${record[testType.key].avgScorePercentage}%`,
          },
          {
            key: 'avgScore',
            title: <div>PERFORMANCE DISTRIBUTION</div>,
            dataIndex: 'a',
            align: 'center',
            visibleOn: ['browser'],
            className: 'performance-distribution-column-header',
            render: (_, record) => (
              <HorizontalBar
                data={record[testType.key].performanceDistribution}
              />
            ),
          },
        ]
      }
    })
    _columns.push(...testTypesBasedColumns)
  })
  const externalLinkColumn = {
    dataIndex: 'link',
    key: 'link',
    title: 'PERFORMANCE TRENDS',
    align: 'center',
    fixed: 'right',
    width: 150,
    render: () => <IconExternalLink />,
  }
  tableColumns.push(externalLinkColumn)
  return tableColumns
}
