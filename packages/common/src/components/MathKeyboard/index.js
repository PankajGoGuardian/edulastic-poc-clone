import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { isObject, compact, isEmpty } from 'lodash'
import { math } from '@edulastic/constants'
import { lightGrey9 } from '@edulastic/colors'
import { IconMoveArrows } from '@edulastic/icons'
import { KEYBOARD_BUTTONS, TAB_BUTTONS } from './constants/keyboardButtons'
import { NUMBER_PAD_ITEMS } from './constants/numberPadItems'

import KeyboardHeader from './components/KeyboardHeader'
// import HeaderKeyboard from "./components/HeaderKeyboard";
import MainKeyboard from './components/MainKeyboard'
import FullKeybord from './components/FullKeybord'
import Keyboard from '../Keyboard'
import {
  StyledGripperContainer,
  StyledGripper,
  StyledArrowContainer,
} from './styled/MathKeyboardStyles'

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
    const { restrictKeys, customKeys, symbols, customKeypads } = this.props
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

    let availables = isCustomMode
      ? compact(
          type.value.map((handler) =>
            allBtns.find((btn) => btn.handler === handler)
          )
        )
      : allBtns.filter((btn) => btn.types.includes(type))

    /**
     * @see https://snapwiz.atlassian.net/browse/EV-28041
     * To render custom keys defined in some other item
     */
    if (isCustomMode && type?.value) {
      let excludedCustomKeys = type.value.filter(
        (handler) =>
          handler &&
          !availables.find((btn) => btn.handler === handler) &&
          !isEmpty(handler.trim())
      )

      excludedCustomKeys = excludedCustomKeys.map((key) => ({
        handler: key,
        label: key,
        types: [type.label],
        command: 'write',
      }))

      availables = availables.concat(excludedCustomKeys)
    }

    let numberButtons = null
    if (this.WITH_NUMBERS.includes(type)) {
      numberButtons = NUMBER_PAD_ITEMS
    }

    let selectOptions = math.symbols
    if (isObject(type)) {
      /**
       * avoid duplication of active keypad (item.symbols[0]) and user's custom keypads
       * if previously saved custom keypad is chosen, it should not add to options
       * it should only add if custom is chosen, but keypad is not saved
       */
      const hasSameId = (keypad) => keypad._id === type?._id
      const alreadyIncluded = customKeypads.some(hasSameId)
      if (!alreadyIncluded) {
        selectOptions = [
          {
            value: symbols[0]._id || symbols[0].label, // custom keypad has UUID
            label: symbols[0].label,
          },
          ...math.symbols,
        ]
      }
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
      customKeypads,
      showDragHandle,
    } = this.props
    const { type, keyboardButtons, numberButtons, selectOptions } = this.state

    return (
      <MathKeyboardContainer
        docBasedKeypadStyles={docBasedKeypadStyles}
        data-cy={type}
      >
        {showDragHandle && (
          <StyledGripperContainer>
            <StyledGripper />
            <StyledArrowContainer className="arrow-container">
              <IconMoveArrows color={lightGrey9} width={15} height={15} />
            </StyledArrowContainer>
          </StyledGripperContainer>
        )}
        <KeyboardHeader
          options={selectOptions}
          showResponse={showResponse}
          showDropdown={showDropdown}
          onInput={onInput}
          method={type}
          onChangeKeypad={this.handleGroupSelect}
          customKeypads={customKeypads}
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
  showDragHandle: PropTypes.bool,
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
  showDragHandle: true,
}

export default connect((state) => ({
  customKeypads: state.customKeypad.keypads,
}))(MathKeyboard)

const MathKeyboardContainer = styled.div`
  /* border: 1px solid ${(props) =>
    props.theme.mathKeyboard.keyboardBorderColor}; */
  background: ${(props) => props.theme.mathKeyboard.keyboardBgColor};
  /* padding: 10px; */
  min-width: 180px;
  max-width: 520px;
  width: max-content;
  text-indent: 0;
  ${({ docBasedKeypadStyles }) => docBasedKeypadStyles};
`
