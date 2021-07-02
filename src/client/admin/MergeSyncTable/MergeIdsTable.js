import React, { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { Button, Upload, Icon, Modal } from 'antd'
import { Table } from '../Common/StyledComponents'
import { mapCountAsType, DISABLE_SUBMIT_TITLE } from '../Data'
import ApproveMergeModal from './ApproveMergeModal'

const { Column } = Table

const orgTypesCount = [
  'schoolCount',
  'groupCount',
  'daCount',
  'saCount',
  'teacherCount',
  'studentCount',
]

const MergeIdsTable = ({
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
  mappedData = {},
  saveApprovedMapping,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [districtMappedData, setDistrictMappedData] = useState({})
  const [mappedResult, setMappedResult] = useState({})
  const [mapperFieldName, setMapperFieldName] = useState('')
  const [mapperErrorMessage, setMapperErrorMessage] = useState('')

  useEffect(() => {
    const data = mappedData[cleverId || atlasId]
    setDistrictMappedData(data || {})
  }, [JSON.stringify(mappedData)])

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

  const handleGenerateMapping = (fieldName) => {
    let type
    const eduId = districtId
    if (fieldName === 'Schools') {
      type = 'school'
    }
    if (fieldName === 'Classes') {
      type = 'class'
    }
    const payload = {
      eduId,
      type,
    }
    if (cleverId) {
      Object.assign(payload, {
        cleverId,
      })
    }
    if (atlasId) {
      Object.assign(payload, {
        atlasId,
      })
    }
    getMappingData(payload)
  }

  const handleReviewAndApprove = (fieldName) => {
    setMapperFieldName(fieldName)
    setIsModalVisible(true)
  }

  const handleApprove = () => {
    setMapperErrorMessage('')
    const eduIdList = []
    const indexes = []
    const cleverIds = Object.keys(mappedResult)
    for (let i = 1; i <= cleverIds.length; i++) {
      const existingIdIndex = eduIdList.indexOf(mappedResult[cleverIds[i - 1]])
      if (existingIdIndex > -1) {
        indexes.push(existingIdIndex + 1)
        indexes.push(i)
      }
      eduIdList.push(mappedResult[cleverIds[i - 1]])
    }
    if (indexes.length) {
      setMapperErrorMessage(
        `Same edulastic ${mapperFieldName} is mapped in rows ${indexes}`
      )
    } else {
      saveApprovedMapping({
        mapping: mappedResult,
        type: mapperFieldName === 'Schools' ? 'school' : 'class',
      })
      setIsModalVisible(false)
    }
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
        title={`${title} Id Merge report`}
        visible={showMergeResponseData}
        destroyOnClose={false}
        maskClosable={false}
        onCancel={closeMergeResponse}
        footer={[
          <Button key="back" onClick={closeMergeResponse}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            <CSVLink
              data={mergeResponseData}
              filename={`${downloadMergeType}_match_result_${districtId}.csv`}
              separator=","
              headers={headers}
              target="_blank"
            >
              Download
            </CSVLink>
          </Button>,
        ]}
        width="80%"
      >
        <Table
          rowKey={(record) => record.edulasticId}
          dataSource={mergeResponseData}
          pagination={false}
        >
          {headers.map((each) => (
            <Column title={each.label} dataIndex={each.key} key={each.key} />
          ))}
        </Table>
      </Modal>
      {isModalVisible && (
        <ApproveMergeModal
          mappedResult={mappedResult}
          setMappedResult={setMappedResult}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          handleApprove={handleApprove}
          mapperFieldName={mapperFieldName}
          mapperErrorMessage={mapperErrorMessage}
          districtMappedData={districtMappedData}
          setMapperErrorMessage={setMapperErrorMessage}
        />
      )}

      <Table
        rowKey={(record) => record.key}
        dataSource={data}
        pagination={false}
      >
        <Column title="Fields" dataIndex="fieldName" key="fieldName" />
        <Column title="Edulastic Count" dataIndex="eduCount" key="eduCount" />
        <Column title={`${title} Count`} dataIndex="count" key="count" />
        <Column
          title="Actions"
          dataIndex="isEmpty"
          key="btnName"
          render={(_, record) => {
            const { type, fieldName } = record
            return fieldName === 'Schools' || fieldName === 'Classes' ? (
              <Button onClick={() => handleGenerateMapping(fieldName)}>
                Generate Mapping
              </Button>
            ) : (
              <Upload
                aria-label="Upload"
                {...props}
                customRequest={(info) => handleUpload(info, type)}
              >
                <Button {...ButtonProps}>
                  <Icon type="upload" /> Upload
                </Button>
                {' *.csv'}
              </Upload>
            )
          }}
        />
        <Column
          title="Template"
          dataIndex="isEmpty"
          key="tempBtn"
          render={(_, record) => {
            const { type, fieldName } = record
            return fieldName === 'Schools' || fieldName === 'Classes' ? (
              <Button
                disabled={!districtMappedData[fieldName]}
                onClick={() => handleReviewAndApprove(fieldName)}
              >
                Review and Approve
              </Button>
            ) : (
              <Button {...ButtonProps}>
                <CSVLink
                  data={[]}
                  filename={`${type}_match.csv`}
                  separator=","
                  headers={templateHeaders[type]}
                  target="_blank"
                >
                  <Icon type="download" /> Download Template
                </CSVLink>
              </Button>
            )
          }}
        />
      </Table>
    </>
  )
}

export default MergeIdsTable
