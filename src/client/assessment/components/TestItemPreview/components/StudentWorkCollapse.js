import React from 'react'
import { Collapse } from 'antd'
import StudentWork from './StudentWork'
import { StyledCollapse } from './styled'

const { Panel } = Collapse

const StudentWorkCollapse = ({
  imageAttachments,
  isStudentWorkCollapseOpen,
  toggleStudentWorkCollapse,
}) => {
  const activeKey = isStudentWorkCollapseOpen ? ['studentWork'] : []
  return (
    <StyledCollapse
      activeKey={activeKey}
      onChange={toggleStudentWorkCollapse}
      bordered={false}
      isGhost
    >
      <Panel header="Student Work" key="studentWork">
        <StudentWork imageAttachments={imageAttachments} />
      </Panel>
    </StyledCollapse>
  )
}

export default StudentWorkCollapse
