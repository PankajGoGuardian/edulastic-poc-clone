import React from 'react'
import { Col, Row } from 'antd'
import { EduIf } from '@edulastic/common'
import { lightRed2 } from '@edulastic/colors'
import { StyledFilterLabel } from '../../../common/components/Form/styled-components'
import { getOptionsData } from '../../../common/utils'
import FormField from '../../../common/components/Form/FormField'

const GroupSection = ({
  formFields,
  groupData,
  handleFieldDataChange,
  courseData,
  tagProps,
}) => {
  return (
    <Row type="flex" justify="space-between">
      {Object.values(formFields).map(
        ({
          field,
          colSpan = 7,
          label,
          isRequired = false,
          placeholder = '',
          fieldType,
          optionsData,
        }) => {
          optionsData = getOptionsData({
            field,
            optionsData,
            courseData,
          })
          return (
            <Col span={colSpan} key={field}>
              <StyledFilterLabel>
                {label}
                <EduIf condition={isRequired}>
                  <span style={{ color: lightRed2, marginLeft: 3 }}>*</span>
                </EduIf>
              </StyledFilterLabel>
              <FormField
                formData={groupData}
                fieldType={fieldType} // string,dropdown
                placeholder={placeholder}
                handleFieldDataChange={handleFieldDataChange}
                field={field} // grades,subjects...
                optionsData={optionsData} // static value for dropdown
                tagProps={tagProps}
              />
            </Col>
          )
        }
      )}
    </Row>
  )
}

export default GroupSection
