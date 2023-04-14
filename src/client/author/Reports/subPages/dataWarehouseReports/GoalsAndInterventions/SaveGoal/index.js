import React from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import { EduIf } from '@edulastic/common'
import { greyThemeDark4 } from '@edulastic/colors'
import { ACADEMIC } from '../constants'
import SectionDescription from '../SectionDescription'
import FormSection from '../FormSection'

const SaveGoal = ({
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
        <SectionDescription content={typeSectionHeader} />
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
        <SectionDescription content={targetSectionHeader} />
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
        <SectionDescription content={thresholdSectionHeader} />
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

const StyledTitle = styled.div`
  height: 16px;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 16px;
  color: ${greyThemeDark4};
`

export default SaveGoal
