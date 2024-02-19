import React, { useEffect, useState } from 'react'
import { Select, Table, Button } from 'antd'
import { dataWarehouseApi } from '@edulastic/api'
import adminTool from '@edulastic/api/src/adminTool'
import { differenceWith, isEqual } from 'lodash'

import {
  ButtonContainer,
  FeedTypeContainer,
  SelectContainer,
  Wrapper,
} from './styled'
import DeleteFeedType from './DeleteFeedType'
import OrgSearchForm from '../../Common/Form/OrgSearchForm'

const { Option } = Select
const studentIdentifiers = ['sis_id', 'state_id', 'student_number']
const EnableDataTypes = () => {
  const [districtId, setDistrictId] = useState()
  const [districtGroupId, setDistrictGroupId] = useState()
  const [feedTypes, setFeedTypes] = useState([])
  const [distinctFeedTypes, setDistinctFeedTypes] = useState([])
  const [updatedFeedTypes, setUpdatedFeedTypes] = useState([])
  const [feedTypeToBeEnabled, setFeedTypeToBeEnabled] = useState()
  const [selectedFeedType, setSelectedFeedType] = useState()

  // States for loaders
  const [enableLoading, setEnableLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [distinctFeedLoading, setDistinctFeedLoading] = useState(false)

  const fetchFeedTypes = async () => {
    setLoading(true)
    const res = await dataWarehouseApi.getFeedTypes({
      districtId,
      districtGroupId,
    })
    setFeedTypes(res?.result)
    setUpdatedFeedTypes(res?.result)
    setLoading(false)
  }
  const fetchDistinctFeedTypes = async () => {
    setDistinctFeedLoading(true)
    const res = await adminTool.getDistinctFeedTypes()
    setDistinctFeedTypes(res?.result)
    setDistinctFeedLoading(false)
  }

  const handleIdentifierChange = (identifier, feedType) => {
    const modifiedIdentifiersFeedTypes = updatedFeedTypes.map((fType) => {
      if (feedType?.key === fType.key) {
        return { ...fType, studentIdentifier: identifier }
      }
      return fType
    })

    setUpdatedFeedTypes(modifiedIdentifiersFeedTypes)
  }
  const getDataToBeUpdated = () =>
    differenceWith(updatedFeedTypes, feedTypes, isEqual)

  const handleUpdate = async () => {
    const data = getDataToBeUpdated()
    const feedTypeMapToStudentIdentifier = {}

    data.forEach((feedType) => {
      feedTypeMapToStudentIdentifier[feedType?.key] =
        feedType?.studentIdentifier
    })
    setUpdateLoading(true)
    await adminTool.updateFeedType({
      districtId,
      districtGroupId,
      feedTypeMapToStudentIdentifier,
    })
    setUpdateLoading(false)
    fetchFeedTypes()
  }

  const filteredFeedTypes = () => {
    return distinctFeedTypes?.filter(
      (dft) => !feedTypes?.find((ft) => ft?.key === dft?.key)
    )
  }

  const clearFields = () => {
    setSelectedFeedType(undefined)
    setFeedTypeToBeEnabled([])
  }

  const handleEnableSelected = async () => {
    if (districtId || districtGroupId) {
      setEnableLoading(true)
      await adminTool.insertFeedType({
        districtId,
        districtGroupId,
        feedTypes: feedTypeToBeEnabled,
      })
      fetchFeedTypes()
      clearFields()
      setEnableLoading(false)
    }
  }
  const handleFeedToBeEnabledChange = (value) => {
    setSelectedFeedType(value)
    const data = distinctFeedTypes?.filter((dft) => value?.includes(dft?.key))
    setFeedTypeToBeEnabled(data)
  }

  const setOrg = (org) => {
    if (org?.districtGroupId) {
      setDistrictGroupId(org.districtGroupId)
    } else if (org?.district) {
      setDistrictId(org.district._id)
    }
  }

  useEffect(() => {
    fetchDistinctFeedTypes()
  }, [])

  useEffect(() => {
    if (districtId || districtGroupId) {
      fetchFeedTypes()
    }
  }, [districtId, districtGroupId])

  const columns = [
    {
      title: 'Feed Type',
      dataIndex: 'key',
      key: 'feedType',
    },
    {
      title: 'Student Identifier',
      dataIndex: 'studentIdentifier',
      key: 'identifier',
      render: (studentIdentifier, record) => (
        <Select
          style={{ width: '70%' }}
          defaultValue={studentIdentifier}
          placeholder="Select Identifier"
          onChange={(val) => handleIdentifierChange(val, record)}
        >
          {studentIdentifiers?.map((identifier) => (
            <Option value={identifier}>{identifier}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <DeleteFeedType
          feedTypeDetails={record}
          districtId={districtId}
          districtGroupId={districtGroupId}
          fetchFeedTypes={fetchFeedTypes}
        />
      ),
    },
  ]

  return (
    <Wrapper>
      <OrgSearchForm setOrg={setOrg} />
      <Table
        pagination={false}
        bordered
        dataSource={feedTypes}
        columns={columns}
        loading={loading}
      />
      <ButtonContainer>
        <Button
          disabled={!getDataToBeUpdated()?.length}
          loading={updateLoading}
          type="primary"
          onClick={handleUpdate}
        >
          Update
        </Button>
      </ButtonContainer>
      <FeedTypeContainer>
        <h3>Enable new Feed Type</h3>
        <SelectContainer>
          <span>Select Feed Type(s):</span>
          <Select
            mode="multiple"
            style={{ width: '60%' }}
            placeholder="Select Feed Type"
            value={selectedFeedType}
            onChange={handleFeedToBeEnabledChange}
            notFoundContent={distinctFeedLoading && 'loading...'}
          >
            {filteredFeedTypes()?.map((feedType) => (
              <Option value={feedType?.key}>{feedType?.key}</Option>
            ))}
          </Select>
          <Button
            disabled={
              !(districtId || districtGroupId) || !filteredFeedTypes()?.length
            }
            loading={enableLoading}
            type="primary"
            onClick={handleEnableSelected}
          >
            Enable Selected
          </Button>
        </SelectContainer>
      </FeedTypeContainer>
    </Wrapper>
  )
}

export default EnableDataTypes
