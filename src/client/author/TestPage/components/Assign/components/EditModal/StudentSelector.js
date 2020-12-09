import React from 'react'
import PropTypes from 'prop-types'
import Col from "antd/es/col";
import Select from "antd/es/select";
import Radio from "antd/es/radio";
import { StyledRowLabel, StyledRow } from './styled'

const RadioGroup = Radio.Group

const StudentsSelector = ({
  specificStudents,
  students = [],
  updateStudents,
  onChange,
  studentNames,
}) => (
  <>
    <StyledRow gutter={16}>
      <Col span={24}>
        <RadioGroup value={specificStudents ? 2 : 1}>
          <Radio value={1} onClick={() => onChange('specificStudents', false)}>
            Entire Class
          </Radio>
          <Radio
            value={2}
            data-cy="specificStudent"
            onClick={() => onChange('specificStudents', true)}
          >
            Specific Student
          </Radio>
        </RadioGroup>
      </Col>
    </StyledRow>
    {specificStudents && (
      <>
        <StyledRowLabel gutter={16}>
          <Col span={12}>Student</Col>
        </StyledRowLabel>
        <StyledRow>
          <Col span={24}>
            <Select
              showArrow
              data-cy="selectStudent"
              placeholder="Please select"
              style={{ width: '100%' }}
              mode="multiple"
              onChange={updateStudents}
              value={studentNames}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {students.map(({ _id, firstName, lastName, groupId }) => (
                <Select.Option key={_id} value={_id}>
                  {`${firstName || 'Anonymous'} ${lastName || ''}`}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </StyledRow>
      </>
    )}
  </>
)

StudentsSelector.propTypes = {
  studentNames: PropTypes.array.isRequired,
  students: PropTypes.array.isRequired,
  updateStudents: PropTypes.func.isRequired,
}

StudentsSelector.defaultProps = {
  studentNames: [],
}

export default StudentsSelector
