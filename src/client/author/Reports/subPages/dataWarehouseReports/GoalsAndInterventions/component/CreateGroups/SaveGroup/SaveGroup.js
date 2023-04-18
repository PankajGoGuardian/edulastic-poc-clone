import React, { useState } from 'react'
import { Col, Row } from 'antd'
import { groupFormFields } from '../../../constants/groupForm'

import GroupSection from './GroupSections'

const InitialGroupData = {
  groupName: '',
  grades: [],
  courses: [],
  description: '',
  subjects: [],
  tags: [],
}

const SaveGroup = ({ courseData }) => {
  const [groupData, setGroupData] = useState(InitialGroupData)

  const handleFieldDataChange = (key, value) => {
    setGroupData({ ...groupData, [key]: value })
  }

  const { nameGradesCourse, descriptionSubjectTags } = groupFormFields

  const EnhancedComponent = ({ formFields }) => {
    return (
      <GroupSection
        formFields={formFields}
        groupData={groupData}
        handleFieldDataChange={handleFieldDataChange}
        courseData={courseData}
      />
    )
  }

  return (
    <>
      <Row>
        <Col
          style={{
            paddingBottom: 20,
          }}
          span={24}
        >
          <EnhancedComponent formFields={nameGradesCourse} />
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            paddingBottom: 20,
          }}
          span={24}
        >
          <EnhancedComponent formFields={descriptionSubjectTags} />
        </Col>
      </Row>
    </>
  )
}

export default SaveGroup
