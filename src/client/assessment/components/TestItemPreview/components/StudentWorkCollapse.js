import React from 'react'
import { Collapse } from 'antd'
import StudentWork from './StudentWork'

const { Panel } = Collapse

const StudentWorkCollapse = ({ imageAttachments, renderScratchPadImage }) => {
  return (
    <Collapse
      defaultActiveKey={[1]}
      bordered={false}
      style={{ paddingBottom: '30px' }}
    >
      <Panel header="Student Work" key="1">
        <StudentWork
          imageAttachments={imageAttachments}
          renderScratchPadImage={renderScratchPadImage}
        />
      </Panel>
    </Collapse>
  )
}

export default StudentWorkCollapse
