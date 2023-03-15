import React from 'react'
import { map } from 'lodash'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { Col, Row } from 'antd'
import {
  StyledCard,
  StyledTable as Table,
  StyledH3,
  StyledCell,
} from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import TableTooltipRow from '../../../../../common/components/tooltip/TableTooltipRow'
import {
  getHSLFromRange1,
  stringCompare,
  downloadCSV,
} from '../../../../../common/util'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import BackendPagination from '../../../../../common/components/BackendPagination'
import IncompleteTestsMessage from '../../../../../common/components/IncompleteTestsMessage'

const StyledTable = styled(Table)`
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

const staticFields = [
  {
    title: 'Assessment Name',
    dataIndex: 'testName',
    fixed: 'left',
    width: 250,
    align: 'left',
    sorter: (a, b) => stringCompare(a.testName, b.testName),
    render: (text, record) => (record.isIncomplete ? `${text} *` : text),
  },
  {
    title: 'Type',
    width: 110,
    dataIndex: 'testType',
  },
  {
    title: 'Assessment Date',
    dataIndex: 'assessmentDateFormatted',
    className: 'assessmentDate',
    width: 120,
    sorter: (a, b) => a.assessmentDate - b.assessmentDate,
  },
  {
    title: 'Max Possible Score',
    width: 120,
    dataIndex: 'maxPossibleScore',
    render: (text, record) =>
      record.maxPossibleScore === null ? `-` : `${record.maxPossibleScore}`,
  },
  {
    title: 'Questions',
    width: 90,
    dataIndex: 'totalTestItems',
  },
  {
    title: 'Assigned',
    width: 90,
    dataIndex: 'totalAssigned',
  },
  {
    title: 'Submitted',
    width: 90,
    dataIndex: 'totalGraded',
  },
  {
    title: 'Absent',
    width: 90,
    dataIndex: 'totalAbsent',
  },
]

const customFields = [
  {
    title: 'Min. Score',
    width: 100,
    dataIndex: 'minScore',
  },
  {
    title: 'Max. Score',
    width: 100,
    dataIndex: 'maxScore',
  },
  {
    title: 'Avg. Student (Score%)',
    width: 120,
    dataIndex: 'score',
  },
]

const getCol = (text, backgroundColor) => (
  <StyledCell justify="center" style={{ backgroundColor }}>
    {text || 'N/A'}
  </StyledCell>
)

const getColumns = () => {
  const dynamicColumns = map(customFields, (field) => ({
    ...field,
    render: (text, record) => {
      let value = text || 0
      let color = 'transparent'

      if (field.dataIndex === 'score') {
        color = getHSLFromRange1(value)
        value = `${value}%`
      } else {
        // to display maxScore and minScore upto 2 decimal places
        value = value.toFixed(2)
      }

      const toolTipText = () => (
        <div>
          <TableTooltipRow
            title="Assessment Name : "
            value={record.testName || 'N/A'}
          />
          <TableTooltipRow
            title="Assessment Date : "
            value={record.assessmentDateFormatted}
          />
          <TableTooltipRow title={`${field.title} : `} value={value} />
        </div>
      )

      return (
        <CustomTableTooltip
          placement="top"
          title={toolTipText()}
          getCellContents={() => getCol(value, color)}
        />
      )
    },
  }))

  return [...staticFields, ...dynamicColumns]
}

const PerformanceOverTimeTable = ({
  dataSource,
  isCsvDownloading,
  backendPagination,
  setBackendPagination,
  showTestIncompleteText = false,
}) => {
  const onCsvConvert = (data) => downloadCSV(`Performance Over Time.csv`, data)

  return (
    <StyledCard data-testid="PerformanceOverTimeTable">
      <StyledH3>Assessment Statistics</StyledH3>
      <CsvTable
        dataSource={dataSource}
        columns={getColumns()}
        colouredCellsNo={3}
        tableToRender={StyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        scroll={{ x: '100%' }}
        pagination={isCsvDownloading ? undefined : false}
      />
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

PerformanceOverTimeTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PerformanceOverTimeTable
