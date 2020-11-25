import React from 'react'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'
import { FieldLabel, FlexContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { greyThemeDark6 } from '@edulastic/colors'
import CheckOption from './CheckOption'
import InputOption from './InputOption'

const textStyle = ['tolerance', 'isIn', 'satisfies']
const numberStyle = ['significantDecimalPlaces']
const { subEvaluationSettingsGrouped } = mathConstants
const InlineCheckOptions = ({ t, optionKey, options, onChange }) => {
  const settings = subEvaluationSettingsGrouped[optionKey]

  return (
    <FlexContainer flexDirection="column">
      <HeadingLabel>{t(`component.math.${optionKey}`)}</HeadingLabel>
      <FlexContainer justifyContent="flex-start" flexWrap="wrap">
        {settings.map((key) => {
          const width =
            optionKey === 'accuracyForms' || optionKey === 'equationForms'
              ? '50%'
              : '30%'
          return (
            <FlexContainer key={key} width={width} justifyContent="flex-start">
              {textStyle.includes(key) || numberStyle.includes(key) ? (
                <InputOption
                  optionKey={key}
                  options={options}
                  onChange={onChange}
                  inputType={numberStyle.includes(key) ? 'number' : 'text'}
                />
              ) : (
                <CheckOption
                  optionKey={key}
                  options={options}
                  onChange={onChange}
                />
              )}
            </FlexContainer>
          )
        })}
      </FlexContainer>
    </FlexContainer>
  )
}

export default withNamespaces('assessment')(InlineCheckOptions)

export const HeadingLabel = styled(FieldLabel)`
  color: ${greyThemeDark6};
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;

  &::after {
    content: ' ';
    border-bottom: 1px solid #e8e8e8;
    margin-left: 16px;
    display: inline-flex;
    position: absolute;
    width: 100%;
    top: 50%;
  }
`
