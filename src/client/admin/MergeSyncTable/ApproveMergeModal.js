import React, { useState } from 'react'
import { Button, Modal, Select } from 'antd'
import { notification } from '@edulastic/common'
import { Table } from '../Common/StyledComponents'

const { Column } = Table
const { Option } = Select

const ApproveMergeModal = ({
  setIsModalVisible,
  isModalVisible,
  mapperFieldName,
  districtMappedData,
}) => {
  const [mappedResult, setMappedResult] = useState({})
  const [mapperErrorMessage, setMapperErrorMessage] = useState([])

  const handleMappingChange = (value, record) => {
    setMapperErrorMessage([])
    const temp = { ...mappedResult }
    if (!temp[mapperFieldName]) temp[mapperFieldName] = {}
    temp[mapperFieldName][record.id] = record.eduData.find(
      (element) => element.id === value
    )
    setMappedResult(temp)
  }

  const setInitialMapping = (data, id) => {
    if (!mappedResult[mapperFieldName]) mappedResult[mapperFieldName] = {}
    if (!mappedResult[mapperFieldName][id])
      mappedResult[mapperFieldName][id] = data
  }

  const handleCloseModal = () => {
    setMapperErrorMessage([])
    setIsModalVisible(false)
  }

  const isAllFieldsMapped = () => {
    for (const key in mappedResult[mapperFieldName]) {
      if (!mappedResult[mapperFieldName][key]) return false
    }
    console.log('entered outside')
    return true
  }

  const handleApprove = () => {
    setMapperErrorMessage([])
    if (isAllFieldsMapped()) {
      const cIds = districtMappedData[mapperFieldName].map((_c) => _c.id)
      const map = {}
      Object.keys(mappedResult[mapperFieldName]).forEach((key) => {
        const value = mappedResult[mapperFieldName][key].id
        if (!map[value]) map[value] = []
        map[value].push(cIds.indexOf(key) + 1)
      })
      const errorMessages = []
      Object.keys(map).forEach((key) => {
        if (map[key].length > 1) {
          const errorMsg = `Same edulastic school is mapped in row ${map[
            key
          ].toString()}`
          errorMessages.push(errorMsg)
        }
      })
      if (errorMessages.length > 0) setMapperErrorMessage(errorMessages)
      else {
        const mapDataToBeSent = {}
        Object.keys(mappedResult[mapperFieldName]).forEach((key) => {
          mapDataToBeSent[key] = mappedResult[mapperFieldName][key].id
        })
        console.log('mapDataToBeSent', mapDataToBeSent)
      }
    } else {
      setMapperErrorMessage(['Please Map all the Fields '])
    }
  }

  return (
    <>
      <Modal
        title="Review and Approve"
        width="95%"
        centered
        bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleApprove}>
            Approve
          </Button>,
        ]}
      >
        <ul>
          {mapperErrorMessage.length > 0
            ? notification({ msg: mapperErrorMessage.toString() })
            : null}
        </ul>
        {districtMappedData ? (
          <Table
            rowKey={(record) => record.id}
            dataSource={districtMappedData[mapperFieldName]}
            pagination={false}
          >
            <Column
              title="S No."
              width="15%"
              render={(_, __, idx) => idx + 1}
            />
            <Column
              title={`Clever ${mapperFieldName}`}
              dataIndex="name"
              key="name"
              render={(_data) => _data}
            />
            <Column
              title={`Edulastic ${mapperFieldName}`}
              dataIndex="eduData"
              key="eduData"
              render={(_data, record) => {
                console.log('sorting.....')
                setInitialMapping(record.match, record.id)
                return (
                  <Select
                    showSearch
                    defaultValue={record.match ? record.match.name : null}
                    dropdownStyle={{ zIndex: 2000 }}
                    style={{ width: '90%' }}
                    bordered={false}
                    onChange={(value) => handleMappingChange(value, record)}
                  >
                    {_data.map((val) => (
                      <Option key={val.id} value={val.id}>
                        {val.name}
                      </Option>
                    ))}
                  </Select>
                )
              }}
            />
          </Table>
        ) : (
          <h1>loading...</h1>
        )}
      </Modal>
    </>
  )
}

export default ApproveMergeModal
