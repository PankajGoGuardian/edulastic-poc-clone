import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Radio, Button, Checkbox } from 'antd'
import { SimpleConfirmModal } from '@edulastic/common'
import { connect } from 'react-redux'
import { Table } from '../Common/StyledComponents'
import { setStopSyncAction, stopSyncSavingSelector } from './ducks'

const { Group: RadioGroup } = Radio
const { Column } = Table

const initialStopSyncValues = {}

function Sync({
  schools,
  cleverId,
  syncSchools,
  atlasId,
  isClasslink,
  syncCleverOrphanUsers,
  syncEdlinkOrphanUsers,
  setStopSync,
  stopSyncSaving,
  refreshExistingData,
  district: { _id: districtId, name: districtName },
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

  const [stopSyncValues, setStopSyncValues] = useState(initialStopSyncValues)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const pristine = useMemo(
    () =>
      Object.entries(stopSyncValues).every(
        ([key, value]) =>
          !!value === !!schools.find((s) => s._id === key)?.stopSync
      ),
    [stopSyncValues, schools]
  )
  const handleStopSyncChange = useCallback(
    (e) => {
      const key = typeof e === 'string' ? e : e.target.value
      setStopSyncValues((prev) => ({
        ...prev,
        [key]: typeof e === 'string' ? !prev[key] : e.target.checked,
      }))
    },
    [setStopSyncValues]
  )
  const stopSyncRenderer = useCallback(
    (_id, doc, rowNo) => {
      return (
        <div
          onClick={() => handleStopSyncChange(doc._id)}
          style={{ width: '100%', height: '100%' }}
        >
          <Checkbox
            value={doc._id}
            onChange={handleStopSyncChange}
            checked={!!stopSyncValues[doc._id]}
          />
        </div>
      )
    },
    [stopSyncValues, handleStopSyncChange]
  )
  const handleStopSyncCancel = useCallback(() => {
    setStopSyncValues(
      Object.fromEntries(schools.map((s) => [s._id, s.stopSync]))
    )
  }, [setStopSyncValues, schools])
  const handleStopSyncSave = useCallback(() => {
    const stopSyncData = {}
    Object.entries(stopSyncValues).forEach(([_id, value]) => {
      if (schools.find((s) => s._id === _id)?.stopSync !== value)
        stopSyncData[_id] = value
    })
    setStopSync({
      isClasslink,
      stopSyncData,
      districtId,
    })
  }, [stopSyncValues, isClasslink])
  useEffect(() => {
    handleStopSyncCancel()
    setIsRefreshing(false)
  }, [schools])
  useEffect(() => {
    // stopSyncSaving === null represents no action yet
    if (stopSyncSaving === false) {
      refreshExistingData()
      setIsRefreshing(true)
    }
  }, [stopSyncSaving])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
        <Button
          disabled={!pristine || stopSyncSaving || isRefreshing}
          type="primary"
          onClick={reSyncSchools}
        >
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
        <div style={{ flex: 1 }} />
        <Button
          onClick={handleStopSyncCancel}
          style={{ margin: '0 2px' }}
          type="primary"
          disabled={pristine || stopSyncSaving || isRefreshing}
        >
          Cancel
        </Button>
        <Button
          onClick={handleStopSyncSave}
          style={{ margin: '0 2px' }}
          type="primary"
          disabled={pristine || stopSyncSaving || isRefreshing}
        >
          {stopSyncSaving ? 'Saving' : 'Save'}
        </Button>
      </div>

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
          <Column
            title="Stop Sync"
            align="center"
            key="stopSync"
            dataIndex="_id"
            render={stopSyncRenderer}
          />
        </Table>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  stopSyncSaving: stopSyncSavingSelector(state),
})

const mapDispatchToProps = {
  setStopSync: setStopSyncAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Sync)
