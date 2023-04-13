import React from 'react'
import { Table, Badge } from 'antd'
import { EduButton, notification, EduIf } from '@edulastic/common'
import { saveMultiStandardMapping } from '../ApiForm/apis'
import { themeColorLight, red } from '@edulastic/colors'
import styled from 'styled-components'

const columns = [
  {
    title: 'StandardId',
    dataIndex: 'standardId',
    key: 'standardId',
    render: (standardId, row) => (
      <div
        style={{ color: row.mappingExists === 'true' ? red : themeColorLight }}
      >
        {standardId}
      </div>
    ),
  },
  {
    title: 'Equivalent StandardId',
    dataIndex: 'equivalentStandardId',
    key: 'equivalentStandardId',
    render: (equivalentStandardId, row) => (
      <div
        style={{ color: row.mappingExists === 'true' ? red : themeColorLight }}
      >
        {equivalentStandardId}
      </div>
    ),
  },
]

const UploadMultiStandardMapping = (props) => {
  const { multiStandardMappingData, clearStandardData } = props
  const mappingData = multiStandardMappingData?.map((doc) => ({
    standardId: doc.split('_')[0],
    equivalentStandardId: doc.split('_')[1],
    mappingExists: doc.split('_')[2],
  }))
  const uploadMultiStandardMapping = async (data) => {
    try {
      const result = await saveMultiStandardMapping(data)
      notification({
        type: 'success',
        msg: result.data.result.message,
      })
      clearStandardData()
    } catch (error) {
      notification({ msg: error.message, messageKey: 'apiFormErr' })
    }
  }

  return (
    <div>
      <EduIf condition={multiStandardMappingData}>
        <EduButton
          onClick={() => {
            uploadMultiStandardMapping(multiStandardMappingData)
            clearStandardData()
          }}
        >
          Save Multi Standard Mapping
        </EduButton>
        <BadgeWrapper>
          <Badge color={themeColorLight} text="New multi standard mapping" />
          <br />
          <Badge color={red} text="Existing multi standard mapping" />
        </BadgeWrapper>
      </EduIf>
      <Table dataSource={mappingData} columns={columns} />
    </div>
  )
}

export default UploadMultiStandardMapping
const BadgeWrapper = styled.div`
  float: right;
  padding-right: 10px;
`
