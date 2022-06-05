import React, { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { Button, Icon, Modal, Upload } from 'antd'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { notification } from '@edulastic/common'
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
  totalLmsCounts,
  edulasticTotalCounts,
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
  unSetDuplicateMappedData,
  duplicateMappedData,
  isApproveModalVisible,
  toggleApproveModal,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [districtMappedData, setDistrictMappedData] = useState({})
  const [mapperFieldName, setMapperFieldName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [duplicateRows, setDuplicateRows] = useState([])

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

  useEffect(() => {
    duplicateMappedData?.[mapperFieldName]?.length > 0 &&
      setDuplicateRows(duplicateMappedData[mapperFieldName])
  }, [duplicateMappedData, mapperFieldName])

  useEffect(() => {
    isApproveModalVisible && setIsModalVisible(true)
    !isApproveModalVisible && setIsModalVisible(false)
  }, [isApproveModalVisible, toggleApproveModal])

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
    setDuplicateRows([])
    const { payload } = getPayload(fieldName)
    getMappingData({ ...payload, page: 1 })
    setMapperFieldName(fieldName)
    setCurrentPage(1)
    toggleApproveModal(true)
  }

  const handleApprove = (mappedResult, formattedData, filterValue) => {
    setDuplicateRows([])
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
          mapperFieldName === 'Schools'
            ? {
                cleverId: cleverIds[i - 1],
                row: i,
              }
            : {
                cleverId: cleverIds[i - 1],
                row: mappedResult[cleverIds[i - 1]].row,
              }
        )
      }
    }
    const duplicateRowData = []
    for (const key of Object.keys(eduIdMap)) {
      if (eduIdMap[key].length > 1) {
        eduIdMap[key].forEach((_data) => {
          indexes.push(_data.row)
          duplicateRowData.push(_data.cleverId)
        })
      }
    }
    if (indexes.length) {
      setDuplicateRows(duplicateRowData)
      notification({
        msg: `Same edulastic ${mapperFieldName} is mapped in rows ${indexes
          .join(', ')
          .trim()}`,
        duration: 0,
      })
    } else {
      const mappedDataResult = {}
      cleverIds.forEach((_cleverId, i) => {
        mappedDataResult[_cleverId] =
          mapperFieldName === 'Schools'
            ? mappedResult[cleverIds[i]]
            : mappedResult[cleverIds[i]]?.id || null
      })
      const savingMappingData = {
        districtId,
        mapping: mappedDataResult,
        type: mapperFieldName === 'Schools' ? 'school' : 'class',
        lmsType: atlasId ? 'atlas' : 'clever',
      }
      if (mapperFieldName === 'Classes') {
        savingMappingData.filter = filterValue
      }
      saveApprovedMapping(savingMappingData)
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
    edulasticTotalCount: edulasticTotalCounts[item] || '-',
    totalLmsCount: totalLmsCounts[item] || '-',
    count: countsInfo[item] || '-',
    isEmpty: !totalLmsCounts[item] && !countsInfo[item],
    isMatching: totalLmsCounts[item] === countsInfo[item],
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
          districtMappedData={districtMappedData}
          getPayload={getPayload}
          getMappingData={getMappingData}
          mappedDataLoading={mappedDataLoading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          cleverId={cleverId}
          duplicateRows={duplicateRows}
          unSetDuplicateMappedData={unSetDuplicateMappedData}
          duplicateMappedData={duplicateMappedData}
          toggleApproveModal={toggleApproveModal}
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
          width="14%"
        />
        <Column
          title="Edulastic Count"
          dataIndex="edulasticTotalCount"
          key="edulasticTotalCount"
          width="12%"
        />
        <Column
          title={`${title} Edu Count`}
          dataIndex="totalLmsCount"
          key="totalLmsCount"
          width="12%"
        />
        <Column
          title={`${title} Count`}
          dataIndex="count"
          key="count"
          width="12%"
        />
        <Column
          title="Actions"
          dataIndex="isEmpty"
          key="btnName"
          width="30%"
          render={(_, record) => {
            const { type, fieldName } = record
            return fieldName === 'Schools' || fieldName === 'Classes' ? (
              <>
                <Button
                  onClick={() => handleGenerateMapping(fieldName, 1, true)}
                  disabled={disableFields}
                >
                  Generate Mapping
                </Button>
                {getLastGeneratedMappingTime(fieldName) && (
                  <span style={{ display: 'inline-flex' }}>
                    {`Last Generated on: ${getLastGeneratedMappingTime(
                      fieldName
                    )}`}
                  </span>
                )}
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
                disabled={isDisableReviewButton(fieldName) || disableFields}
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
