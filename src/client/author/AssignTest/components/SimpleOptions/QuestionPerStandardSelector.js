import React from 'react'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { Col, Tooltip } from 'antd'
import { StyledSpan, StyledInfoIcon } from './styled'

const QuestionPerStandardSelector = ({
  onChange,
  questionPerStandard,
  options,
  paddingTop,
}) => (
  <>
    <Col span={10}>
      <FieldLabel top={paddingTop}>
        <StyledSpan>
          QUESTIONS PER STANDARD{' '}
          <Tooltip title="Applicable for standards only, not applicable for tests.">
            <StyledInfoIcon mL="5px" />
          </Tooltip>
        </StyledSpan>
      </FieldLabel>
    </Col>
    <Col span={14}>
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
