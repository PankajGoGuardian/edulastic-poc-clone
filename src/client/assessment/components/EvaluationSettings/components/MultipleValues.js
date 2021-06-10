import React from 'react'
import { math as mathConstants } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import CheckOption from './CheckOption'
import InputOption from './InputOption'
import { HeadingLabel } from './InlineCheckOptions'

const textStyle = ['isIn', 'satisfies']
const { subEvaluationSettingsGrouped } = mathConstants
const MultipleValues = ({ t, optionKey, options, onChange }) => {
  const settings = subEvaluationSettingsGrouped[optionKey]
  return (
    <div>
      <HeadingLabel>{t(`component.math.${optionKey}`)}</HeadingLabel>
      {settings.map((key) => {
        if (textStyle.includes(key)) {
          return (
            <InputOption
              optionKey={key}
              key={key}
              options={options}
              onChange={onChange}
            />
          )
        }
        return (
          <CheckOption
            key={key}
            optionKey={key}
            options={options}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

export default withNamespaces('assessment')(MultipleValues)
