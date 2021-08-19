import React, { useEffect, useState } from 'react'
import { produce } from 'immer'
import { TextInputStyled, RadioGrp, RadioBtn } from '@edulastic/common'
import { math as mathConstants } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { HeadingLabel } from './InlineCheckOptions'
import LabelWithHelper from './LabelWithHelper'

const textStyle = ['isIn', 'satisfies']
const { subEvaluationSettingsGrouped } = mathConstants
const MultipleValues = ({ t, optionKey, options, onChange }) => {
  const settings = subEvaluationSettingsGrouped[optionKey]
  const [selected, setSelected] = useState('')
  const [isAllowed, setIsAllowed] = useState(false)
  const [inputs, setInputs] = useState({})

  const updateOptions = (optKey, value) => {
    const mutated = produce(options, (draft) => {
      Object.keys(draft).forEach((key) => {
        if (settings.includes(key) && optKey !== key) {
          delete draft[key]
        }
      })
      if (draft[optKey]) {
        delete draft[optKey]
      } else {
        draft[optKey] = value
      }
    })
    onChange('options', mutated)
  }

  const handleChangeRadio = (key) => () => {
    if (textStyle.includes(key)) {
      setSelected(key)
      setIsAllowed(true)
    } else {
      updateOptions(key, !options[key])
    }
    setInputs({})
  }

  const onChangeInput = (key) => (e) => {
    const { value } = e.target
    setInputs({ ...inputs, [key]: value })
  }

  const onBlurInput = (key) => () => {
    updateOptions(key, inputs[key])
  }

  useEffect(() => {
    const selectedKey = Object.keys(options).find(
      (key) => settings.includes(key) && options[key]
    )
    if (selectedKey) {
      setSelected(selectedKey)
      if (textStyle.includes(selectedKey)) {
        setInputs({ [selectedKey]: options[selectedKey] })
      }
    } else {
      setSelected('')
    }
  }, [options])

  return (
    <div>
      <HeadingLabel>{t(`component.math.${optionKey}`)}</HeadingLabel>

      <RadioGrp value={selected}>
        {settings.map((key) => (
          <RadioBtn
            key={key}
            mb="20px"
            vertical
            value={key}
            onClick={handleChangeRadio(key)}
          >
            {textStyle.includes(key) && (
              <TextInputStyled
                size="large"
                width="50px"
                margin="0px 18px 0px 0px"
                padding="0px 4px"
                value={inputs[key] || ''}
                disabled={!isAllowed}
                onBlur={onBlurInput(key)}
                onChange={onChangeInput(key)}
              />
            )}
            <LabelWithHelper optionKey={key} />
          </RadioBtn>
        ))}
      </RadioGrp>
    </div>
  )
}

export default withNamespaces('assessment')(MultipleValues)
