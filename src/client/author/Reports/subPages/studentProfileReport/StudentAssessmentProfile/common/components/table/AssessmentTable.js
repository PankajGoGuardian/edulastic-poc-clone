import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { filter, includes, isNaN } from 'lodash'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { CustomTableTooltip } from '../../../../../../common/components/customTableTooltip'
import TableTooltipRow from '../../../../../../common/components/tooltip/TableTooltipRow'
import {
  StyledTable as Table,
  StyledCell,
} from '../../../../../../common/styled'
import { getHSLFromRange1 } from '../../../../../../common/util'
import CsvTable from '../../../../../../common/components/tables/CsvTable'
import { reportLinkColor } from '../../../../../multipleAssessmentReport/common/utils/constants'

export const StyledTable = styled(Table)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
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

const getFormattedLink = (record, location, pageTitle, value) => (
  <Link
    style={{ color: reportLinkColor }}
    to={{
      pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`,
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
    {value}
  </Link>
)

const getCol = (
  text,
  isSharedReport,
  backgroundColor,
  columnKey,
  location,
  pageTitle,
  record
) => {
  let value = text === undefined || text === null ? 'N/A' : `${text}%`
  if (columnKey === 'score' && !isSharedReport) {
    value = getFormattedLink(record, location, pageTitle, value)
  }
  return (
    <StyledCell justify="center" style={{ backgroundColor }}>
      {value}
    </StyledCell>
  )
}

const tableColumns = (location, pageTitle, isSharedReport) => [
  {
    title: 'Assessment Name',
    dataIndex: 'testName',
    key: 'testName',
    align: 'left',
    fixed: 'left',
    width: 200,
    render: (data, record) =>
      !isSharedReport ? (
        <Link
          to={`/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`}
        >
          {data}
        </Link>
      ) : (
        data
      ),
  },
  {
    title: 'Assessment Type',
    dataIndex: 'testType',
    width: 180,
    key: 'testType',
  },
  {
    title: 'Day of Assessment Start',
    dataIndex: 'assignmentDateFormatted',
    key: 'assignmentDateFormatted',
    width: 180,
    className: 'assessmentDate',
    sorter: (a, b) => a.assignmentDate - b.assignmentDate,
  },
  {
    title: 'Total Questions',
    dataIndex: 'totalQuestions',
    key: 'totalQuestions',
  },
  {
    title: 'Score',
    dataIndex: 'rawScore',
    className: 'rawscore',
    key: 'rawScore',
    render: (data, record) =>
      !isSharedReport
        ? getFormattedLink(record, location, pageTitle, data)
        : data,
  },
  {
    title: 'District (Avg. Score%)',
    dataIndex: 'districtAvg',
    key: 'districtAvg',
  },
  {
    title: 'School (Avg Score%)',
    dataIndex: 'schoolAvg',
    key: 'schoolAvg',
  },
  {
    title: 'Class (Avg Score%)',
    dataIndex: 'groupAvg',
    key: 'groupAvg',
  },
]

const getColumns = (studentName = '', location, pageTitle, isSharedReport) => [
  ...tableColumns(location, pageTitle, isSharedReport),
  {
    title: 'Student (Score%)',
    dataIndex: 'score',
    align: 'right',
    key: 'score',
    sorter: (a, b) => a.score - b.score,
    render: (score, record) => {
      if (isNaN(score) && score !== null) {
        return getCol(score, isSharedReport, '#cccccc')
      }

      const toolTipText = () => (
        <div>
          <TableTooltipRow title="Assessment Name: " value={record.testName} />
          <TableTooltipRow title="Assessment Type: " value={record.testType} />
          <TableTooltipRow
            title="Subject: "
            value={record.standardSet || 'N/A'}
          />
          <TableTooltipRow title="Student Name: " value={studentName} />
          <TableTooltipRow
            title="Day of Assessment Start: "
            value={record.assignmentDateFormatted}
          />
          <TableTooltipRow
            title="Student Performance: "
            value={`${record.score}%`}
          />
          <TableTooltipRow
            title="District Performance: "
            value={`${record.districtAvg}%`}
          />
          <TableTooltipRow
            title="School Performance: "
            value={`${record.schoolAvg}%`}
          />
          <TableTooltipRow
            title="Class Performance: "
            value={`${record.groupAvg}%`}
          />
          <TableTooltipRow
            title="Total Questions: "
            value={record.totalQuestions}
          />
          <TableTooltipRow title="Score: " value={record.rawScore} />
        </div>
      )

      return (
        <CustomTableTooltip
          placement="top"
          title={toolTipText()}
          getCellContents={() =>
            getCol(
              score,
              isSharedReport,
              getHSLFromRange1(score),
              'score',
              location,
              pageTitle,
              record
            )
          }
        />
      )
    },
  },
]

const AssessmentTable = ({
  data,
  studentName,
  selectedTests,
  isCsvDownloading,
  onCsvConvert,
  location,
  pageTitle,
  isSharedReport,
}) => {
  const columns = getColumns(studentName, location, pageTitle, isSharedReport)

  const filteredData = filter(data, (test) =>
    selectedTests.length ? includes(selectedTests, test.uniqId) : true
  )

  return (
    <CsvTable
      dataSource={filteredData}
      columns={columns}
      colouredCellsNo={1}
      tableToRender={StyledTable}
      scroll={{ x: 1000 }}
      onCsvConvert={onCsvConvert}
      isCsvDownloading={isCsvDownloading}
    />
  )
}

AssessmentTable.propTypes = {
  data: PropTypes.array,
  studentName: PropTypes.string,
  selectedTests: PropTypes.array,
  isCsvDownloading: PropTypes.bool,
  onCsvConvert: PropTypes.func,
}

AssessmentTable.defaultProps = {
  data: [],
  studentName: '',
  selectedTests: [],
  isCsvDownloading: false,
  onCsvConvert: () => {},
}

export default AssessmentTable
