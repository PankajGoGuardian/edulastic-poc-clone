import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { isEmpty } from 'lodash'
import { Col, Form, Row, Spin, Upload } from 'antd'
import {
  EduElse,
  EduIf,
  EduThen,
  beforeUpload,
  notification,
  uploadToS3,
} from '@edulastic/common'
import { aws } from '@edulastic/constants'
import {
  TAGS,
  groupFormFields,
  imageStyleAdvanceSearch,
} from '../../../constants/groupForm'

import GroupSection from './GroupSections'
import {
  StyledFormButtonsContainer,
  StyledButton,
} from '../../../common/components/Form/styled-components'
import { defaultImage } from '../../../../../../../TestPage/ducks'
import { SpinContainer } from '../../../../../../../DistrictProfile/components/Container/styled'

const InitialGroupData = {}

const SaveGroup = forwardRef(
  (
    {
      courseData,
      saveGroup,
      isGroupSaving,
      tagProps,
      onCancel,
      form,
      studentsData,
    },
    wrappedComponentRef
  ) => {
    const [groupData, setGroupData] = useState(InitialGroupData)
    const [isImageLoading, setImageLoading] = useState(false)
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue,
      resetFields,
    } = form

    useImperativeHandle(
      wrappedComponentRef,
      () => {
        return {
          resetForm: () => {
            setGroupData(InitialGroupData)
            resetFields()
          },
        }
      },
      []
    )

    const handleFieldDataChange = (key, value) => {
      setGroupData({ ...groupData, [key]: value })
    }
    const saveGroupDetail = () => {
      const name = groupData?.name?.trim()

      const { allTagsData = [] } = tagProps
      const selectedTags = getFieldValue(TAGS) || []
      const tagValues = selectedTags.map((tagId) => {
        return allTagsData.find(({ _id }) => _id === tagId)
      })

      groupData.tags = tagValues

      if (!name) {
        return notification({ msg: 'Group name is required' })
      }
      if (isEmpty(studentsData)) {
        return notification({
          msg: 'Students are not available for current search criteria',
        })
      }
      saveGroup(groupData)
    }

    const { nameGradesCourse, descriptionSubjectTags } = groupFormFields

    const EnhancedComponent = (formFields) => {
      const _courseData = courseData.map(({ label, value }) => ({
        key: value,
        title: label,
      }))
      return (
        <GroupSection
          formFields={formFields}
          groupData={groupData}
          handleFieldDataChange={handleFieldDataChange}
          courseData={_courseData}
          tagProps={{
            ...tagProps,
            getFieldValue,
            setFieldsValue,
            getFieldDecorator,
          }}
        />
      )
    }

    const handleChange = async (info) => {
      try {
        const { file } = info
        if (!beforeUpload(file)) {
          return
        }
        setImageLoading(true)
        const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT)
        if (!imageUrl) {
          return notification({ msg: 'Facing issue while uploading thumbnail' })
        }
        setGroupData({ ...groupData, thumbnail: imageUrl })
        setImageLoading(false)
      } catch (e) {
        notification({ msg: 'Facing issue while uploading thumbnail' })
      }
    }
    return (
      <>
        <StyledFormButtonsContainer>
          <StyledButton isGhost onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton onClick={saveGroupDetail} disabled={isGroupSaving}>
            <EduIf condition={isGroupSaving}>
              <EduThen>Saving...</EduThen>
              <EduElse>Save Student Group</EduElse>
            </EduIf>
          </StyledButton>
        </StyledFormButtonsContainer>
        <Row type="flex" justify="space-between">
          <Col
            span={5}
            style={{
              paddingRight: 20,
            }}
          >
            <Upload
              beforeUpload={() => false}
              showUploadList={false}
              onChange={handleChange}
              multiple={false}
              accept="image/*"
              disabled={isImageLoading}
            >
              <EduIf condition={!isImageLoading && groupData.thumbnail}>
                <EduThen>
                  <img
                    src={groupData.thumbnail}
                    alt="Group thumbnail"
                    style={imageStyleAdvanceSearch}
                  />
                </EduThen>
                <EduElse>
                  <EduIf condition={isImageLoading}>
                    <EduThen>
                      <SpinContainer>
                        <Spin />
                      </SpinContainer>
                    </EduThen>
                    <EduElse>
                      <img
                        src={defaultImage}
                        alt="Upload"
                        style={imageStyleAdvanceSearch}
                      />
                    </EduElse>
                  </EduIf>
                </EduElse>
              </EduIf>
            </Upload>
          </Col>
          <Col span={18}>
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
          </Col>
        </Row>
      </>
    )
  }
)

export default Form.create()(SaveGroup)
