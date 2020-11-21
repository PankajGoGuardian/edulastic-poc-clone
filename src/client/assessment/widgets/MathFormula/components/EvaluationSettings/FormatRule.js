import React from 'react'
import styled from 'styled-components'
import { values } from 'lodash'
import {
  SelectInputStyled,
  TextInputStyled,
  FieldLabel,
} from '@edulastic/common'
import { separatorColor } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { math as mathConstants } from '@edulastic/constants'
import LabelWithHelper from './components/LabelWithHelper'

const { syntaxes } = mathConstants

const { Option } = SelectInputStyled
const FormatRule = ({ t, onChangeOption, options }) => {
  const syntaxOptions = values(syntaxes).map((syntax) => ({
    value: syntax,
    label: t(`component.math.${syntax}`),
  }))

  const onSelectSyntaxOption = (val) => {
    onChangeOption('syntax', val)
  }

  return (
    <Container>
      <LabelWithHelper label="Apply Rule" optionKey="applyRule" vertical />
      <SelectInputStyled
        size="large"
        width="260px"
        data-cy="answer-rule-dropdown"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        value={options.syntax}
        onChange={onSelectSyntaxOption}
      >
        {syntaxOptions.map((syntaxOption) => (
          <Option key={syntaxOption.value} value={syntaxOption.value}>
            {syntaxOption.label}
          </Option>
        ))}
      </SelectInputStyled>

      {syntaxes.DECIMAL === options.syntax && (
        <InputField>
          <FieldLabel>{t('component.math.argument')}</FieldLabel>
          <TextInputStyled
            size="large"
            type="number"
            width="260px"
            value={options.argument || 0}
            onChange={(e) => onChangeOption('argument', +e.target.value)}
            data-cy="answer-rule-argument-input"
            min={0}
          />
        </InputField>
      )}

      {syntaxes.STANDARD_FORM === options.syntax && (
        <InputField>
          <FieldLabel>{t('component.math.argument')}</FieldLabel>
          <SelectInputStyled
            size="large"
            width="260px"
            value={options.argument || ''}
            onChange={(val) => onChangeOption('argument', val)}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            data-cy="answer-rule-argument-select"
          >
            {['linear', 'quadratic'].map((val) => (
              <Option
                key={val}
                value={val}
                data-cy={`answer-argument-dropdown-${val}`}
              >
                {val}
              </Option>
            ))}
          </SelectInputStyled>
        </InputField>
      )}
    </Container>
  )
}

export default withNamespaces('assessment')(FormatRule)

const Container = styled.div`
  margin: 15px -32px;
  padding: 20px 30px;
  border-top: 1px solid;
  border-color: ${separatorColor};
`
const InputField = styled.div`
  margin-top: 14px;
`
