import React from 'react'
import { Button, Modal, Select } from 'antd'
import { notification } from '@edulastic/common'
import { Table } from '../Common/StyledComponents'

const { Column } = Table
const { Option } = Select

const ApproveMergeModal = ({
  mappedResult,
  setMappedResult,
  setIsModalVisible,
  isModalVisible,
  handleApprove,
  mapperFieldName,
  mapperErrorMessage,
  districtMappedData,
  setMapperErrorMessage,
}) => {
  const handleMappingChange = (value, record) => {
    setMapperErrorMessage([])
    const temp = { ...mappedResult }
    if (!temp[mapperFieldName]) temp[mapperFieldName] = {}
    temp[mapperFieldName][record.id] = record.match.find(
      (element) => element.id === value
    )
    setMappedResult(temp)
  }

  const setInitialMapping = (data, id) => {
    if (!mappedResult[mapperFieldName]) mappedResult[mapperFieldName] = {}
    if (!mappedResult[mapperFieldName][id])
      mappedResult[mapperFieldName][id] = data
  }

  const compare = (a, b) => {
    return b.score - a.score
  }

  const handleCloseModal = () => {
    setMapperErrorMessage([])
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        title="Review and Approve"
        width="50%"
        height="50%"
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
              width="20%"
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
              dataIndex="match"
              render={(_data, record) => {
                _data.sort(compare)
                setInitialMapping(_data[0], record.id)
                return (
                  <Select
                    defaultValue={_data[0].name}
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
