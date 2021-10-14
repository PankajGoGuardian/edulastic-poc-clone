import { Table } from 'antd'
import React from 'react'
import {
  StyledHeading1,
  StyledRow,
} from '../../../admin/Common/StyledComponents/settingsContent'

const COLUMNS = [
  {
    title: 'Record Type',
    dataIndex: 'recordType',
  },
  {
    title: 'Existing',
    dataIndex: 'existing',
  },
  {
    title: 'Created',
    dataIndex: 'created',
  },
  {
    title: 'Updated',
    dataIndex: 'updated',
  },
  {
    title: 'Errors',
    dataIndex: 'errors',
  },
]

const LastUploadTable = ({}) => {
  return (
    <StyledRow>
      <StyledHeading1>Last Attempted Upload</StyledHeading1>
      <StyledRow>
        <Table columns={COLUMNS} dataSource={[]} />
      </StyledRow>
    </StyledRow>
  )
}

export default LastUploadTable
