import {
  MathKeyboard,
  reformatMathInputLatex,
  notification,
} from '@edulastic/common'
import { math } from '@edulastic/constants'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import { MathInputStyles, EmptyDiv, KeyboardIcon } from './MathInputStyles'
import Draggable from './Draggable'

const { EMBED_RESPONSE, keyboardMethods } = math
const MAX_CONTENT_LENGTH = 1200

class MathInput extends React.PureComponent {
  state = {
    mathField: null,
    mathFieldFocus: false,
  }

  containerRef = React.createRef()

  mathFieldRef = React.createRef()

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.handleClick, false)
    document.removeEventListener('click', this.handleChangeField, false)
    this.setState({ mathFieldFocus: false })
  }

  handleClick = (e) => {
    const { onFocus } = this.props
    const { mathFieldFocus } = this.state
    let shouldHideKeyboard = true
    const jQueryTargetElem = jQuery(e.target)
    if (
      jQueryTargetElem.hasClass('keyboard') ||
      jQueryTargetElem.hasClass('num') ||
      jQueryTargetElem.hasClass('keyboardButton')
    ) {
      e.preventDefault()
      shouldHideKeyboard = false
    }

    if (jQueryTargetElem.hasClass('ant-select')) {
      shouldHideKeyboard = false
    }

    if (
      e.target?.nodeName === 'LI' &&
      e.target?.attributes?.[0]?.nodeValue === 'option'
    ) {
      shouldHideKeyboard = false
    }
    if (
      shouldHideKeyboard &&
      this.containerRef.current &&
      !this.containerRef.current.contains(e.target) &&
      mathFieldFocus
    ) {
      onFocus(false)
      this.setState({ mathFieldFocus: false })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { mathField } = this.state
    const { resetMath } = this.props
    if (resetMath && mathField && mathField.latex() !== nextProps.value) {
      mathField.latex(this.sanitizeLatex(nextProps.value))
    }
  }

  componentDidMount() {
    const { defaultFocus, value } = this.props
    if (!window.MathQuill) return

    const MQ = window.MathQuill.getInterface(2)

    MQ.registerEmbed('response', () => ({
      htmlString: `<span class="response-embed">
        <span class="response-embed__char">R</span>
        <span class="response-embed__text">Response</span>
      </span>`,
      text() {
        return 'custom_embed'
      },
      latex() {
        return EMBED_RESPONSE
      },
    }))

    const mathField = MQ.MathField(this.mathFieldRef.current, window.MathQuill)
    this.mQuill = mathField
    mathField.write(this.sanitizeLatex(value))
    this.mathField1 = mathField
    if (defaultFocus) {
      mathField.focus()
    }

    const keyboardPosition = this.getKeyboardPosition()
    this.setState(
      {
        mathField,
        keyboardPosition,
        hideKeyboardByDefault: window.isMobileDevice,
      },
      () => {
        // const { hideKeyboardByDefault } = this.state;
        const textarea = mathField.el().querySelector('.mq-textarea textarea')
        textarea.setAttribute('data-cy', `answer-input-math-textarea`)
        // if (!hideKeyboardByDefault) {
        //   textarea.setAttribute("readonly", "readonly");
        // }
        textarea.addEventListener('keyup', this.handleChangeField)
        textarea.addEventListener('keypress', this.handleKeypress)
        textarea.addEventListener('keydown', this.handleTabKey, false)
        textarea.addEventListener('paste', this.handlePaste)
        textarea.addEventListener('blur', this.handleBlur, false)
        document.addEventListener('click', this.handleClick, false)
      }
    )
  }

  getKeyboardPosition() {
    const { symbols } = this.props
    const {
      top,
      left,
      height: inputH,
    } = this.containerRef.current.getBoundingClientRect()

    // dynamic variable formula input does not pass keyboard type(styles)
    // so in this case, need to use `basic` mode
    // @see: https://snapwiz.atlassian.net/browse/EV-21988

    const { width, height: keyboardH } = math.symbols.find(
      (x) => x.value === (symbols[0] || keyboardMethods.BASIC)
    ) || { width: 0, height: 0 }

    // 8 is margin between math keyboard and math input
    let x = left
    let y = top + inputH + 4

    const xdiff = window.innerWidth - left - width

    if (xdiff < 0) {
      x += xdiff
    }

    const ydiff = window.innerHeight - y - keyboardH
    if (ydiff < 0) {
      y = y - keyboardH - inputH - 8
    }

    return { x, y }
  }

  maxContentLimit = (textLength) => {
    return textLength >= MAX_CONTENT_LENGTH
  }

  handlePaste = (evt) => {
    const { contentLength } = this.props
    const clipData = evt.clipboardData || window.clipboardData
    const clipText = clipData.getData('text/plain') || ''
    const text = clipText + this.mQuill.latex()

    // Checks max limit on pasting
    if (
      this.maxContentLimit(text.length) ||
      this.maxContentLimit(contentLength + clipText?.length)
    ) {
      evt.preventDefault()
      notification({ messageKey: 'maxContentLimit' })
    }
  }

  handleTabKey = (evt) => {
    // Checks max limit on keypress
    const { contentLength } = this.props

    if ([8, 9].includes(evt?.keyCode)) {
      this.setState({ mathFieldFocus: false })
    }
    const text = this.mQuill.latex() || ''
    if (
      this.maxContentLimit(text.length) ||
      this.maxContentLimit(contentLength)
    ) {
      evt.preventDefault()
    }
  }

  sanitizeLatex = (v) => (v?.toString() || '').replace(/&amp;/g, '&')

  handleKeypress = (e) => {
    const {
      restrictKeys,
      allowNumericOnly,
      value = '',
      onKeyPress,
    } = this.props
    const isNonNumericKey = e.key && !e.key.match(/[0-9+-.%^@/]/g)

    if (!isEmpty(restrictKeys)) {
      const isSpecialChar = !!(e.key.length > 1 || e.key.match(/[^a-zA-Z]/g))
      const isArrowOrShift =
        (e.keyCode >= 37 && e.keyCode <= 40) ||
        e.keyCode === 16 ||
        e.keyCode === 8
      if (allowNumericOnly || !(isSpecialChar || isArrowOrShift)) {
        const isValidKey = restrictKeys.includes(e.key) || !isNonNumericKey
        if (!isValidKey) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      return
    }

    if (allowNumericOnly) {
      const isDynamicVar = value && value[value.length - 1] === '@'
      if (isDynamicVar) {
        if (!e.key.match(/[a-zA-Z]/g)) {
          e.preventDefault()
          e.stopPropagation()
        }
        return
      }

      if (isNonNumericKey) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    if (onKeyPress) {
      onKeyPress(e)
    }
  }

  handleBlur = (ev) => {
    const { onBlur } = this.props
    if (onBlur) {
      onBlur(ev)
    }
  }

  handleChangeField = () => {
    const { onInput: saveAnswer } = this.props
    const { mathField } = this.state

    const text = reformatMathInputLatex(mathField.latex())
    saveAnswer(text.replace(/\\square/g, '\\square '))
  }

  onInput = (key, command = 'cmd', numToMove) => {
    const { mathField } = this.state
    const { contentLength } = this.props

    if (!mathField) return

    const text = reformatMathInputLatex(mathField.latex()) || ''

    // Checks max limit when using math keyboard
    if (
      this.maxContentLimit(text.length) ||
      this.maxContentLimit(contentLength)
    ) {
      return ''
    }

    switch (key) {
      case 'in':
        mathField.write('in')
        break
      case 'left_move':
        mathField.keystroke('Left')
        break
      case 'right_move':
        mathField.keystroke('Right')
        break
      case 'ln--':
        mathField.write('ln\\left(\\right)')
        break
      case 'leftright3':
        mathField.write('\\sqrt[3]{}')
        break
      case 'Backspace':
        mathField.keystroke('Backspace')
        break
      case 'leftright2':
        mathField.write('^2')
        break
      case 'down_move':
        mathField.keystroke('Down')
        break
      case 'up_move':
        mathField.keystroke('Up')
        break
      case '{':
        mathField.write('\\lbrace')
        break
      case '}':
        mathField.write('\\rbrace')
        break
      case '\\embed{response}':
        mathField.write(key)
        break
      case '{}':
        mathField[command]('{')
        break
      default:
        mathField[command](key)
    }

    // move cursor into start of key(latex)
    if (command === 'write' && numToMove) {
      for (let i = 0; i < numToMove; i++) {
        mathField.keystroke('Left')
      }
    }

    mathField.focus()
    this.handleChangeField()
  }

  onClickMathField = () => {
    const { disabled } = this.props
    const { hideKeyboardByDefault } = this.state
    if (!hideKeyboardByDefault && !disabled) {
      const keyboardPosition = this.getKeyboardPosition()
      this.setState({ mathFieldFocus: true, keyboardPosition }, this.focus)
    }
  }

  focus = () => {
    const { onFocus, onInnerFieldClick } = this.props
    const { mathField } = this.state
    if (mathField) {
      mathField.focus()
    }
    if (onFocus) {
      onFocus(true)
    }
    if (onInnerFieldClick) {
      onInnerFieldClick()
    }
  }

  toggleHideKeyboard = () => {
    this.setState(
      (state) => ({
        hideKeyboardByDefault: !state.hideKeyboardByDefault,
      }),
      () => {
        const { hideKeyboardByDefault } = this.state
        const textarea = this.mQuill.el().querySelector('.mq-textarea textarea')
        if (hideKeyboardByDefault) {
          textarea.removeAttribute('readonly')
          textarea.focus()
        } else {
          textarea.setAttribute('readonly', 'readonly')
          textarea.blur()
          this.setState({ mathFieldFocus: true })
        }
      }
    )
  }

  render() {
    const {
      alwaysShowKeyboard,
      alwaysHideKeyboard,
      onChangeKeypad,
      showResponse,
      showDropdown,
      style,
      onKeyDown,
      onKeyUp,
      symbols,
      numberPad,
      fullWidth,
      height,
      background,
      className,
      restrictKeys,
      customKeys,
      dynamicVariableInput,
      disabled,
      maxWidth,
      paddingRight,
      showDragHandle,
    } = this.props

    const {
      mathFieldFocus,
      hideKeyboardByDefault,
      keyboardPosition,
    } = this.state
    const visibleKeypad =
      !alwaysHideKeyboard &&
      !alwaysShowKeyboard &&
      mathFieldFocus &&
      !hideKeyboardByDefault

    const MathKeyboardWrapper = alwaysShowKeyboard ? EmptyDiv : Draggable

    return (
      <MathInputStyles
        fullWidth={fullWidth}
        className={className}
        fontStyle={
          symbols[0] === keyboardMethods.UNITS_SI ||
          symbols[0] === keyboardMethods.UNITS_US
            ? 'normal'
            : 'italic'
        }
        width={style.width}
        maxWidth={maxWidth}
        height={height}
        pr={paddingRight}
        background={background}
        fontSize={style.fontSize}
        ref={this.containerRef}
        onKeyUp={onKeyUp}
        disabled={disabled}
      >
        <div className="input" onClick={this.onClickMathField}>
          <div
            onKeyDown={onKeyDown}
            className="input__math answer-math-input-field"
            data-cy="answer-math-input-field"
          >
            <span className="input__math__field" ref={this.mathFieldRef} />

            {window.isMobileDevice && (
              <KeyboardIcon
                onClick={this.toggleHideKeyboard}
                className={
                  hideKeyboardByDefault
                    ? 'fa fa-calculator'
                    : 'fa fa-keyboard-o'
                }
                aria-hidden="true"
              />
            )}
          </div>
        </div>
        {(visibleKeypad || alwaysShowKeyboard) && (
          <MathKeyboardWrapper
            className="input__keyboard"
            position={keyboardPosition}
          >
            <MathKeyboard
              symbols={symbols}
              numberPad={numberPad}
              restrictKeys={restrictKeys}
              customKeys={customKeys}
              showResponse={showResponse}
              showDropdown={showDropdown}
              onChangeKeypad={onChangeKeypad}
              onInput={(key, command, numToMove) =>
                this.onInput(key, command, numToMove)
              }
              dynamicVariableInput={dynamicVariableInput}
              showDragHandle={showDragHandle}
            />
          </MathKeyboardWrapper>
        )}
      </MathInputStyles>
    )
  }
}

MathInput.propTypes = {
  alwaysShowKeyboard: PropTypes.bool,
  alwaysHideKeyboard: PropTypes.bool,
  defaultFocus: PropTypes.bool,
  onInput: PropTypes.func.isRequired,
  symbols: PropTypes.array,
  numberPad: PropTypes.array.isRequired,
  onInnerFieldClick: PropTypes.func,
  showDropdown: PropTypes.bool,
  showResponse: PropTypes.bool,
  value: PropTypes.string,
  style: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeKeypad: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  restrictKeys: PropTypes.array,
  allowNumericOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  customKeys: PropTypes.array,
  contentLength: PropTypes.number,
  resetMath: PropTypes.bool,
  showDragHandle: PropTypes.bool,
}

MathInput.defaultProps = {
  alwaysShowKeyboard: false,
  alwaysHideKeyboard: false,
  defaultFocus: false,
  value: '',
  allowNumericOnly: false,
  showDropdown: false,
  showResponse: false,
  style: {},
  customKeys: [],
  restrictKeys: [],
  onInnerFieldClick: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onKeyDown: () => {},
  onKeyPress: () => {},
  onChangeKeypad: () => {},
  fullWidth: false,
  disabled: false,
  className: '',
  symbols: [],
  contentLength: 0,
  resetMath: false,
  showDragHandle: true,
}

export default MathInput
