import React, { useState, useEffect } from 'react'
import Radio from "antd/es/Radio";
import Button from "antd/es/Button";
import { Table } from '../Common/StyledComponents'

const { Group: RadioGroup } = Radio
const { Column } = Table

export default function Sync({
  schools,
  cleverId,
  syncSchools,
  atlasId,
  isClasslink,
}) {
  const [radioInput, setRadioInput] = useState('syncSelectedSchools')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const reSyncSchools = () => {
    syncSchools({
      isClasslink,
      selectedSyncOption: radioInput,
      cleverId,
      atlasId,
      schoolIds: selectedRowKeys,
    })
  }

  useEffect(() => {
    setSelectedRowKeys([])
  }, [cleverId])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    hideDefaultSelections: true,
  }

  return (
    <div>
      <RadioGroup
        name="syncOptions"
        value={radioInput}
        onChange={(evt) => setRadioInput(evt.target.id)}
      >
        <Radio
          key="syncSelectedSchools"
          id="syncSelectedSchools"
          value="syncSelectedSchools"
        >
          Sync Selected Schools
        </Radio>
        <Radio
          key="syncCompleteDistrict"
          id="syncCompleteDistrict"
          value="syncCompleteDistrict"
        >
          Sync Complete District
        </Radio>
      </RadioGroup>
      <Button type="primary" onClick={reSyncSchools}>
        Resync
      </Button>
      <div>
        <Table
          style={{ marginTop: '15px' }}
          rowKey={(record) => record.id}
          dataSource={schools}
          pagination={false}
          rowSelection={rowSelection}
          bordered
        >
          <Column title="School Name" dataIndex="name" key="name" />
          <Column
            title={`School ${isClasslink ? 'Edlink' : 'Clever'} Id`}
            dataIndex="id"
            key="schoolId"
          />
        </Table>
      </div>
    </div>
  )
}
