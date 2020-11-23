import React from 'react'
import { produce } from 'immer'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { RadioGrp, RadioBtn } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'
import { separatorColor } from '@edulastic/colors'
import LabelWithHelper from './LabelWithHelper'
import { HeadingLabel } from './InlineCheckOptions'

const { subEvaluationSettingsGrouped } = mathConstants
const Interpret = ({ t, options, optionKey, onChange, inline }) => {
  const interpretOptions = subEvaluationSettingsGrouped[optionKey]

  const onClickRadioHandler = (opt) => () => {
    const newOptions = produce(options, (draft) => {
      if (!draft[opt] && opt !== 'automatic') {
        draft[opt] = true
      } else {
        delete draft[opt]
      }
      Object.keys(draft).forEach((key) => {
        if (interpretOptions.includes(key)) {
          if (key !== opt) {
            // remove all other radio options which were selected previously
            delete draft[key]
          }
        }
      })
    })
    onChange('options', newOptions)
  }
  const optionsKeyed = Object.keys(options)
  const selected =
    optionsKeyed.find(
      (key) => interpretOptions.includes(key) && options[key] === true
    ) || 'automatic'

  return (
    <InterpretWrapper noBorder={inline}>
      {inline && (
        <HeadingLabel>{t(`component.math.${optionKey}`)}</HeadingLabel>
      )}
      <RadioGrp name={optionKey} value={selected}>
        {interpretOptions.map((opt) => (
          <RadioBtn
            key={opt}
            value={opt}
            mb="20px"
            vertical={!inline}
            checked={opt === selected}
            onClick={onClickRadioHandler(opt)}
          >
            <LabelWithHelper optionKey={opt} />
          </RadioBtn>
        ))}
      </RadioGrp>
    </InterpretWrapper>
  )
}

export default withNamespaces('assessment')(Interpret)

const InterpretWrapper = styled.div`
  margin-bottom: ${({ noBorder }) => !noBorder && '20px'};
  border-bottom: ${({ noBorder }) => !noBorder && '1px solid'};
  border-color: ${separatorColor};
`
