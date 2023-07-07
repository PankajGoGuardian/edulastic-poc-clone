import React from 'react'
import { Row, Col, Spin, Icon, Input } from 'antd'
import { EduIf } from '@edulastic/common'
import { FormLabel } from '../../common/QuestionForm'
import { RightAlignedCol } from '../QuestionChoice/styled-components'

const { TextArea } = Input

const VideoQuizStimulus = ({
  type,
  stimulus,
  generateViaAI,
  loading,
  onUpdate,
}) => {
  const handleStimulusChange = (value) => {
    const updateData = {
      stimulus: value,
    }
    onUpdate(updateData)
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <FormLabel>Stimulus</FormLabel>
        </Col>
        <RightAlignedCol span={12}>
          <a onClick={() => generateViaAI(type)}>Generate via AI</a>
          <EduIf condition={loading}>
            <Spin size="small" indicator={<Icon type="loading" />} />
          </EduIf>
        </RightAlignedCol>
      </Row>
      <TextArea
        style={{ height: 120, resize: 'none' }}
        onChange={(e) => handleStimulusChange(e?.target?.value || '')}
        placeholder="Enter your question"
        value={stimulus}
      />
    </>
  )
}

export default VideoQuizStimulus
