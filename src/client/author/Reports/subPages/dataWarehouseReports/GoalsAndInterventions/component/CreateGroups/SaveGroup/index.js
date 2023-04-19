import React, { useState } from 'react'
import { Col, Row } from 'antd'
import { EduButton, notification } from '@edulastic/common'
import { isEmpty } from 'lodash'
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

const SaveGroup = ({ courseData, studentData, saveGroup }) => {
  const [groupData, setGroupData] = useState(InitialGroupData)

  const handleFieldDataChange = (key, value) => {
    setGroupData({ ...groupData, [key]: value })
  }

  const saveGroupDetail = () => {
    const groupName = groupData?.groupName?.trim()
    if (isEmpty(studentData)) {
      notification({ msg: 'Check if query is able to fetch students list' })
    }
    if (groupData.groupName === 'string' && groupName) {
      notification({ msg: 'Group name is required field' })
    }
    saveGroup(groupData)
  }

  const { nameGradesCourse, descriptionSubjectTags } = groupFormFields

  const EnhancedComponent = (formFields) => {
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
          <EduButton>Cancel</EduButton>
          <EduButton onClick={saveGroupDetail}>Save Group</EduButton>
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            paddingBottom: 20,
          }}
          span={24}
        >
          {EnhancedComponent(nameGradesCourse)}
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            paddingBottom: 20,
          }}
          span={24}
        >
          {EnhancedComponent(descriptionSubjectTags)}
        </Col>
      </Row>
    </>
  )
}

export default SaveGroup
