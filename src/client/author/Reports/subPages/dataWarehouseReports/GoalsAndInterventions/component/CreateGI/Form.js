import { EduIf } from '@edulastic/common'
import { Col, Row } from 'antd'
import React, { useEffect, useRef } from 'react'
import FormSection from '../../common/components/Form/FormSection'
import {
  StyledSectionDescription,
  StyledTitle,
} from '../../common/components/Form/styled-components'
import {
  ACADEMIC,
  DETAILS_SECTION,
  RELATED_GOALS_COMMENTS_SECTION,
  TARGET_PROFICIENCY_SECTION,
  THRESHOLD_DEADLINE_SECTION,
} from '../../constants/form'

const Form = ({
  allFormFields,
  sectionHeaders,
  sectionTitles,
  formData,
  handleFieldDataChange,
  groupOptions,
  performanceBandOptions,
  targetPerformanceBandOptions,
  goalsOptions,
  setNavigationOptions,
  formNavigationLabelOptions,
  attendanceBandOptions,
  targetAttendanceBandOptions,
}) => {
  const EnhancedComponent = (formFields) => {
    return (
      <FormSection
        formFields={formFields}
        formData={formData}
        handleFieldDataChange={handleFieldDataChange}
        groupOptions={groupOptions}
        performanceBandOptions={performanceBandOptions}
        targetPerformanceBandOptions={targetPerformanceBandOptions}
        targetAttendanceBandOptions={targetAttendanceBandOptions}
        goalsOptions={goalsOptions}
        attendanceBandOptions={attendanceBandOptions}
      />
    )
  }

  const {
    nameAndType,
    ownerAndDescription,
    testTypeSubjectAndStandards,
    typeBandAndMetric,
    thresholdStartAndEndDate,
    relatedGoalsAndComment,
  } = allFormFields

  const {
    typeSectionHeader,
    targetSectionHeader,
    thresholdSectionHeader,
  } = sectionHeaders

  const {
    testTypeSubjectAndStandardsSectionTitle,
    typeBandAndMetricSectionTitle,
    relatedGoalsAndCommentSectionTitle,
  } = sectionTitles

  const { type = '' } = formData
  const showTestTypeSubjectAndStandardsSection = type === ACADEMIC

  const detailsSectionRef = useRef()
  const targetProficiencySectionRef = useRef()
  const thresholdDeadlineSectionRef = useRef()
  const relatedGoalsCommentsSectionRef = useRef()

  const allSectionRefs = {
    [DETAILS_SECTION]: detailsSectionRef,
    [TARGET_PROFICIENCY_SECTION]: targetProficiencySectionRef,
    [THRESHOLD_DEADLINE_SECTION]: thresholdDeadlineSectionRef,
    [RELATED_GOALS_COMMENTS_SECTION]: relatedGoalsCommentsSectionRef,
  }

  useEffect(() => {
    const navigationOptions = Object.keys(formNavigationLabelOptions).map(
      (section) => ({
        element: allSectionRefs[section]?.current,
        label: formNavigationLabelOptions[section],
      })
    )
    setNavigationOptions(navigationOptions)
  }, [])

  return (
    <div>
      <div ref={detailsSectionRef}>
        <Row>
          <StyledSectionDescription>
            {typeSectionHeader}
          </StyledSectionDescription>
          <Col
            style={{
              paddingBottom: 20,
            }}
            span={24}
          >
            {EnhancedComponent(nameAndType)}
          </Col>
        </Row>
      </div>
      <Row
        style={{
          paddingBottom: 30,
        }}
      >
        <Col span={24}>{EnhancedComponent(ownerAndDescription)}</Col>
      </Row>
      <div ref={targetProficiencySectionRef}>
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
              <StyledTitle>
                {testTypeSubjectAndStandardsSectionTitle}
              </StyledTitle>
              {EnhancedComponent(testTypeSubjectAndStandards)}
            </Col>
          </EduIf>
          <Col
            style={{
              paddingBottom: 30,
            }}
            span={24}
          >
            <StyledTitle>{typeBandAndMetricSectionTitle}</StyledTitle>
            {EnhancedComponent(typeBandAndMetric)}
          </Col>
        </Row>
      </div>
      <div ref={thresholdDeadlineSectionRef}>
        <Row style={{ borderBottom: '1px solid #D8D8D8', paddingBottom: 28 }}>
          <StyledSectionDescription>
            {thresholdSectionHeader}
          </StyledSectionDescription>
          <Col span={24}>{EnhancedComponent(thresholdStartAndEndDate)}</Col>
        </Row>
      </div>
      <div ref={relatedGoalsCommentsSectionRef}>
        <Row
          style={{
            paddingTop: 30,
            paddingBottom: 28,
          }}
        >
          <StyledTitle>{relatedGoalsAndCommentSectionTitle}</StyledTitle>
          <Col span={24}>{EnhancedComponent(relatedGoalsAndComment)}</Col>
        </Row>
      </div>
    </div>
  )
}

export default Form
