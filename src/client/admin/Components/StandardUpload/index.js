import React from 'react'
import { Table, Badge } from 'antd'
import { EduButton, notification } from '@edulastic/common'
import { standardApi } from '@edulastic/api'

const columns = [
  {
    title: 'Standard',
    dataIndex: 'curriculum',
    key: 'curriculum',
    render: (curriculum, row) => (
      <div style={{ color: row.curriculumExits ? '#ff3333' : '#33cc33' }}>
        {curriculum}
      </div>
    ),
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
    render: (grade, row) => (
      <div
        style={{ color: row.tloExists || row.eloExits ? '#ff3333' : '#33cc33' }}
      >
        {grade}
      </div>
    ),
  },
  {
    title: 'Major Standard Code',
    dataIndex: 'tloIdentifier',
    key: 'tloIdentifier',
    render: (tloIdentifier, row) => (
      <div style={{ color: row.tloExists ? '#ff3333' : '#33cc33' }}>
        {tloIdentifier}
      </div>
    ),
  },
  {
    title: 'Major Standard Description',
    dataIndex: 'tloDescription',
    key: 'tloDescription',
    render: (tloDescription, row) => (
      <div style={{ color: row.tloDescriptionChange ? '#ff3333' : '#33cc33' }}>
        {tloDescription}
      </div>
    ),
  },
  {
    title: 'Minor Standard Code',
    dataIndex: 'eloIdentifier',
    key: 'eloIdentifier',
    render: (eloIdentifier, row) => (
      <div style={{ color: row.eloExists ? '#ff3333' : '#33cc33' }}>
        {eloIdentifier}
      </div>
    ),
  },
  {
    title: 'Minor Standard Description',
    dataIndex: 'eloDescription',
    key: 'eloDescription',
    render: (eloDescription, row) => (
      <div style={{ color: row.eloDescriptionChange ? '#ff3333' : '#33cc33' }}>
        {eloDescription}
      </div>
    ),
  },
]

const UploadStandard = (props) => {
  const { standardData, clearStandardData, subject } = props
  const uploadStandard = async (subjects) => {
    try {
      const result = await standardApi.saveStandard(subjects)
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
      {standardData ? (
        <EduButton
          onClick={() => {
            uploadStandard(subject)
            clearStandardData()
          }}
        >
          Save Standard
        </EduButton>
      ) : null}
      <div
        style={{
          float: 'right',
          position: 'relative',
          left: '-10px',
          top: '-25px',
        }}
      >
        <Badge color="green" text="New standard" />
        <br />
        <Badge color="red" text="Existing standard" />
      </div>
      <Table dataSource={standardData} columns={columns} />
    </div>
  )
}

export default UploadStandard
