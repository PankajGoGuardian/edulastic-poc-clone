import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isObject, compact } from 'lodash'
import { math } from '@edulastic/constants'
import { KEYBOARD_BUTTONS, TAB_BUTTONS } from './constants/keyboardButtons'
import { NUMBER_PAD_ITEMS } from './constants/numberPadItems'

import KeyboardHeader from './components/KeyboardHeader'
// import HeaderKeyboard from "./components/HeaderKeyboard";
import MainKeyboard from './components/MainKeyboard'
import FullKeybord from './components/FullKeybord'
import Keyboard from '../Keyboard'

class MathKeyboard extends React.PureComponent {
  static KEYBOARD_BUTTONS = KEYBOARD_BUTTONS

  static TAB_BUTTONS = TAB_BUTTONS

  static TAB_BUTTONS_FLATTENED = (TAB_BUTTONS || []).flatMap(
    (obj) => obj.buttons
  )

  static NUMBER_PAD_ITEMS = NUMBER_PAD_ITEMS

  WITH_NUMBERS = [
    math.keyboardMethods.BASIC,
    math.keyboardMethods.INTERMEDIATE,
    math.keyboardMethods.ALL_BUTTONS,
  ]

  constructor(props) {
    super(props)
    this.state = {
      type: '',
      numberButtons: null,
      selectOptions: [],
      keyboardButtons: [],
    }
  }

  componentDidMount() {
    this.setKeyboardButtons()
  }

  componentDidUpdate(prevProps, prevState) {
    const { symbols, dynamicVariableInput } = this.props
    const { symbols: prevSymbols } = prevProps
    const { type } = this.state
    const { type: prevType } = prevState

    if (dynamicVariableInput && type !== prevType) {
      this.setKeyboardButtons(type)
    }

    if (symbols[0] !== prevSymbols[0]) {
      this.setKeyboardButtons()
    }
  }

  handleGroupSelect = (value) => {
    const { onChangeKeypad } = this.props
    if (onChangeKeypad) {
      onChangeKeypad(value)
    }
    this.setState({
      type: value,
    })
  }

  setKeyboardButtons(keypadType) {
    const { restrictKeys, customKeys, symbols } = this.props
    const type = symbols[0] || keypadType || math.keyboardMethods.BASIC

    const isCustomMode = isObject(type)

    const restrictButtons = restrictKeys.map((key) => ({
      handler: key,
      label: key,
      types: [isCustomMode ? type.label : type],
      command: 'write',
    }))

    let allBtns = customKeys
      .map((key) => ({
        handler: key,
        label: key,
        types: [isCustomMode ? type.label : type],
        command: 'write',
      }))
      .concat(KEYBOARD_BUTTONS)

    if (isCustomMode) {
      allBtns = allBtns.concat(
        TAB_BUTTONS.reduce((acc, curr) => [...acc, ...curr.buttons], [])
      )
    }

    const availables = isCustomMode
      ? compact(
          type.value.map((handler) =>
            allBtns.find((btn) => btn.handler === handler)
          )
        )
      : allBtns.filter((btn) => btn.types.includes(type))

    let numberButtons = null
    if (this.WITH_NUMBERS.includes(type)) {
      numberButtons = NUMBER_PAD_ITEMS
    }

    let selectOptions = math.symbols
    if (isObject(type)) {
      selectOptions = [
        {
          value: symbols[0].label,
          label: symbols[0].label,
        },
        ...math.symbols,
      ]
    }

    this.setState({
      keyboardButtons: restrictButtons.concat(availables),
      type,
      numberButtons,
      selectOptions,
    })
  }

  render() {
    const {
      onInput,
      showResponse,
      showDropdown,
      docBasedKeypadStyles,
    } = this.props
    const { type, keyboardButtons, numberButtons, selectOptions } = this.state
    return (
      <MathKeyboardContainer docBasedKeypadStyles={docBasedKeypadStyles}>
        <KeyboardHeader
          options={selectOptions}
          showResponse={showResponse}
          showDropdown={showDropdown}
          onInput={onInput}
          method={type}
          onChangeKeypad={this.handleGroupSelect}
        />
        {/* {type !== "qwerty" && window.isMobileDevice && <HeaderKeyboard onInput={onInput} />} */}
        {type === 'qwerty' && <Keyboard onInput={onInput} />}
        {type !== 'qwerty' && type !== 'all' && (
          <MainKeyboard
            onInput={onInput}
            type={type}
            btns={keyboardButtons}
            numbers={numberButtons}
          />
        )}
        {type !== 'qwerty' && type === 'all' && (
          <FullKeybord onInput={onInput} numbers={numberButtons} />
        )}
      </MathKeyboardContainer>
    )
  }
}

MathKeyboard.propTypes = {
  symbols: PropTypes.array,
  restrictKeys: PropTypes.array,
  customKeys: PropTypes.array,
  showResponse: PropTypes.bool,
  showDropdown: PropTypes.bool,
  onInput: PropTypes.func,
  onChangeKeypad: PropTypes.func,
  dynamicVariableInput: PropTypes.bool,
}

MathKeyboard.defaultProps = {
  symbols: [],
  restrictKeys: [],
  customKeys: [],
  showResponse: false,
  showDropdown: false,
  onInput: () => null,
  onChangeKeypad: () => null,
  dynamicVariableInput: false,
}

export default MathKeyboard

const MathKeyboardContainer = styled.div`
  /* border: 1px solid ${(props) =>
    props.theme.mathKeyboard.keyboardBorderColor}; */
  background: ${(props) => props.theme.mathKeyboard.keyboardBgColor};
  /* padding: 10px; */
  min-width: 180px;
  max-width: 520px;
  width: max-content;
  ${({ docBasedKeypadStyles }) => docBasedKeypadStyles};
`
