import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isObject } from 'lodash'
import { math } from '@edulastic/constants'
import { SelectInputStyled } from '@edulastic/common'

const { Option, OptGroup } = SelectInputStyled
const { EMBED_RESPONSE } = math

const KeyboardHeader = ({
  options,
  method,
  showResponse,
  showDropdown,
  onInput,
  onChangeKeypad,
  customKeypads,
}) => {
  const handleClickResponseButton = (e) => {
    e?.preventDefault()
    onInput(EMBED_RESPONSE)
  }

  const hasCustomKeypads = customKeypads?.length > 0

  const handleSelect = (value) => {
    let keypadValue = value
    const sameId = (keypad) => keypad._id === value
    const customKeypad = (customKeypads || []).find(sameId)
    if (customKeypad) {
      keypadValue = customKeypad
    }
    onChangeKeypad(keypadValue)
  }

  return (
    (showDropdown || showResponse) && (
      <Container mb={method !== 'all'}>
        {showDropdown && (
          <SelectInputStyled
            data-cy="math-keyboard-dropdown"
            onSelect={handleSelect}
            value={isObject(method) ? method._id || method.label : method} // custom keypad has UUID
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            minWidth="204px" // width when full keypad mode is selected
          >
            {hasCustomKeypads && (
              <OptGroup label="My custom keypads">
                {customKeypads.map((keypad) => (
                  <Option key={keypad._id} value={keypad._id}>
                    {keypad.label}
                  </Option>
                ))}
              </OptGroup>
            )}
            <OptGroup label="Standard Keypads">
              {options.map(({ value, label }, index) => (
                <Option
                  value={value}
                  key={index}
                  data-cy={`math-keyboard-dropdown-list-${index}`}
                >
                  {label}
                </Option>
              ))}
            </OptGroup>
          </SelectInputStyled>
        )}
        {showResponse && (
          <ResponseBtn
            onClick={handleClickResponseButton}
            onTouchEnd={handleClickResponseButton}
            data-cy="keyboard-response"
          >
            <span className="response-embed">
              <span className="response-embed__char">R</span>
              <span className="response-embed__text">Response</span>
            </span>
          </ResponseBtn>
        )}
      </Container>
    )
  )
}

KeyboardHeader.propTypes = {
  options: PropTypes.array.isRequired,
  method: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  showResponse: PropTypes.bool.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  onInput: PropTypes.func,
  onChangeKeypad: PropTypes.func,
}

KeyboardHeader.defaultProps = {
  onInput: () => null,
  onChangeKeypad: () => null,
}

export default KeyboardHeader

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 1rem 1.5rem 0px 1.5rem;

  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    margin: 5px 0px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.65);
  }
`

const ResponseBtn = styled.div`
  cursor: pointer;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.theme.mathKeyboard.numFontSize};
  font-weight: ${(props) => props.theme.mathKeyboard.numFontWeight};
`
