import React from 'react'
import { Table } from 'antd'
import { lightGreen14, lightRed5, yellow3 } from '@edulastic/colors'
import CsvTable from '../../../author/Reports/common/components/tables/CsvTable'
import HorizontalBar from '../../../author/Reports/common/components/HorizontalBar'

const tableColumns = [
  {
    key: 'criteria',
    title: 'CRITERIA',
    dataIndex: 'type',
    align: 'left',
    fixed: 'left',
    width: 200,
  },
  {
    key: 'weight',
    title: 'WEIGHT',
    dataIndex: 'weight',
    align: 'center',
    width: 100,
  },
  {
    key: 'score',
    title: 'SCORE',
    dataIndex: 'score',
    align: 'center',
    render: (value) => {
      let color = yellow3
      if (value > 70) color = lightGreen14
      else if (value < 30) color = lightRed5
      return (
        <HorizontalBar
          data={[
            { value, color },
            { value: 100 - value, color: 'grey' },
          ]}
        />
      )
    },
  },
]

const PerformanceTable = ({ data }) => {
  return (
    <CsvTable
      dataSource={data}
      columns={tableColumns}
      tableToRender={Table}
      onCsvConvert={() => {}}
      isCsvDownloading={false}
      bordered
    />
  )
}

export default PerformanceTable
