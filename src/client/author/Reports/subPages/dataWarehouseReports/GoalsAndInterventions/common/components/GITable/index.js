import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { GOAL } from '../../../constants/form'
import { actions } from '../../../ducks/actionReducers'
import {
  isInterventionsDataLoading,
  relatedInterventions,
} from '../../../ducks/selectors'
import { getDataSourceForGI, getSummaryStatusRecords } from '../../utils'
import StatusBox from './StatusBox'
import SummaryTile from './SummaryTile'
import getGITableColumns from './columns'
import './index.scss'
import { statusList } from '../../../constants/common'

const GITable = ({
  type,
  loading,
  data,
  getInterventionData,
  expandedData,
  expandDataLoading,
  groupList,
  onEdit,
  updateGIData,
}) => {
  const [expandedKey, setExpandedKey] = useState([])
  const [tableData, setTableData] = useState(data)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    setTableData(data)
  }, [data])

  const GITableColumns = getGITableColumns({ onEdit, updateGIData })

  const _statusList = statusList(data || [])

  const onExpand = (expanded, record) => {
    getInterventionData({
      id: record._id,
      interventionIds: record.relatedInterventionIds.join(','),
    })
  }

  const onExpandedRowsChange = (expandedRows) => setExpandedKey(expandedRows)

  const onChange = () => {
    setExpandedKey([])
  }

  const getRowClassName = (record) => {
    if (
      !record.relatedInterventionIds ||
      record?.relatedInterventionIds?.length === 0
    ) {
      return 'not-expandible'
    }
  }

  const filterTableData = (status) => {
    const records = getSummaryStatusRecords({ key: status, data, count: false })
    if (selectedStatus !== status) {
      setSelectedStatus(status)
      setTableData(records)
    } else {
      setSelectedStatus('')
      setTableData(data)
    }
  }

  const TableTitle = () => (
    <Header>
      {_statusList[type].map((ele) =>
        ele.items ? (
          <StatusBox
            key={ele.key}
            items={ele.items}
            handleClick={filterTableData}
            selectedStatus={selectedStatus}
          />
        ) : (
          <SummaryTile
            {...ele}
            handleClick={filterTableData}
            selectedStatus={selectedStatus}
          />
        )
      )}
    </Header>
  )

  const ExpandedRow = ({ _id }) => (
    <Table
      className="gi-table"
      columns={GITableColumns}
      loading={expandDataLoading && !expandedData?.[_id]}
      dataSource={
        expandedData ? getDataSourceForGI(expandedData[_id], groupList) : []
      }
      pagination={false}
      showHeader={false}
    />
  )

  return (
    <Table
      loading={loading}
      className="gi-table"
      title={TableTitle}
      columns={GITableColumns}
      rowClassName={getRowClassName}
      expandedRowRender={type === GOAL ? ExpandedRow : undefined}
      onExpand={onExpand}
      onExpandedRowsChange={onExpandedRowsChange}
      expandedRowKeys={expandedKey}
      onChange={onChange}
      pagination={false}
      dataSource={tableData}
      scroll={{ y: 390, x: 'max-content' }}
    />
  )
}

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .status-box {
    flex: 1;
  }
`

export default connect(
  (state) => ({
    expandedData: relatedInterventions(state),
    expandDataLoading: isInterventionsDataLoading(state),
  }),
  {
    getInterventionData: actions.getInterventionsList,
  }
)(GITable)
