import React from 'react'
import { Modal, Input } from 'antd'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

export const TitleModal = ({
  titleModalVisible,
  setTitleModalVisible,
  title,
  setTitle,
  reportTitle,
  setReportTitle,
  reportDescription,
  setReportDescription,
  handleSaveOrUpdateOfReport,
}) => {
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
        value={reportTitle}
        onChange={(e) => setReportTitle(e.target.value)}
      />
      <StyledDiv>Report Description</StyledDiv>
      <Input
        placeholder="Report Description"
        value={reportDescription}
        onChange={(e) => setReportDescription(e.target.value)}
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
