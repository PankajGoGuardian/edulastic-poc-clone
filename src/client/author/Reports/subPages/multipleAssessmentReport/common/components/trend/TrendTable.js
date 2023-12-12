import { Col, Row } from 'antd'
import { capitalize, groupBy, map, values, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import qs from 'qs'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { extraDesktopWidthMax, lightGrey } from '@edulastic/colors'
import { testActivityStatus, report as reportTypes } from '@edulastic/constants'
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
import IncompleteTestsMessage from '../../../../../common/components/IncompleteTestsMessage'

const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      .ant-table-body {
        padding-bottom: 60px;
      }
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
  .ant-table-fixed .ant-table-thead .tutorme-column {
    padding: 15px 0 0 0;
    position: relative;
    top: 30px;
    background-color: ${lightGrey};
  }
  .ant-table-fixed .ant-table-tbody .tutorme-column {
    background-color: ${lightGrey};
  }
`

const formatText = (test, type, pageTitle) => {
  if (test[type] === null || typeof test[type] === 'undefined') return '-'

  if (testActivityStatus.ABSENT === test.records[0].progressStatus)
    return 'Absent'

  if (testActivityStatus.NOT_STARTED === test.records[0].progressStatus)
    return 'Not Started'
  // for Peer Progress Analysis report, show the score instead of In Progress
  // for Student progress reprot in MAR , show In Progrss status

  if (
    pageTitle !== reportTypes.reportNavType.PEER_PROGRESS_ANALYSIS &&
    testActivityStatus.START === test.records[0].progressStatus
  ) {
    return 'In Progress'
  }

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
  test,
  compareBy = {}
) => {
  if (isCellClickable && text) {
    const { assignmentId, groupId, testActivityId } = test.records[0]

    return compareBy.key === 'standard' ? (
      <StyledCell justify="center" style={{ backgroundColor }}>
        {text}
      </StyledCell>
    ) : (
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

const getCellAttributes = (
  test = {},
  analyseBy = {},
  masteryScale = {},
  pageTitle
) => {
  let value = '-'
  let color = 'transparent'
  switch (analyseBy.key) {
    case 'proficiencyBand':
      value = formatText(test, analyseBy.key, pageTitle)
      if (
        !isEmpty(value) &&
        value !== 'Absent' &&
        value !== 'Not Started' &&
        value !== 'In Progress' &&
        value !== '-'
      ) {
        value = test.proficiencyBand.name || value
        color = test.proficiencyBand.color || color
      }
      break
    case 'standard':
      value = formatText(test, 'proficiencyBand', pageTitle)
      if (
        !isEmpty(value) &&
        value !== 'Absent' &&
        value !== 'Not Started' &&
        value !== 'In Progress' &&
        value !== '-'
      ) {
        value = test.proficiencyBand.aboveStandard
          ? 'Above Standard'
          : 'Below Standard'
        color = getHSLFromRange1(
          (test.proficiencyBand.aboveStandard || 0) * 100
        )
      }
      break
    case 'masteryScore':
      value = test.fm
      color =
        masteryScale.find((scale) => scale.score === test.fm)?.color ||
        'transparent'
      break
    case 'masteryLevel':
      value =
        masteryScale.find((scale) => scale.score === test.fm)?.masteryName ||
        '-'
      color =
        masteryScale.find((scale) => scale.score === test.fm)?.color ||
        'transparent'
      break
    default:
      value = formatText(test, analyseBy.key, pageTitle)
      if (value !== 'Absent' && value !== 'Not Started') {
        color = getHSLFromRange1(test.score)
      }
      break
  }

  return { value, color }
}

export const getTestColumn = ({
  location,
  testId,
  isIncomplete,
  testName,
  assessmentDate,
  analyseBy,
  compareBy,
  masteryScale,
  pageTitle,
  isCellClickable,
  toolTipContent,
}) => ({
  key: testId,
  title: isIncomplete ? `${testName} *` : testName,
  assessmentDate,
  align: 'center',
  dataIndex: 'tests',
  render: (tests = {}, record) => {
    const currentTest = tests[testId]

    if (!currentTest) {
      return getCol('-', 'transparent')
    }

    const { color, value } = getCellAttributes(
      currentTest,
      analyseBy,
      masteryScale,
      pageTitle
    )

    if (value === 'Absent') {
      return getCol('Absent', '#cccccc')
    }

    if (value === 'In Progress' || value === 'Not Started') {
      return getCol(value, 'transparent')
    }

    const toolTipText = () => (
      <div>
        <TableTooltipRow
          title="Assessment Name: "
          value={isIncomplete ? `${testName} *` : testName}
        />
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
            record.tests[testId],
            compareBy
          )
        }
      />
    )
  },
})

const getDynamicColumnsDefault = ({
  rawMetric,
  analyseBy,
  masteryScale,
  pageTitle,
  toolTipContent,
  isCellClickable,
  location,
  compareBy,
}) => {
  const groupedAvailableTests = groupBy(rawMetric, 'testId')
  const dynamicColumns = map(groupedAvailableTests, (_, testId) => {
    const { assessmentDate, testName = 'N/A', isIncomplete = false } =
      groupedAvailableTests[testId].reduce((ele, res) =>
        ele.assessmentDate > res.assessmentDate ? ele : res
      ) || {}
    return getTestColumn({
      location,
      testId,
      isIncomplete,
      testName,
      assessmentDate,
      analyseBy,
      compareBy,
      masteryScale,
      pageTitle,
      isCellClickable,
      toolTipContent,
    })
  })
  // filter out test data without testName
  const filteredDynamicColumns = dynamicColumns.filter((t) => t.title)
  return filteredDynamicColumns.sort((a, b) =>
    a.assessmentDate !== b.assessmentDate
      ? a.assessmentDate - b.assessmentDate
      : a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  )
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
  isSharedReport,
  masteryScale = {},
  getDynamicColumns,
  interventionData
) => {
  const dynamicColumns = getDynamicColumns
    ? getDynamicColumns({
        rawMetric,
        analyseBy,
        compareBy,
        toolTipContent,
        isCellClickable,
        location,
        pageTitle,
        masteryScale,
        interventionData,
      })
    : getDynamicColumnsDefault({
        rawMetric,
        analyseBy,
        masteryScale,
        pageTitle,
        toolTipContent,
        isCellClickable,
        location,
        compareBy,
      })

  const leftColumns =
    compareBy.key === 'standard'
      ? [
          {
            key: 'domainId',
            title: 'Domain',
            align: 'left',
            fixed: 'left',
            width: 120,
            dataIndex: 'domain',
            sorter: (a, b) => {
              const keyword = 'domain'
              return a[keyword]
                .toLowerCase()
                .localeCompare(b[keyword].toLowerCase())
            },
          },
          {
            key: 'standardId',
            title: 'Standard',
            fixed: 'left',
            width: 120,
            dataIndex: 'standard',
            render: (data, record) => {
              const { termId, grades, subjects } = filters
              const { standardId, curriculumId } = record
              const queryStr = qs.stringify({
                termId,
                grades,
                subjects,
                standardId,
                curriculumId,
              })
              return !isSharedReport ? (
                <Link
                  to={{
                    pathname: `/author/reports/standards-progress`,
                    search: `?${queryStr}`,
                    state: {
                      source: pageTitle,
                    },
                  }}
                >
                  {data}
                </Link>
              ) : (
                data
              )
            },
            sorter: (a, b) => {
              const keyword = 'standard'
              return a[keyword]
                .toLowerCase()
                .localeCompare(b[keyword].toLowerCase(), undefined, {
                  numeric: true,
                })
            },
          },
          {
            key: 'curriculumName',
            title: 'Standard Set',
            align: 'left',
            fixed: 'left',
            width: 120,
            dataIndex: 'curriculumName',
          },
        ]
      : [
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
              return a[keyword]
                .toLowerCase()
                .localeCompare(b[keyword].toLowerCase())
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
        ]

  const columns = [
    ...leftColumns,
    ...customColumns,
    {
      key: 'trend',
      title: 'Trend',
      dataIndex: 'tests',
      width: 150,
      align: 'center',
      visibleOn: ['browser'],
      render: (tests, { trend }) => {
        const sortedTests = Object.values(tests).sort(
          (a, b) => a.records[0].assessmentDate - b.records[0].assessmentDate
        )
        return <TrendColumn type={trend} tests={sortedTests} />
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

  return columns.concat(dynamicColumns)
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
  masteryScale = {},
  showTestIncompleteText = false,
  getDynamicColumns = null,
  interventionData,
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
    isSharedReport,
    masteryScale,
    getDynamicColumns,
    interventionData
  )
  const groupedAvailableTests = groupBy(rawMetric, 'testId')

  const scrollX = useMemo(() => columns.length * 120 || '100%', [columns])

  return (
    <StyledCard data-testid="TrendTable">
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
          scroll={{ x: scrollX }}
          tableToRender={StyledTable}
          pagination={isCsvDownloading ? undefined : false}
        />
      </TableContainer>
      <Row type="flex" align="middle">
        <Col span={14}>
          <IncompleteTestsMessage hasIncompleteTests={showTestIncompleteText} />
        </Col>
        <Col span={10} style={{ minHeight: '52px' }}>
          <BackendPagination
            backendPagination={backendPagination}
            setBackendPagination={setBackendPagination}
          />
        </Col>
      </Row>
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
