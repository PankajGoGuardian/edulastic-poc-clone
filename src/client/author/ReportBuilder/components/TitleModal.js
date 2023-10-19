import React from 'react'
import { Modal, Input } from 'antd'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

export const TitleModal = ({
  titleModalVisible,
  setTitleModalVisible,
  title,
  setTitle,
  editReport,
  setEditReport,
  handleSaveOrUpdateOfReport,
}) => {
  const handleChange = (key, value) => {
    setEditReport((prevReport) => ({ ...prevReport, [key]: value }))
  }
  return (
    <Modal
      key="modal"
      title="Save Report"
      visible={titleModalVisible}
      onOk={handleSaveOrUpdateOfReport}
      onCancel={() => setTitleModalVisible(false)}
    >
      <StyledDiv>Widget Name</StyledDiv>
      <Input
        placeholder="Widget Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <StyledDiv>Report Name</StyledDiv>
      <Input
        placeholder="Report Name"
        value={editReport.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <StyledDiv>Report Description</StyledDiv>
      <Input
        placeholder="Report Description"
        value={editReport.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
    </Modal>
  )
}

const StyledDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 3px;
  font-weight: 700;
  color: ${themeColor};
`
