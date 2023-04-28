import React, { useState } from 'react'
import { Tooltip } from 'antd'
import {
  fadedBlack,
  greyThemeLighter,
  lightGreen14,
  lightGrey9,
  yellow3,
} from '@edulastic/colors'
import styled from 'styled-components'
import { round, sumBy } from 'lodash'
import CsvTable from '../../../author/Reports/common/components/tables/CsvTable'
import { StyledTable } from '../../../author/Reports/common/styled'
import HorizontalBar from './HorizontalBar'
import { formatName } from './utils'

const CustomStyledTable = styled(StyledTable)`
    table {
      tbody {
        tr {
          td {
            font-weight: 500;
            color: ${lightGrey9};
            font-size: 12px !important;
          }
        }
      }
    }
    .ant-table-column-title {
      white-space: nowrap !important;
    }

    .ant-table-thead {
      th {
        padding: 10px;
        color: #aaafb5;
        font-weight: 900;
        text-transform: uppercase;
        font-size: 12px;
        border: 0px;
      }
	 
	.score {
		border-right: 1px solid #E8E8E8;
		font-size: 12px;
	}
	.weight {
		border-right: 1px solid #E8E8E8;
		font-size: 12px;
	}
    }

    .ant-table-tbody {
      td {
        padding: 10px 0px 10px 8px;
        font-size: 11px;
        color: ${fadedBlack};
        font-weight: bold;
      }
    }
  }
`

const tableColumns = [
  {
    key: 'criteria',
    title: 'CRITERIA',
    dataIndex: 'type',
    align: 'left',
    fixed: 'left',
    width: 200,
    render: (value) => formatName(value),
  },
  {
    key: 'weight',
    title: 'WEIGHT',
    dataIndex: 'weight',
    align: 'center',
    width: 150,
    className: 'weight',
    render: (value) => `${value}%`,
  },
  {
    key: 'score',
    title: 'Score by Criteria',
    dataIndex: 'score',
    align: 'center',
    className: 'score',
    render: (value, record) => {
      let color = yellow3
      if (value > 70) color = lightGreen14
      else if (value < 30) color = '#FF5C5C'
      return value ? (
        <HorizontalBar
          tooltipTitle={record.metadata.feedback}
          data={[
            { value, color },
            {
              value: 100 - value,
              color: greyThemeLighter,
              showLabel: false,
            },
          ]}
        />
      ) : (
        <Tooltip title={record.metadata.feedback}>
          <div>{`${value}%`}</div>
        </Tooltip>
      )
    },
  },
]

const PerformanceTable = ({ data, setOverallScore }) => {
  const criteriasList = data.map((d) => d.type)
  const [selectedRowKeys, onSelectChange] = useState(criteriasList)
  const [checkedCriterias, setCheckedCriterias] = useState(criteriasList)
  const rawfilteredData = data.map((d) => ({ ...d, key: d.type }))
  const filteredData = data.filter((d) => checkedCriterias.includes(d.type))
  const totalWeights = sumBy(filteredData, 'weight')
  setOverallScore(
    round(
      sumBy(filteredData, ({ score, weight }) => score * weight) / totalWeights
    ) || 0
  )
  const rowSelection = {
    selectedRowKeys,
    selections: rawfilteredData,
    onChange: onSelectChange,
    onSelect: ({ type }) => {
      return setCheckedCriterias(
        checkedCriterias.includes(type)
          ? checkedCriterias.filter((i) => i !== type)
          : [...checkedCriterias, type]
      )
    },
    onSelectAll: (flag) =>
      setCheckedCriterias(flag ? data.map((d) => d.type) : []),
  }
  return (
    <CsvTable
      dataSource={rawfilteredData}
      columns={tableColumns}
      tableToRender={CustomStyledTable}
      onCsvConvert={() => {}}
      isCsvDownloading={false}
      rowSelection={rowSelection}
      bordered
    />
  )
}

export default PerformanceTable
