import React, { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { Button, Icon, Modal, Upload } from 'antd'
import { compact, isEmpty } from 'lodash'
import moment from 'moment'
import { Table } from '../Common/StyledComponents'
import { DISABLE_SUBMIT_TITLE, mapCountAsType } from '../Data'
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
  mappedDataLoading,
  unSetMappedData,
  generateMappedData,
  mappedDataInfo,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [districtMappedData, setDistrictMappedData] = useState({})
  const [mapperFieldName, setMapperFieldName] = useState('')
  const [mapperErrorMessage, setMapperErrorMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  let lastClassMapDataGeneratedDate = ''
  let lastSchoolMapDataGeneratedDate = ''
  if (!isEmpty(mappedDataInfo)) {
    mappedDataInfo.forEach((o) => {
      if (o._id === 'school') {
        lastSchoolMapDataGeneratedDate = o.createdAt
      }
      if (o._id === 'class') {
        lastClassMapDataGeneratedDate = o.createdAt
      }
    })
  }
  useEffect(() => {
    const data = mappedData[cleverId || atlasId]
    setDistrictMappedData(data || {})
  }, [mappedData, districtId])

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

  const getPayload = (fieldName) => {
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
    return { type, payload }
  }

  const handleGenerateMapping = (
    fieldName,
    pageNumber = 1,
    isNewGenerateDataCall
  ) => {
    const { type, payload } = getPayload(fieldName)
    generateMappedData(payload)
    setCurrentPage(pageNumber)
    if (isNewGenerateDataCall) {
      unSetMappedData({
        type,
        dcId: cleverId || atlasId,
      })
    }
  }

  const handleReviewAndApprove = (fieldName) => {
    const { payload } = getPayload(fieldName)
    getMappingData({ ...payload, page: 1 })
    setMapperFieldName(fieldName)
    setIsModalVisible(true)
    setCurrentPage(1)
  }

  const handleApprove = (mappedResult, formattedData) => {
    setMapperErrorMessage('')
    const eduIdMap = {}
    const indexes = []
    let cleverIds
    if (mapperFieldName === 'Schools') {
      cleverIds = formattedData.map((data) =>
        mapperFieldName === 'Schools' ? data.lmsSchoolId : data.lmsClassId
      )
    } else {
      cleverIds = Object.keys(mappedResult)
    }

    for (let i = 1; i <= cleverIds.length; i++) {
      const eduId =
        mapperFieldName === 'Schools'
          ? mappedResult[cleverIds[i - 1]]
          : mappedResult[cleverIds[i - 1]]?.id || null
      if (eduId) {
        const existingId = eduIdMap[eduId]
        if (!existingId) eduIdMap[eduId] = []
        eduIdMap[eduId].push(
          mapperFieldName === 'Schools' ? i : mappedResult[cleverIds[i - 1]].row
        )
      }
    }
    for (const key of Object.keys(eduIdMap)) {
      if (eduIdMap[key].length > 1) {
        indexes.push(...eduIdMap[key])
      }
    }
    if (indexes.length) {
      setMapperErrorMessage(
        `Same edulastic ${mapperFieldName} is mapped in rows ${compact(
          indexes
        )}`
      )
    } else {
      const mappedDataResult = {}
      cleverIds.forEach((_cleverId, i) => {
        mappedDataResult[_cleverId] =
          mapperFieldName === 'Schools'
            ? mappedResult[cleverIds[i]]
            : mappedResult[cleverIds[i]]?.id || null
      })
      saveApprovedMapping({
        districtId,
        mapping: mappedDataResult,
        type: mapperFieldName === 'Schools' ? 'school' : 'class',
        lmsType: atlasId ? 'atlas' : 'clever',
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

  const isDisableReviewButton = (fieldName) => {
    let isDisabled = true
    if (fieldName === 'Schools' && lastSchoolMapDataGeneratedDate) {
      isDisabled = false
    }
    if (fieldName === 'Classes' && lastClassMapDataGeneratedDate) {
      isDisabled = false
    }
    return isDisabled
  }

  const getLastGeneratedMappingTime = (fieldName) => {
    if (fieldName === 'Schools' && lastSchoolMapDataGeneratedDate) {
      return moment(lastSchoolMapDataGeneratedDate)
        .format('MMM DD YY HH:mm')
        .toString()
    }
    if (fieldName === 'Classes' && lastClassMapDataGeneratedDate) {
      return moment(lastClassMapDataGeneratedDate)
        .format('MMM DD YY HH:mm')
        .toString()
    }
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
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          handleApprove={handleApprove}
          mapperFieldName={mapperFieldName}
          mapperErrorMessage={mapperErrorMessage}
          districtMappedData={districtMappedData}
          setMapperErrorMessage={setMapperErrorMessage}
          getPayload={getPayload}
          getMappingData={getMappingData}
          mappedDataLoading={mappedDataLoading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      <Table
        rowKey={(record) => record.key}
        dataSource={data}
        pagination={false}
      >
        <Column
          title="Fields"
          dataIndex="fieldName"
          key="fieldName"
          width="15%"
        />
        <Column
          title="Edulastic Count"
          dataIndex="eduCount"
          key="eduCount"
          width="15%"
        />
        <Column
          title={`${title} Count`}
          dataIndex="count"
          key="count"
          width="15%"
        />
        <Column
          title="Actions"
          dataIndex="isEmpty"
          key="btnName"
          width="35%"
          render={(_, record) => {
            const { type, fieldName } = record
            return fieldName === 'Schools' || fieldName === 'Classes' ? (
              <>
                <Button
                  onClick={() => handleGenerateMapping(fieldName, 1, true)}
                >
                  Generate Mapping
                </Button>
                <span style={{ display: 'inline-flex' }}>
                  Last Generated on:{' '}
                  {getLastGeneratedMappingTime(fieldName) || '...'}
                </span>
              </>
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
          width="20%"
          render={(_, record) => {
            const { type, fieldName } = record
            return fieldName === 'Schools' || fieldName === 'Classes' ? (
              <Button
                disabled={isDisableReviewButton(fieldName)}
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
