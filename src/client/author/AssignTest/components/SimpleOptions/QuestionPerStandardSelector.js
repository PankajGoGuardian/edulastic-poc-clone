/* eslint-disable react/prop-types */
import React from 'react'
import { Col } from 'antd'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'

const QuestionPerStandardSelector = ({
  onChange,
  questionPerStandard,
  options,
}) => (
  <Col span={12}>
    <FieldLabel>QUESTIONS PER STANDARD</FieldLabel>
    <SelectInputStyled
      data-cy="selectQuestionPerStandard"
      placeholder="Select number of questions for each standard"
      onChange={onChange}
      value={questionPerStandard}
    >
      {options.map(({ value: val, label }) => (
        <SelectInputStyled.Option
          data-cy={`selectQuestionPerStandard${val}`}
          key={val}
          value={val}
        >
          {label}
        </SelectInputStyled.Option>
      ))}
    </SelectInputStyled>
  </Col>
)

export default QuestionPerStandardSelector
