import React from 'react'
import { Col, Row } from 'antd'
import { EduIf } from '@edulastic/common'
import { ACADEMIC } from '../../constants/form'
import { StyledTitle, StyledSectionDescription } from './styled-components'
import FormSection from './FormSection'

const Form = ({
  allFormFields,
  sectionHeaders,
  formData,
  handleFieldDataChange,
}) => {
  const EnhancedComponent = (formFields) => {
    return (
      <FormSection
        formFields={formFields}
        formData={formData}
        handleFieldDataChange={handleFieldDataChange}
      />
    )
  }

  const {
    nameAndType,
    ownerAndDescription,
    testTypeSubjectAndStandards: {
      fields: testTypeSubjectAndStandardsFields,
      sectionTitle: testTypeSubjectAndStandardsSectionTitle,
    },
    typeBandAndMetric: {
      fields: typeBandAndMetricFields,
      sectionTitle: typeBandAndMetricSectionTitle,
    },
    thresholdStartAndEndDate,
    relatedGoalsAndComment: {
      fields: relatedGoalsAndCommentFields,
      sectionTitle: relatedGoalsAndCommentSectionTitle,
    },
  } = allFormFields

  const {
    typeSectionHeader,
    targetSectionHeader,
    thresholdSectionHeader,
  } = sectionHeaders

  const { type = '' } = formData
  const showTestTypeSubjectAndStandardsSection = type === ACADEMIC

  return (
    <>
      <Row>
        <StyledSectionDescription>{typeSectionHeader}</StyledSectionDescription>
        <Col
          style={{
            paddingBottom: 20,
          }}
          span={24}
        >
          {EnhancedComponent(nameAndType)}
        </Col>
      </Row>
      <Row
        style={{
          paddingBottom: 30,
        }}
      >
        <Col span={24}>{EnhancedComponent(ownerAndDescription)}</Col>
      </Row>
      <Row>
        <StyledSectionDescription>
          {targetSectionHeader}
        </StyledSectionDescription>
        <StyledSectionDescription content={targetSectionHeader} />
        <EduIf condition={showTestTypeSubjectAndStandardsSection}>
          <Col
            style={{
              paddingBottom: 20,
            }}
            span={24}
          >
            <StyledTitle>{testTypeSubjectAndStandardsSectionTitle}</StyledTitle>
            {EnhancedComponent(testTypeSubjectAndStandardsFields)}
          </Col>
        </EduIf>
        <Col
          style={{
            paddingBottom: 30,
          }}
          span={24}
        >
          <StyledTitle>{typeBandAndMetricSectionTitle}</StyledTitle>
          {EnhancedComponent(typeBandAndMetricFields)}
        </Col>
      </Row>
      <Row style={{ borderBottom: '1px solid #D8D8D8', paddingBottom: 28 }}>
        <StyledSectionDescription>
          {thresholdSectionHeader}
        </StyledSectionDescription>
        <Col span={24}>{EnhancedComponent(thresholdStartAndEndDate)}</Col>
      </Row>
      <Row
        style={{
          paddingTop: 30,
          paddingBottom: 28,
          borderBottom: '1px solid #D8D8D8',
        }}
      >
        <StyledTitle>{relatedGoalsAndCommentSectionTitle}</StyledTitle>
        <Col span={24}>{EnhancedComponent(relatedGoalsAndCommentFields)}</Col>
      </Row>
    </>
  )
}

export default Form
