import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { math } from '@edulastic/constants'
import { redDark } from '@edulastic/colors'
import { MathInput, TextInputStyled, notification } from '@edulastic/common'
import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../../styled/WidgetOptions/Label'

import VariableTypeSelector from './VariableTypeSelector'
import { ExampleField } from './Examples'
import validations from './validations'

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
  const isSet = variable.type === 'NUMBER_SET'
  const isTextSet = variable.type === 'TEXT_SET'
  const isNumberSquence = variable.type === 'NUMBER_SEQUENCE'
  const isTextSquence = variable.type === 'TEXT_SEQUENCE'

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

  const onBlurHandle = (name, type, value) => {
    if (type === 'step' && value === 0) {
      onChange(name, type, '')
    }

    /**
     * @see https://snapwiz.atlassian.net/browse/EV-35241
     * moving min and max value validation out of onChange method for min, max value changing smooth
     * if validation fails values are being set to respective default values
     */
    if (type === 'min' || type === 'max') {
      if (name !== variableName && isEmpty(variable)) {
        return
      }

      if (type === 'min' && variable.max <= value) {
        notification({
          type: 'warn',
          messageKey: 'invalidDynamicParameterMinValue',
        })
        onChange(name, type, 0)
        return
      }
      if (type === 'max' && variable.min >= value) {
        notification({
          type: 'warn',
          messageKey: 'invalidDynamicParameterMaxValue',
        })
        onChange(name, type, 100)
        return
      }
      onChange(name, type, value)
    }
  }

  const toggleActive = () => {
    setIsFocused(!isFocused)
  }

  const helperText = useMemo(() => {
    if (invalidSeq && isFocused) {
      return (
        <HelpText>
          All variables of sequence type need to have the same number of items.
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
            onKeyDown={validations.numSequence}
            onChange={(e) => onChange(variableName, 'set', e.target.value)}
            size="large"
          />
        </StyledCol>
      )}
      {isTextSet && (
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
            onKeyDown={validations.numSequence}
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
            onFocus={toggleActive}
            onBlur={toggleActive}
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
            onBlur={(e) =>
              onBlurHandle(
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
            onBlur={(e) =>
              onBlurHandle(
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
            min={0}
            step={0.1}
            onKeyDown={validations.step}
            onBlur={(e) =>
              onBlurHandle(
                variableName,
                'step',
                e.target.value ? +e.target.value : ''
              )
            }
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
            onKeyDown={validations.decimal}
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
