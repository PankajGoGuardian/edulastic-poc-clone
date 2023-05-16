import { Row } from 'antd'
import React from 'react'
import {
  AssessmentNameContainer,
  TestTypeTag,
} from '../../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'

const TestNamesCell = ({ preTestName, postTestName }) => {
  return (
    <Row justify="center">
      <AssessmentNameContainer>
        <TestTypeTag>PRE</TestTypeTag>
        <div className="test-name">{preTestName}</div>
      </AssessmentNameContainer>
      <AssessmentNameContainer>
        <TestTypeTag>POST</TestTypeTag>
        <div className="test-name">{postTestName}</div>
      </AssessmentNameContainer>
    </Row>
  )
}

export default TestNamesCell
