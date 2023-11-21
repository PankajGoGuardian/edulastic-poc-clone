import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import {
  themeColor,
  white,
  grey,
  secondaryTextColor,
  darkGrey,
} from '@edulastic/colors'

const Checkbox = ({
  onChange,
  checked,
  label,
  style,
  className,
  labelFontSize,
  textTransform,
  disabled,
  darkBorder,
}) => {
  const onClickHandler = () => {
    if (!disabled) {
      onChange()
    }
  }
  return (
    <Container
      data-cy="multi"
      onClick={onClickHandler}
      style={style}
      className={className}
      disabled={disabled}
    >
      <Input type="checkbox" checked={checked} onChange={() => {}} />
      <span
        style={{
          border: darkBorder ? `solid 1px ${darkGrey}` : `solid 1px ${grey}`,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: labelFontSize,
            fontWeight: 600,
            color: disabled ? darkGrey : secondaryTextColor,
            textTransform,
          }}
          className="label"
        >
          {label}
        </span>
      )}
    </Container>
  )
}

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  label: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  labelFontSize: PropTypes.string,
  textTransform: PropTypes.string,
  disabled: PropTypes.bool,
}

Checkbox.defaultProps = {
  style: {},
  label: '',
  className: '',
  checked: false,
  labelFontSize: '13px',
  textTransform: null,
  disabled: false,
}

export default Checkbox

const Input = styled.input`
  display: none;

  + span {
    display: inline-block;
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    vertical-align: middle;
    background: ${white} left top no-repeat;
    border: solid 1px ${grey};
    margin-right: 10px;
  }

  &:checked + span {
    background: ${themeColor};
    border-color: ${themeColor};
  }

  + span:after {
    display: block;
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 4px;
    height: 9px;
    border: solid ${white};
    border-width: 0 1px 1px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`

const disabledStyle = css`
  cursor: not-allowed;
`

const Container = styled.span`
  cursor: pointer;
  user-select: none;
  ${({ disabled }) => (disabled ? disabledStyle : ``)}
`
