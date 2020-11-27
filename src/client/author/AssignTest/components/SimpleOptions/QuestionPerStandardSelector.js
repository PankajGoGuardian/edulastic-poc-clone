import React from 'react'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'

const QuestionPerStandardSelector = ({
  onChange,
  questionPerStandard,
  options,
}) => (
  <>
    <FieldLabel>QUESTIONS PER STANDARD</FieldLabel>
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
  </>
)

export default QuestionPerStandardSelector
