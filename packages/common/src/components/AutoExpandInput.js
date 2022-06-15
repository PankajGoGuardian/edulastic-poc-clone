import React, { useEffect, useState } from 'react'
import styled, { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import { Input, Popover } from 'antd'
import { response as responseDimensions } from '@edulastic/constants'
import { measureText, TextInputStyled } from '@edulastic/common'

const { TextArea } = Input

const AutoExpandInput = ({
  onChange,
  onBlur,
  multipleLine,
  value,
  style = {},
  inputRef,
  type,
  theme,
  ...rest
}) => {
  const maxWidth = responseDimensions.clozeTextMaxWidth
  const [largWidth, toggleLargWidth] = useState(false)
  const [show, toggleShow] = useState(false)
  const [focused, toggleFocuse] = useState(false)
  const [lastWidth, updateWidth] = useState(style.width)

  const { disableAutoExpend, ...btnStyle } = style

  const modifiedStyle = {
    ...btnStyle,
    color: theme.common.inputContainerTextTheme,
  }
  const MInput = multipleLine ? TextArea : TextInputStyled
  const changeInputWidth = (em, val) => {
    // during initialization ref is not attached
    // em is undefined and hence getComputedStyle does not work (EV-10802)
    if (disableAutoExpend || !em) {
      return
    }
    const { width } = measureText(val, getComputedStyle(em))
    const _w = width + (type === 'number' ? 14 : 2)
    if (width < maxWidth && width > (parseInt(style.width, 10) || 140)) {
      em.style.width = `${_w}px`
    } else if (width > maxWidth) {
      em.style.width = `600px`
    }
    if (width > maxWidth) {
      em.style.overflow = 'hidden'
      em.style.textOverflow = 'ellipsis'
      em.style.whiteSpace = 'nowrap'
      toggleLargWidth(true)
    } else {
      em.style.overflow = ''
      em.style.textOverflow = ''
      em.style.whiteSpace = ''
      toggleLargWidth(false)
    }
    updateWidth(_w)
  }

  const handleInputChange = (e) => {
    const em = e.target
    const { value: changedValue } = em
    changeInputWidth(em, changedValue)
    onChange(changedValue)
  }

  const showPopover = () => {
    toggleShow(true)
  }

  const hidePopover = () => {
    toggleShow(false)
  }

  const handleFocuse = () => {
    toggleFocuse(true)
  }

  const handleBuler = (e) => {
    toggleFocuse(false)
    onBlur(e, lastWidth)
  }

  useEffect(() => {
    if (inputRef?.current) {
      const em = multipleLine
        ? inputRef.current.textAreaRef
        : inputRef.current.input
      changeInputWidth(em, value)
    }
  }, [])

  const popoverContent = <PopoverContent>{value}</PopoverContent>
  return (
    <Popover visible={show && largWidth && !focused} content={popoverContent}>
      <MInput
        inputRef={inputRef}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        onFocus={handleFocuse}
        onChange={handleInputChange}
        onBlur={handleBuler}
        wrap={multipleLine ? '' : 'off'}
        value={value || ''}
        style={modifiedStyle}
        type={type}
        {...rest}
      />
    </Popover>
  )
}

AutoExpandInput.propTypes = {
  multipleLine: PropTypes.bool,
  style: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputRef: PropTypes.any,
}

AutoExpandInput.defaultProps = {
  multipleLine: false,
  onChange: () => {},
  onBlur: () => {},
  style: {},
  value: '',
  type: 'text',
  inputRef: null,
}

export default withTheme(AutoExpandInput)

const PopoverContent = styled.div`
  max-width: 600px;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: normal;
`
