import React, { useEffect, useState } from 'react'
import { Button, Modal, Select } from 'antd'
import { Table } from '../Common/StyledComponents'
import { DISABLE_SUBMIT_TITLE, mapCountAsType } from '../Data'

const { Column } = Table
const { Option } = Select

const orgTypesCount = [
  'schoolCount',
  'groupCount',
  'daCount',
  'saCount',
  'teacherCount',
  'studentCount',
]

const ApproveMergeModal = ({
  eduCounts,
  countsInfo,
  uploadCSV,
  districtId,
  cleverId,
  atlasId,
  isClasslink,
  mergeResponse,
  closeMergeResponse,
  disableFields,
  getMappingData,
  mappedData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [districtMappedData, setDistrictMappedData] = useState({})
  const [mappedResult, setMappedResult] = useState({})
  const [mapperFieldName, setMapperFieldName] = useState('')
  const [mapperErrorMessage, setMapperErrorMessage] = useState([])

  useEffect(() => {
    const data = mappedData[cleverId || atlasId]
    setDistrictMappedData(data || {})
  }, [mappedData])

  const {
    data: mergeResponseData,
    showData: showMergeResponseData,
    mergeType: downloadMergeType,
  } = mergeResponse
  const ButtonProps = disableFields
    ? { disabled: disableFields, title: DISABLE_SUBMIT_TITLE }
    : {}

  const handleUpload = (info, mergeType) => {
    try {
      const { file } = info
      uploadCSV({
        districtId,
        cleverId,
        atlasId,
        isClasslink,
        mergeType,
        file,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const compare = (a, b) => {
    return b.score - a.score
  }

  const setInitialMappedResult = (arr, fieldName) => {
    const InititalMapping = {}
    arr.forEach((_data) => {
      InititalMapping[_data.id] = _data.match[0] || {}
    })
    setMappedResult((_previousMappedResult) => {
      _previousMappedResult[fieldName] = InititalMapping
      return { ..._previousMappedResult }
    })
  }

  const handleGenerateMapping = (fieldName) => {
    let type
    const lmsId = cleverId || atlasId
    const eduId = districtId
    if (fieldName === 'Schools') {
      type = 'school'
    }
    if (fieldName === 'Classes') {
      type = 'class'
    }
    getMappingData({
      cleverId: lmsId,
      eduId,
      type,
    })
  }

  const handleReviewAndApprove = (fieldName) => {
    setMapperFieldName(fieldName)
    setIsModalVisible(true)
  }

  const handleMappingChange = (value, record) => {
    const temp = { ...mappedResult }
    temp[mapperFieldName][record.id] = record.match.find(
      (element) => element.id === value
    )
    setMappedResult(temp)
  }

  const handleApprove = () => {
    setMapperErrorMessage([])
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
    alert('handleApproved Clicked')
  }

  const props = {
    accept: '.csv',
    multiple: false,
    showUploadList: false,
  }

  const data = orgTypesCount.map((item, i) => ({
    key: i,
    type: mapCountAsType[item].type,
    fieldName: mapCountAsType[item].name,
    eduCount: eduCounts[item] || '-',
    count: countsInfo[item] || '-',
    isEmpty: !eduCounts[item] && !countsInfo[item],
    isMatching: eduCounts[item] === countsInfo[item],
  }))

  const cleverHeaders = [
    { label: 'Edulastic Id', key: 'edulasticId' },
    { label: 'Clever Id', key: 'cleverId' },
    { label: 'Status', key: 'status' },
  ]

  const classlinkHeaders = [
    { label: 'Edulastic Id', key: 'edulasticId' },
    { label: 'Edlink Id', key: 'atlasId' },
    { label: 'Status', key: 'status' },
  ]

  const headers = isClasslink ? classlinkHeaders : cleverHeaders
  const title = isClasslink ? 'Edlink' : 'Clever'

  const templateHeaders = {
    sch: ['school_id', 'id'],
    cls: ['edu_class_section_id', isClasslink ? 'atlas_id' : 'clever_id'],
    tch: ['user_id', 'id'],
    stu: ['user_id', 'id'],
    sa: ['user_id', 'id'],
    da: ['user_id', 'id'],
  }

  return (
    <>
      <Modal
        title="Review and Approve"
        width="50%"
        height="50%"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleApprove}>
            Approve
          </Button>,
        ]}
      >
        <ul>
          {mapperErrorMessage.length > 0
            ? mapperErrorMessage.map((errorMsg) => <li>{errorMsg}</li>)
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
              key="id"
              render={(_, __, idx) => idx + 1}
            />
            <Column
              title={`Clever ${mapperFieldName}`}
              dataIndex="name"
              key="id"
              render={(_data) => _data}
            />
            <Column
              title={`Edulastic ${mapperFieldName}`}
              dataIndex="match"
              key="id"
              render={(_data, record) => {
                return (
                  <Select
                    defaultValue={
                      mappedResult[mapperFieldName][record.id].name || 'NA'
                    }
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
          <h1>loading</h1>
        )}
      </Modal>
    </>
  )
}

export default ApproveMergeModal
