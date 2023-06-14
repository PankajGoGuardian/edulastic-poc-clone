import React from 'react'
import { round } from 'lodash'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { extraDesktopWidthMax } from '@edulastic/colors'
import TableTooltipRow from '../../../../../../common/components/tooltip/TableTooltipRow'
import { CustomTableTooltip } from '../../../../../../common/components/customTableTooltip'
import {
  StyledTable as Table,
  StyledCell,
} from '../../../../../../common/styled'
import CsvTable from '../../../../../../common/components/tables/CsvTable'

export const StyledTable = styled(Table)`
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
          background: none;
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

const getCol = (text, backgroundColor) => (
  <StyledCell justify="center" style={{ backgroundColor }}>
    {text}
  </StyledCell>
)

const renderToolTipColumn = (value, record) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title="Domain : " value={record.name} />
      <TableTooltipRow title="Subject : " value={record.standardSet || 'N/A'} />
      <TableTooltipRow
        title="Domain description : "
        value={record.description}
      />
      <TableTooltipRow
        title="Standards Mastered : "
        value={`${record.masteredCount} out of ${record.standards.length}`}
      />
      <TableTooltipRow title="Assessments# : " value={record.assessmentCount} />
    </div>
  )

  const { color = '#cccccc' } = record.scale

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText()}
      getCellContents={() => getCol(`${round(value)}%`, color)}
    />
  )
}

const columns = [
  {
    title: 'Domain',
    key: 'name',
    dataIndex: 'name',
    fixed: 'left',
    width: 90,
  },
  {
    title: 'Standard Set',
    key: 'curriculumName',
    dataIndex: 'curriculumName',
  },
  {
    title: 'Domain Description',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: 'Mastered Standards',
    key: 'masteredCount',
    dataIndex: 'masteredCount',
    render: (masteredCount, record) =>
      `${masteredCount} out of ${record.standards.length}`,
  },
  {
    title: 'Avg. Score(%)',
    key: 'score',
    dataIndex: 'score',
    sorter: (a, b) => a.score - b.score,
    render: renderToolTipColumn,
  },
]

const StandardMasteryDetailsTable = ({
  data,
  isCsvDownloading,
  onCsvConvert,
}) => (
  <CsvTable
    tableToRender={StyledTable}
    onCsvConvert={onCsvConvert}
    isCsvDownloading={isCsvDownloading}
    dataSource={data}
    columns={columns}
    colouredCellsNo={1}
    scroll={{ x: 550 }}
    rightAligned={2}
  />
)

StandardMasteryDetailsTable.propTypes = {
  data: PropTypes.array,
  onCsvConvert: PropTypes.func,
  isCsvDownloading: PropTypes.bool,
}

StandardMasteryDetailsTable.defaultProps = {
  data: [],
  onCsvConvert: () => {},
  isCsvDownloading: false,
}

export default StandardMasteryDetailsTable
