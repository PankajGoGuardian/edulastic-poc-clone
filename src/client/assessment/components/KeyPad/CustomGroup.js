import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, uniqBy, isEmpty } from 'lodash'

import { withNamespaces } from '@edulastic/localization'

import { MathKeyboard } from '@edulastic/common'

import NumberPad from '../NumberPad'

const { TAB_BUTTONS, KEYBOARD_BUTTONS, NUMBER_PAD_ITEMS } = MathKeyboard

const CustomGroup = ({ onChange, value, customKeys, buttonStyle, t }) => {
  const handleChangeValue = (field, val) => {
    const newValue = cloneDeep(value)
    newValue[field] = val
    onChange(newValue)
  }

  const characterMapButtons = useMemo(() => {
    const customBtns = [
      { value: '', label: t('component.options.empty') },
    ].concat(customKeys.map((key) => ({ value: key, label: key })))

    const tabBtns = TAB_BUTTONS.reduce(
      (acc, curr) => [...acc, ...curr.buttons],
      []
    )
    const allKeyButtons = uniqBy(
      NUMBER_PAD_ITEMS.concat(KEYBOARD_BUTTONS).concat(tabBtns),
      (btn) => btn.handler
    )

    return customBtns.concat(
      allKeyButtons.map((button) => ({
        value: button.handler,
        label: button.label,
        dataCy: button.dataCy,
      }))
    )
  }, [customKeys])

  const numberPadButtons = useMemo(() => {
    return value.value.map((latex) => {
      if (!latex) {
        return { value: '', label: t('component.options.empty') }
      }
      let res = characterMapButtons.find(({ value: _val }) => latex === _val)
      /**
       * @see https://snapwiz.atlassian.net/browse/EV-28041
       * To render custom keys defined in some other item
       */
      const _latex =
        latex && typeof latex === 'string' ? latex.trim() : undefined

      if (res) {
        res = {
          value: res.handler,
          label: res.label,
        }
      } else if (!isEmpty(_latex)) {
        res = {
          value: _latex,
          label: _latex,
        }
      }
      return res || { value: '', label: t('component.options.empty') }
    })
  }, [value.value, characterMapButtons])

  const handleChangeNumberPad = (index, val) => {
    const numberPad = value.value ? [...value.value] : []
    numberPad[index] = val
    handleChangeValue('value', numberPad)
  }

  return (
    <NumberPad
      onChange={handleChangeNumberPad}
      items={numberPadButtons}
      characterMapButtons={characterMapButtons}
      buttonStyle={buttonStyle}
    />
  )
}

CustomGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  customKeys: PropTypes.array.isRequired,
  buttonStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
}

CustomGroup.defaultProps = {
  buttonStyle: {},
}

export default withNamespaces('assessment')(CustomGroup)
