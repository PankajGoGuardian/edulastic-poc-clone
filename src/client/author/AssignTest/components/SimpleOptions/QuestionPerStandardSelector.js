import React from 'react'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { Col } from 'antd'

const QuestionPerStandardSelector = ({
  onChange,
  questionPerStandard,
  options,
}) => (
  <>
    <Col span={12}>
      <FieldLabel>QUESTIONS PER STANDARD</FieldLabel>
    </Col>
    <Col span={12}>
      <SelectInputStyled
        data-cy="selectQuestionPerStandard"
        placeholder="Questions per standard"
        onChange={onChange}
        value={questionPerStandard}
        getPopupContainer={(node) => node.parentNode}
      >
        {options.map(({ val, label }) => (
          <SelectInputStyled.Option
            data-cy={`selectQuestionPerStandard-${val}`}
            key={val}
            value={val}
          >
            {label}
          </SelectInputStyled.Option>
        ))}
      </SelectInputStyled>
    </Col>
  </>
)

export default QuestionPerStandardSelector
