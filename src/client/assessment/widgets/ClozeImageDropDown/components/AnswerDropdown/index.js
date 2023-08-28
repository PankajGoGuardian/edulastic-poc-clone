import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Select } from 'antd'

import { MathSpan, SelectInputStyled } from '@edulastic/common'
import { convertToMathTemplate } from '@edulastic/common/src/utils/mathUtils'
import { SelectContainer } from './styled/SelectContainer'

const AnswerDropdown = ({
  responseIndex,
  style,
  dropdownStyle,
  backgroundColor,
  onChange,
  disabled,
  options,
  defaultValue,
  placeholder,
  fontSize,
  isPrintPreview,
  setDropDownInUse,
  altText,
}) => {
  const dropdownContainerRef = useRef(null)
  const menuStyle = {
    top: `${dropdownContainerRef.current?.clientHeight}px !important` || 'auto',
    left: '0 !important',
  }

  const handleEvent = (event) => {
    if (typeof setDropDownInUse === 'function') {
      if (event === 'focus') {
        setDropDownInUse(true)
      } else if (event === 'blur') {
        setDropDownInUse(false)
      }
    }
  }

  return (
    <SelectContainer
      menuStyle={menuStyle}
      ref={dropdownContainerRef}
      style={style}
      fontSize={fontSize}
      backgroundColor={backgroundColor}
      isPrintPreview={isPrintPreview}
    >
      <SelectInputStyled
        style={style}
        height="100%"
        placeholder={placeholder}
        disabled={disabled}
        data-cy={`dropdown-res-${responseIndex}`}
        aria-label={altText}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        value={convertToMathTemplate(defaultValue) || undefined} // placeholder doesn't work if value is empty string
        dropdownStyle={dropdownStyle}
        onChange={(value) => {
          onChange(value)
        }}
        onFocus={() => handleEvent('focus')}
        onBlur={() => handleEvent('blur')}
      >
        {options.map((item, index) => (
          <Select.Option
            data-cy={`dropdown-res-item-${responseIndex}-${index}`}
            key={index}
            value={item.value}
          >
            <MathSpan dangerouslySetInnerHTML={{ __html: item.label }} />
          </Select.Option>
        ))}
      </SelectInputStyled>
    </SelectContainer>
  )
}

AnswerDropdown.propTypes = {
  responseIndex: PropTypes.number,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  style: PropTypes.object.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
}

AnswerDropdown.defaultProps = {
  defaultValue: '',
  responseIndex: 0,
  placeholder: '',
}

export default AnswerDropdown
