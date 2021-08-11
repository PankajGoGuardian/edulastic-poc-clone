import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { math } from '@edulastic/constants'
import { redDark } from '@edulastic/colors'
import { MathInput, TextInputStyled, notification } from '@edulastic/common'
import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../../styled/WidgetOptions/Label'

import VariableTypeSelector from './VariableTypeSelector'
import { ExampleField } from './Examples'

const { defaultNumberPad } = math

const VariableRow = ({
  variable,
  variableName,
  onChange,
  onSelectType,
  dataCy,
  hasExamples,
  invalidSeq,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const isRange = variable.type.includes('RANGE')
  const isFormula = variable.type.includes('FORMULA')
  const isSet = variable.type.includes('SET')
  const isNumberSquence = variable.type === 'NUMBER_SEQUENCE'
  const isTextSquence = variable.type === 'TEXT_SEQUENCE'

  const handleKeyPress = (e) => {
    const allowedNumbersRegex = new RegExp('[0-9]+') // allow numbers only
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode)
    const allowedKeys = [8, 9, 37, 38, 39, 40] // to allow arrow keys, backspace and tab
    if (
      !(
        allowedKeys.includes(e?.which || e?.charCode) ||
        allowedNumbersRegex?.test(pressedKey)
      )
    ) {
      return e.preventDefault()
    }
    return pressedKey
  }

  const handleKeypressMathInput = (e) => {
    if (e.key === '@') {
      notification({
        msg: (
          <div>
            Dynamic Parameter formulas do not handle &#34;@&#34; symbols.
            <br /> For example, if you want to add one, can not handle
            &#34;@a+1&#34;, but instead write it as &#34;a+1&#34;
          </div>
        ),
      })
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const toggleActive = () => {
    setIsFocused(!isFocused)
  }

  const helperText = useMemo(() => {
    if (invalidSeq && isFocused) {
      return (
        <HelpText>
          All dynamic parameters of sequence type need to have the same number
          of items
        </HelpText>
      )
    }
    return ''
  }, [invalidSeq, isFocused])

  return (
    <Row gutter={4} data-cy={dataCy}>
      <StyledCol md={2}>
        <Label style={{ textTransform: 'none' }}>{variableName}</Label>
      </StyledCol>
      <StyledCol md={5}>
        <VariableTypeSelector
          variableName={variableName}
          value={variable.type}
          hasExamples={hasExamples}
          onSelect={onSelectType}
        />
      </StyledCol>
      {isFormula && (
        <StyledCol md={12}>
          <MathInput
            dynamicVariableInput
            fullWidth
            showDropdown
            numberPad={defaultNumberPad}
            value={variable.formula}
            showResponse={false}
            onInput={(latex) => onChange(variableName, 'formula', latex)}
            onKeyPress={handleKeypressMathInput}
          />
        </StyledCol>
      )}
      {isSet && (
        <StyledCol md={12}>
          <TextInputStyled
            data-cy="variableSet"
            value={variable.set}
            onChange={(e) => onChange(variableName, 'set', e.target.value)}
            size="large"
          />
        </StyledCol>
      )}
      {isNumberSquence && (
        <StyledCol md={12}>
          <TextInputStyled
            data-cy="variableNumberSequence"
            value={variable.sequence}
            onFocus={toggleActive}
            onBlur={toggleActive}
            onChange={(e) => onChange(variableName, 'sequence', e.target.value)}
            size="large"
          />
          {helperText}
        </StyledCol>
      )}
      {isTextSquence && (
        <StyledCol md={12}>
          <TextInputStyled
            data-cy="variableTextSequence"
            value={variable.sequence}
            onChange={(e) => onChange(variableName, 'sequence', e.target.value)}
            size="large"
          />
          {helperText}
        </StyledCol>
      )}
      {isRange && (
        <StyledCol md={3}>
          <TextInputStyled
            type="number"
            data-cy="variableMin"
            value={variable.min}
            step={0.1}
            onChange={(e) =>
              onChange(
                variableName,
                'min',
                e.target.value ? +e.target.value : ''
              )
            }
            size="large"
          />
        </StyledCol>
      )}
      {isRange && (
        <StyledCol md={3}>
          <TextInputStyled
            type="number"
            data-cy="variableMax"
            value={variable.max}
            step={0.1}
            onChange={(e) =>
              onChange(
                variableName,
                'max',
                e.target.value ? +e.target.value : ''
              )
            }
            size="large"
          />
        </StyledCol>
      )}
      {isRange && (
        <StyledCol md={3}>
          <TextInputStyled
            type="number"
            data-cy="variableStep"
            value={variable.step}
            step={0.1}
            onChange={(e) =>
              onChange(
                variableName,
                'step',
                e.target.value ? +e.target.value : ''
              )
            }
            size="large"
          />
        </StyledCol>
      )}
      {isRange && (
        <StyledCol md={3}>
          <TextInputStyled
            min={0}
            type="number"
            size="large"
            data-cy="variableDecimal"
            value={variable.decimal}
            onChange={(e) =>
              onChange(
                variableName,
                'decimal',
                e.target.value ? parseInt(e.target.value, 10) : ''
              )
            }
            onKeyDown={handleKeyPress}
          />
        </StyledCol>
      )}
      <ExampleField variable={variable} />
    </Row>
  )
}

export default VariableRow

const StyledCol = styled(Col)`
  position: relative;
`

const HelpText = styled.span`
  left: 0px;
  top: 100%;
  padding: 0px 4px;
  color: ${redDark};
  font-size: 11px;
  position: absolute;
  max-width: 100%;
  z-index: 1;
`
