import React from 'react'
import { produce } from 'immer'
import styled from 'styled-components'
import { RadioGrp, RadioBtn } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'
import { separatorColor } from '@edulastic/colors'
import LabelWithHelper from './LabelWithHelper'

const { interpretOptions } = mathConstants
const Interpret = ({ options, optionKey, onChange }) => {
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
    <InterpretWrapper>
      <RadioGrp name={optionKey} value={selected}>
        {interpretOptions.map((opt) => (
          <RadioBtn
            vertical
            key={opt}
            value={opt}
            mb="20px"
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

export default Interpret

const InterpretWrapper = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid;
  border-color: ${separatorColor};
`
