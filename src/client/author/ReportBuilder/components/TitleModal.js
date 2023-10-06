import React from 'react'
import { Modal, Input } from 'antd'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

const TitleModal = ({
  titleModalVisible,
  setTitleModalVisible,
  finalTitle,
  setTitle,
  finalReportTitle,
  setReportTitle,
  finalReportDescription,
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
        value={finalTitle}
        onChange={(e) => setTitle(e.target.value)}
      />
      <StyledDiv>Report Name</StyledDiv>
      <Input
        placeholder="Report Name"
        value={finalReportTitle}
        onChange={(e) => setReportTitle(e.target.value)}
      />
      <StyledDiv>Report Description</StyledDiv>
      <Input
        placeholder="Report Description"
        value={finalReportDescription}
        onChange={(e) => setReportDescription(e.target.value)}
      />
    </Modal>
  )
}

export default TitleModal

const StyledDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 3px;
  font-weight: 700;
  color: ${themeColor};
`
