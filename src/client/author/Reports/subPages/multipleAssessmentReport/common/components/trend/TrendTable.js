import { Col, Row } from 'antd'
import { capitalize, groupBy, map, values, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import TableTooltipRow from '../../../../../common/components/tooltip/TableTooltipRow'
import {
  StyledCard,
  StyledCell,
  StyledH3,
  StyledTable as Table,
} from '../../../../../common/styled'
import { getHSLFromRange1 } from '../../../../../common/util'
import dropDownData from '../../static/json/dropDownData.json'
import { reportLinkColor } from '../../utils/constants'
import { compareByMap } from '../../utils/trend'
import TrendColumn from './TrendColumn'
import BackendPagination from '../../../../../common/components/BackendPagination'

const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-thead {
        th {
          /* white-space: nowrap; */
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
          font-size: 10px;
          border: 0px;
          .ant-table-column-sorter {
            vertical-align: top;
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
`

const formatText = (test, type) => {
  if (test[type] === null || typeof test[type] === 'undefined') return '-'

  if (test.records[0].maxScore === null || test.records[0].totalScore === null)
    return 'Absent'

  if (type == 'score') {
    return `${test[type]}%`
  }

  return test[type]
}

const getCol = (
  text,
  backgroundColor,
  isCellClickable,
  pageTitle,
  location,
  test
) => {
  if (isCellClickable && text) {
    const { assignmentId, groupId, testActivityId } = test.records[0]

    return (
      <StyledCell justify="center" style={{ backgroundColor }}>
        <Link
          style={{ color: reportLinkColor }}
          to={{
            pathname: `/author/classboard/${assignmentId}/${groupId}/test-activity/${testActivityId}`,
            state: {
              // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
              breadCrumb: [
                {
                  title: 'INSIGHTS',
                  to: '/author/reports',
                },
                {
                  title: pageTitle,
                  to: `${location.pathname}${location.search}`,
                },
              ],
            },
          }}
        >
          {text}
        </Link>
      </StyledCell>
    )
  }
  return (
    <StyledCell justify="center" style={{ backgroundColor }}>
      {text || '-'}
    </StyledCell>
  )
}

const getCellAttributes = (test = {}, analyseBy = {}) => {
  let value = '-'
  let color = 'transparent'

  switch (analyseBy.key) {
    case 'proficiencyBand':
      if (test.proficiencyBand) {
        value = test.proficiencyBand.name || value
        color = test.proficiencyBand.color || color
      }
      break
    case 'standard':
      value = test.proficiencyBand.aboveStandard
        ? 'Above Standard'
        : 'Below Standard'
      color = getHSLFromRange1((test.proficiencyBand.aboveStandard || 0) * 100)
      break
    default:
      value = formatText(test, analyseBy.key)
      if (value !== 'Absent') {
        color = getHSLFromRange1(test.score)
      }
      break
  }

  return { value, color }
}

const getColumns = (
  rawMetric = [],
  analyseBy = '',
  compareBy = {},
  customColumns = [],
  toolTipContent,
  filters = {},
  isCellClickable,
  location,
  pageTitle,
  isSharedReport
) => {
  const groupedAvailableTests = groupBy(rawMetric, 'testId')
  const dynamicColumns = map(groupedAvailableTests, (_, testId) => {
    const { assessmentDate, testName = 'N/A' } =
      groupedAvailableTests[testId].reduce((ele, res) =>
        ele.assessmentDate > res.assessmentDate ? ele : res
      ) || {}

    return {
      key: testId,
      title: testName,
      assessmentDate,
      align: 'center',
      className: 'normal-text',
      dataIndex: 'tests',
      width: 120,
      render: (tests = {}, record) => {
        const currentTest = tests[testId]

        if (!currentTest) {
          return getCol('-', 'transparent')
        }

        const { color, value } = getCellAttributes(currentTest, analyseBy)

        if (value === 'Absent') {
          return getCol('Absent', '#cccccc')
        }

        const toolTipText = () => (
          <div>
            <TableTooltipRow title="Assessment Name: " value={testName} />
            {toolTipContent(record, value)}
            <TableTooltipRow
              title={`${capitalize(analyseBy.title)} : `}
              value={value}
            />
          </div>
        )

        return (
          <CustomTableTooltip
            placement="top"
            title={toolTipText()}
            getCellContents={() =>
              getCol(
                value,
                color,
                isCellClickable,
                pageTitle,
                location,
                record.tests[testId]
              )
            }
          />
        )
      },
    }
  })

  // filter out test data without testName
  const filteredDynamicColumns = dynamicColumns.filter((t) => t.title)

  const columns = [
    {
      key: compareBy.key,
      title: capitalize(compareBy.title),
      align: 'left',
      fixed: 'left',
      width: 180,
      className: 'class-name-column',
      dataIndex: compareByMap[compareBy.key],
      render: (data, record) =>
        compareBy.key === 'student' && !isSharedReport ? (
          <Link
            to={`/author/reports/student-profile-summary/student/${record.id}?termId=${filters?.termId}`}
          >
            {data}
          </Link>
        ) : compareBy.key === 'school' && isEmpty(data) ? (
          '-'
        ) : (
          data
        ),
      sorter: (a, b) => {
        const keyword = compareByMap[compareBy.key]
        return a[keyword].toLowerCase().localeCompare(b[keyword].toLowerCase())
      },
    },
    {
      title: 'SIS ID',
      dataIndex: 'sisId',
      key: 'sisId',
      width: 100,
      visibleOn: ['csv'],
    },
    {
      title: 'STUDENT NUMBER',
      dataIndex: 'studentNumber',
      key: 'studentNumber',
      width: 100,
      visibleOn: ['csv'],
    },
    ...customColumns,
    {
      key: 'trend',
      title: 'Trend',
      dataIndex: 'tests',
      width: 150,
      align: 'center',
      visibleOn: ['browser'],
      render: (tests, { testName, trend }) => {
        const augmentedTests = map(tests, (test) => ({
          ...test,
          testName,
        })).sort((a, b) => a.records[0].startDate - b.records[0].startDate)
        return <TrendColumn type={trend} tests={augmentedTests} />
      },
    },
    {
      key: 'type',
      title: 'Trend',
      dataIndex: 'trend',
      width: 150,
      align: 'center',
      visibleOn: ['csv'],
      render: (trend) => capitalize(trend),
    },
  ]

  return columns.concat(
    filteredDynamicColumns.sort((a, b) =>
      a.assessmentDate !== b.assessmentDate
        ? a.assessmentDate - b.assessmentDate
        : a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    )
  )
}

const TrendTable = ({
  filters = {},
  data,
  rowSelection,
  rawMetric,
  analyseBy,
  compareBy,
  customColumns,
  heading,
  toolTipContent,
  isCsvDownloading,
  onCsvConvert,
  isCellClickable,
  location,
  pageTitle,
  isSharedReport,
  backendPagination,
  setBackendPagination,
}) => {
  const columns = getColumns(
    rawMetric,
    analyseBy,
    compareBy,
    customColumns,
    toolTipContent,
    filters,
    isCellClickable,
    location,
    pageTitle,
    isSharedReport
  )
  const groupedAvailableTests = groupBy(rawMetric, 'testId')

  return (
    <StyledCard>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledH3>{heading}</StyledH3>
        </Col>
      </Row>
      <TableContainer>
        <CsvTable
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          colouredCellsNo={values(groupedAvailableTests).length}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          scroll={{ x: '100%' }}
          tableToRender={StyledTable}
          pagination={isCsvDownloading ? undefined : false}
        />
      </TableContainer>
      <BackendPagination
        backendPagination={backendPagination}
        setBackendPagination={setBackendPagination}
      />
    </StyledCard>
  )
}

const optionShape = PropTypes.shape({
  key: PropTypes.string,
  title: PropTypes.string,
})

TrendTable.propTypes = {
  data: PropTypes.array.isRequired,
  rawMetric: PropTypes.array.isRequired,
  analyseBy: optionShape,
  compareBy: optionShape,
  customColumns: PropTypes.array,
  heading: PropTypes.string,
  toolTipContent: PropTypes.func,
  isCsvDownloading: PropTypes.bool,
  onCsvConvert: PropTypes.func,
}

TrendTable.defaultProps = {
  analyseBy: dropDownData.analyseByData[0],
  compareBy: dropDownData.compareByData[0],
  customColumns: [],
  heading: '',
  toolTipContent: () => null,
  isCsvDownloading: false,
  onCsvConvert: () => {},
}

export default TrendTable

const TableContainer = styled.div`
  .ant-table-body {
    padding-bottom: 30px;
  }
  th.class-name-column {
    white-space: nowrap;
    min-width: 150px;
  }
`
