import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { math } from '@edulastic/constants'
import styled from 'styled-components'
import { Input } from 'antd'
import { isEmpty } from 'lodash'

import NumberPad from '../../../components/NumberPad'
import { getInputSelection } from '../../../utils/helpers'

const { TextArea } = Input
const { characterMapButtons } = math

const TextInput = ({
  disabled,
  noIndent,
  lessPadding,
  isMultiple,
  characterMap,
  background,
  onChange,
  placeholder,
  type,
  value,
  altText,
}) => {
  const ref = useRef()
  const MInput = isMultiple ? TextArea : Input
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  })

  const getValue = (val) => {
    // TODO: EV-10804
    const newStr = value?.split('') || []
    newStr.splice(selection.start, selection.end - selection.start, val)
    return newStr.join('')
  }

  const makeCharactersMap = () => {
    const make = (arr) =>
      arr.map((character) => ({ value: character, label: character }))

    if (!isEmpty(characterMap)) {
      return make(characterMap)
    }

    return make(characterMapButtons)
  }

  const onChangeHandler = (answer) => {
    if (type === 'number' && Number.isNaN(+answer)) {
      return
    }
    onChange(answer)
  }

  return (
    <CustomInput noIndent={noIndent}>
      <MInput
        ref={ref}
        onChange={(e) => onChangeHandler(e.target.value)}
        disabled={disabled}
        onSelect={(e) => setSelection(getInputSelection(e.currentTarget))}
        wrap={isMultiple ? '' : 'off'}
        value={value}
        style={{
          resize: 'none',
          height: '100%',
          background: background || '#f8f8f8',
          padding: lessPadding ? '3px' : null,
        }}
        placeholder={placeholder}
        aria-label={altText}
      />
      {characterMap && (
        <NumberPad
          buttonStyle={{
            height: '100%',
            width: 30,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
          onChange={(_, val) => {
            onChangeHandler(getValue(val))
            ref.current.focus()
          }}
          items={[{ value: 'á', label: 'á' }]}
          characterMapButtons={makeCharactersMap()}
        />
      )}
    </CustomInput>
  )
}

TextInput.propTypes = {
  disabled: PropTypes.bool,
  noIndent: PropTypes.bool,
}

TextInput.defaultProps = {
  noIndent: false,
  disabled: false,
}

export default TextInput

const CustomInput = styled.div`
  display: inline-flex;
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;

  .ant-input {
    padding: ${({ noIndent }) => (noIndent ? '4px 2px' : null)};
    min-height: 18px;
  }
`
