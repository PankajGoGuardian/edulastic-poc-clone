import React, { useMemo } from 'react'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'
import { separatorColor } from '@edulastic/colors'
import EvaluationOption from './components/EvaluationOption'

const { evaluationSettings } = mathConstants

const LiterallyEquivalent = ({
  method,
  onChangeOption,
  options,
  onChange,
  useTemplate,
  onChangeAllowedOptions,
  allowNumericOnly,
  allowedVariables,
}) => {
  const methodOptions = useMemo(() => evaluationSettings[method], [method])

  return (
    <Container>
      {methodOptions.map((key) => (
        <EvaluationOption
          key={key}
          optionKey={key}
          options={options}
          onChange={onChange}
          useTemplate={useTemplate}
          allowNumericOnly={allowNumericOnly}
          onChangeOption={onChangeOption}
          allowedVariables={allowedVariables}
          onChangeAllowedOptions={onChangeAllowedOptions}
        />
      ))}
    </Container>
  )
}

export default LiterallyEquivalent

const Container = styled.div`
  margin: 15px -32px;
  padding: 20px 30px;
  border-top: 1px solid;
  border-color: ${separatorColor};
`
