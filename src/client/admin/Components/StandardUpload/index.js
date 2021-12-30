import React from 'react'
import { Table, Badge } from 'antd'
import { EduButton, notification, WithMathFormula } from '@edulastic/common'
import styled from 'styled-components'
import { saveStandard } from '../ApiForm/apis'

const columns = [
  {
    title: 'Standard',
    dataIndex: 'curriculum',
    key: 'curriculum',
    render: (curriculum, row) => (
      <div style={{ color: row.existingCurriculum ? '#ff3333' : '#33cc33' }}>
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
        style={{
          color: row.existingTlo || row.eloExits ? '#ff3333' : '#33cc33',
        }}
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
      <div style={{ color: row.existingTlo ? '#ff3333' : '#33cc33' }}>
        {tloIdentifier}
      </div>
    ),
  },
  {
    title: 'Major Standard Description',
    dataIndex: 'tloDescription',
    key: 'tloDescription',
    render: (tloDescription, row) => (
      <ParseMathDescription
        dangerouslySetInnerHTML={{
          __html: `<div style="color: ${
            row.tloDescriptionChange ? '#FF3333' : '#33CC33'
          }">${tloDescription} </div>`,
        }}
      />
    ),
  },
  {
    title: 'Minor Standard Code',
    dataIndex: 'eloIdentifier',
    key: 'eloIdentifier',
    render: (eloIdentifier, row) => (
      <div style={{ color: row.existingElo ? '#ff3333' : '#33cc33' }}>
        {eloIdentifier}
      </div>
    ),
  },
  {
    title: 'Minor Standard Description',
    dataIndex: 'eloDescription',
    key: 'eloDescription',
    render: (eloDescription, row) => (
      <ParseMathDescription
        dangerouslySetInnerHTML={{
          __html: `<div style="color: ${
            row.eloDescriptionChange ? '#FF3333' : '#33CC33'
          }">${eloDescription} </div>`,
        }}
      />
    ),
  },
]

const UploadStandard = (props) => {
  const { standardData, clearStandardData, subject } = props
  const uploadStandard = async (subjects, standardData) => {
    try {
      const result = await saveStandard(subjects, standardData)
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
      <div>
        {standardData ? (
          <EduButton
            onClick={() => {
              uploadStandard(subject, standardData)
              clearStandardData()
            }}
          >
            Save Standard
          </EduButton>
        ) : null}
        <BadgeWrapper>
          <Badge color="green" text="New standard" />
          <br />
          <Badge color="red" text="Existing standard" />
        </BadgeWrapper>
      </div>
      <Table dataSource={standardData} columns={columns} />
    </div>
  )
}

export default UploadStandard
const ParseMathDescription = WithMathFormula(styled.div``)
const BadgeWrapper = styled.div`
  float: right;
  padding-right: 10px;
`
