import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import { CheckboxLabel, SelectInputStyled } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const { Option } = SelectInputStyled
const DropdownArray = ({ t, options, onChange, optionKey }) => {
  const [isAllowed, setIsAllowed] = useState(false)
  const dropdownOptions = options[optionKey] || [{ val: ',', ind: 0 }]

  const opts = useMemo(() => {
    const defaultOpts = {
      setThousandsSeparator: [
        { value: ',', label: t('component.math.comma') },
        { value: '.', label: t('component.math.dot') },
        { value: ' ', label: t('component.math.space') },
      ],
    }
    return defaultOpts[optionKey] || []
  }, [])

  const onChangeSelect = ({ val, ind }) => {
    if (!val) {
      onChange(optionKey, null)
      return
    }
    let newOtps = ['']

    if (options[optionKey] && options[optionKey]?.length) {
      newOtps = [...options[optionKey]]
    }

    newOtps[ind] = val
    onChange(optionKey, newOtps)
  }

  const onChangeCheckbox = (e) => {
    setIsAllowed(e.target.checked)
    if (!e.target.checked) {
      onChangeSelect({ val: null, ind: 0 })
    } else {
      onChangeSelect({ val: ',', ind: 0 })
    }
  }

  // const handleAddOption = () => {
  //   let newOtps = []
  //   if (options[optionKey] && options[optionKey].length) {
  //     newOtps = [...options[optionKey]]
  //   }
  //   onChange(optionKey, [...newOtps, ''])
  // }

  // const handleDeleteOption = (ind) => {
  //   const newOtps = dropdownOptions.filter((_, i) => !i !== ind)
  //   onChange('setThousandsSeparator', newOtps)
  // }

  return (
    <DropdownOptionWrapper>
      <CheckboxLabel
        data-cy={`"answer-${optionKey}`}
        checked={isAllowed}
        labelPadding="0px 16px"
        onChange={onChangeCheckbox}
      />
      {dropdownOptions.map((opt, index) => (
        <SelectInputStyled
          size="large"
          width="100px"
          margin="0px 16px"
          key={index}
          onChange={(val) => onChangeSelect({ val, ind: index })}
          disabled={!isAllowed}
          data-cy={`answer-set${optionKey}`}
          value={isAllowed ? opt : ''}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {opts.map(({ value: val, label }) => (
            <Option key={val} value={val}>
              {label}
            </Option>
          ))}
        </SelectInputStyled>
      ))}

      <LabelWithHelper optionKey={optionKey} />
    </DropdownOptionWrapper>
  )
}

DropdownArray.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces('assessment')(DropdownArray)

const DropdownOptionWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`
