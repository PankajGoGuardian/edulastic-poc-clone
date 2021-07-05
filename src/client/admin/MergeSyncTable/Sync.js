import React, { useState, useEffect } from 'react'
import { Radio, Button } from 'antd'
import { SimpleConfirmModal } from '@edulastic/common'
import { Table } from '../Common/StyledComponents'

const { Group: RadioGroup } = Radio
const { Column } = Table

export default function Sync({
  schools,
  cleverId,
  syncSchools,
  atlasId,
  isClasslink,
  syncCleverOrphanUsers,
  syncEdlinkOrphanUsers,
  districtName,
}) {
  const [radioInput, setRadioInput] = useState('syncSelectedSchools')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [showSyncOrphanModal, setShowSyncOrphanModal] = useState(false)
  const reSyncSchools = () => {
    syncSchools({
      isClasslink,
      selectedSyncOption: radioInput,
      cleverId,
      atlasId,
      schoolIds: selectedRowKeys,
    })
  }

  const openSyncOrphanModal = () => {
    setShowSyncOrphanModal(true)
  }

  const proceedOrphanUsersSync = () => {
    isClasslink
      ? syncEdlinkOrphanUsers({
          districtAtlasIds: [atlasId],
        })
      : syncCleverOrphanUsers({
          districtCleverIds: [cleverId],
        })
    setShowSyncOrphanModal(false)
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
      <Button style={{ marginLeft: '10px' }} onClick={openSyncOrphanModal}>
        Sync Orphaned Users
      </Button>
      {showSyncOrphanModal && (
        <SimpleConfirmModal
          title="Sync Orphaned Users"
          description={
            <p>
              Are you sure you want to sync? It will get all the orphan users
              (admins, teachers, staff and students) shared by &nbsp;
              {districtName}.
            </p>
          }
          visible={showSyncOrphanModal}
          onProceed={proceedOrphanUsersSync}
          buttonText="Yes, Sync"
          onCancel={() => setShowSyncOrphanModal(false)}
        />
      )}
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
