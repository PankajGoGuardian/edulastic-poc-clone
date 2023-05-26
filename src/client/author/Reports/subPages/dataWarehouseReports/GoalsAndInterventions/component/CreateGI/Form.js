import { EduIf } from '@edulastic/common'
import { Col, Row } from 'antd'
import React, { useEffect, useRef } from 'react'
import FormSection from '../../common/components/Form/FormSection'
import {
  StyledSectionDescription,
  StyledTitle,
  StyledButton,
  StyledSectionContainer,
} from '../../common/components/Form/styled-components'
import {
  ACADEMIC,
  DETAILS_SECTION,
  TARGET_GROUPS_SECTION,
  RELATED_GOALS_COMMENTS_SECTION,
  TARGET_PROFICIENCY_SECTION,
  THRESHOLD_DEADLINE_SECTION,
  INTERVENTION,
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
  handleCreateGroupClick,
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
    targetGroup,
    testTypeSubjectAndStandards,
    typeBandAndMetric,
    thresholdStartAndEndDate,
    relatedGoalsAndComment,
  } = allFormFields

  const {
    typeSectionHeader,
    targetSectionHeader,
    thresholdSectionHeader,
    targetGroupsSectionHeader,
  } = sectionHeaders

  const {
    testTypeSubjectAndStandardsSectionTitle,
    typeBandAndMetricSectionTitle,
    relatedGoalsAndCommentSectionTitle,
  } = sectionTitles

  const { type = '', formType } = formData
  const showTestTypeSubjectAndStandardsSection = type === ACADEMIC

  const detailsSectionRef = useRef()
  const targetGroupsSectionRef = useRef()
  const targetProficiencySectionRef = useRef()
  const thresholdDeadlineSectionRef = useRef()
  const relatedGoalsCommentsSectionRef = useRef()

  const allSectionRefs = {
    [DETAILS_SECTION]: detailsSectionRef,
    [TARGET_PROFICIENCY_SECTION]: targetProficiencySectionRef,
    [THRESHOLD_DEADLINE_SECTION]: thresholdDeadlineSectionRef,
    [RELATED_GOALS_COMMENTS_SECTION]: relatedGoalsCommentsSectionRef,
    [TARGET_GROUPS_SECTION]: targetGroupsSectionRef,
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
      <div ref={targetGroupsSectionRef}>
        <Row>
          <StyledSectionContainer>
            <StyledSectionDescription>
              {targetGroupsSectionHeader}
            </StyledSectionDescription>
            <StyledButton
              isGhost
              onClick={handleCreateGroupClick}
              ml={35}
              height={30}
            >
              Create new group
            </StyledButton>
          </StyledSectionContainer>
          <Col
            style={{
              paddingBottom: 30,
            }}
            span={24}
          >
            {EnhancedComponent(targetGroup)}
          </Col>
        </Row>
      </div>
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
          <EduIf condition={formType === INTERVENTION}>
            <StyledTitle>{relatedGoalsAndCommentSectionTitle}</StyledTitle>
          </EduIf>
          <Col span={24}>{EnhancedComponent(relatedGoalsAndComment)}</Col>
        </Row>
      </div>
    </div>
  )
}

export default Form
