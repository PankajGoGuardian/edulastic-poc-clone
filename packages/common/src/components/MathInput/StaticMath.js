import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import { math } from '@edulastic/constants'
import { MathKeyboard, reformatMathInputLatex } from '@edulastic/common'

import { MathInputStyles, EmptyDiv } from './MathInputStyles'
import Draggable from './Draggable'

import { WithResources } from '../../HOC/withResources'
import AppConfig from '../../../../../src/app-config'

const sanitizeLatex = (v) => v.replace(/&amp;/g, '&')

const getKeyboardPosition = (el, symbols) => {
  const { top, left, height: inputH } = el.getBoundingClientRect()

  // dynamic variable formula input does not pass keyboard type(styles)
  // so in this case, need to use `basic` mode
  // @see: https://snapwiz.atlassian.net/browse/EV-21988
  const { width, height: keyboardH } = math.symbols.find(
    (x) => x.value === (symbols[0] || 'basic')
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

const getIndex = (el) => parseInt(el.id.replace('inner-', ''), 10)

const generateIcon = (useKeyboard, index) => {
  const span = document.createElement('span')
  const icon = document.createElement('i')
  span.classList.add('StaticMathKeyBoardIcon')
  if (useKeyboard) {
    icon.classList.add('fa', 'fa-keyboard-o')
  } else {
    icon.classList.add('fa', 'fa-calculator')
  }
  span.setAttribute('data-index', index)
  span.appendChild(icon)
  return span
}

const appendIcon = (field, useMathKeyboard, onClick) => {
  const index = getIndex(field)
  const newIcon = generateIcon(useMathKeyboard, index)
  const prevIcons = field.getElementsByClassName('StaticMathKeyBoardIcon')
  for (const em of prevIcons) {
    field.removeChild(em)
  }
  newIcon.addEventListener('click', onClick)
  field.appendChild(newIcon)

  const textarea = field.querySelector('.mq-textarea textarea')
  textarea.setAttribute('aria-label', `Answer Input Math`)
  if (useMathKeyboard) {
    textarea.setAttribute('readonly', 'readonly')
  } else {
    textarea.removeAttribute('readonly')
  }
}

const getIconStatus = (latex) => {
  if (window.isMobileDevice && latex) {
    const numOfTemplates = latex?.match(/\\MathQuillMathField{}/g)?.length
    return new Array(numOfTemplates).fill(false)
  }
  return []
}

const StaticMath = ({
  style,
  onInput,
  onInnerFieldClick,
  symbols,
  numberPad,
  latex,
  innerValues,
  restrictKeys,
  customKeys,
  alwaysShowKeyboard,
  noBorder,
}) => {
  const [keyboardPosition, setKeyboardPosition] = useState(null)
  const [changed, setChanged] = useState(null)
  const iconStatus = useRef([])
  const containerRef = useRef(null)
  const currentField = useRef(null)
  const mathFieldRef = useRef(null)
  const mQuill = useRef(null)

  const handleClickOutside = useCallback((e) => {
    if (
      e.target.nodeName === 'svg' ||
      e.target.nodeName === 'path' ||
      (e.target.nodeName === 'LI' &&
        e.target.attributes[0]?.nodeValue === 'option')
    ) {
      return
    }
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setKeyboardPosition(null)
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const MathKeyboardWrapper = useMemo(
    () => (alwaysShowKeyboard ? EmptyDiv : Draggable),
    [alwaysShowKeyboard]
  )

  const MQ = useMemo(() => {
    if (window.MathQuill) {
      return window.MathQuill.getInterface(2)
    }
  }, [])

  const handleSave = useCallback(() => {
    if (!mQuill.current) {
      return []
    }
    const { innerFields = [] } = mQuill.current
    const newValues = innerFields.map((field) =>
      reformatMathInputLatex(field.latex())
    )
    onInput(newValues)
  }, [])

  const handleFocusInner = (innerField) => () => {
    const index = getIndex(innerField.el())
    if (
      !window.isMobileDevice ||
      (window.isMobileDevice && iconStatus.current?.[index])
    ) {
      setKeyboardPosition(getKeyboardPosition(innerField.el(), symbols))
    }
    onInnerFieldClick(index)
    currentField.current = innerField
    document.addEventListener('click', handleClickOutside, false)
  }

  const handleClickMath = (evt) => {
    if (mQuill.current) {
      const { innerFields = [] } = mQuill.current
      const hasFocused = innerFields
        .map((ee) => ee?.__controller?.blurred)
        .some((x) => !x)

      if (!hasFocused) {
        const t = mQuill.current?.__controller.cursor.hide()?.parent?.parent
        if (t) {
          if (t?.jQ?.length > 0) {
            const index = getIndex(t.jQ[0])
            const innerField = innerFields[index]
            innerField.clickAt(evt.clientX, evt.clientY, evt.target)
            innerField.el().click()
          } else {
            t.controller.textarea.focus()
          }
        }
      }
    }
  }

  const handleBlur = useCallback(() => {
    mQuill.current?.__controller?.cursor?.hide()
  }, [])

  const onInputKeyboard = (key, command = 'cmd', numToMove) => {
    if (!currentField.current) {
      return
    }
    if (key === 'in') {
      currentField.current.write('in')
    } else if (key === 'left_move') {
      currentField.current.keystroke('Left')
    } else if (key === 'right_move') {
      currentField.current.keystroke('Right')
    } else if (key === 'ln--') {
      currentField.current.write('ln\\left(\\right)')
    } else if (key === 'leftright3') {
      currentField.current.write('\\sqrt[3]{}')
    } else if (key === 'Backspace') {
      currentField.current.keystroke('Backspace')
    } else if (key === 'leftright2') {
      currentField.current.write('^2')
    } else if (key === 'down_move') {
      currentField.current.keystroke('Down')
    } else if (key === 'up_move') {
      currentField.current.keystroke('Up')
    } else {
      currentField.current[command](key)
    }

    // move cursor into start of key(latex)
    if (command === 'write' && numToMove) {
      for (let i = 0; i < numToMove; i++) {
        currentField.current.keystroke('Left')
      }
    }
    currentField.current.focus()
    handleSave()
  }

  const goTo = (innerFieldIdx) => {
    if (!mQuill.current) {
      return
    }
    const { innerFields = [] } = mQuill.current
    const nextField = innerFields[innerFieldIdx]
    if (nextField) {
      nextField.focus().el().click()
      onInnerFieldClick(getIndex(nextField.el()))
    }
  }

  const toggleHideKeyboard = (evt) => {
    const index = evt.target.getAttribute('data-index')
    if (iconStatus.current && index) {
      iconStatus.current[index] = !iconStatus.current[index]
      setChanged(iconStatus.current[index])
    }
  }

  useEffect(() => {
    if (mathFieldRef.current && MQ) {
      try {
        mQuill.current = MQ.StaticMath(mathFieldRef.current)
        mQuill.current.latex(sanitizeLatex(latex))
        const { innerFields = [] } = mQuill.current
        innerFields.forEach((field, indx) => {
          field.el().id = `inner-${indx}`
          field.el().addEventListener('click', handleFocusInner(field))
          field.el().addEventListener('keyup', handleSave)
          field.config({
            handlers: {
              upOutOf(pInnerField) {
                goTo(getIndex(pInnerField.el()) - 1)
              },
              downOutOf(pInnerField) {
                goTo(getIndex(pInnerField.el()) + 1)
              },
              moveOutOf: (dir, pInnerField) => {
                if (dir === MQ.L) {
                  goTo(getIndex(pInnerField.el()) - 1)
                } else if (dir === MQ.R) {
                  goTo(getIndex(pInnerField.el()) + 1)
                }
              },
            },
          })
          field.latex('')
          const textarea = field.el().querySelector('.mq-textarea textarea')
          textarea.setAttribute('aria-label', `Answer Input Math`)
          textarea.addEventListener('blur', handleBlur, false)
        })
        iconStatus.current = getIconStatus(latex)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }, [latex])

  useEffect(() => {
    if (!mQuill.current) return
    const { innerFields = [] } = mQuill.current
    const hasNoInnerValues = isEmpty(innerValues)
    innerFields.forEach((field, indx) => {
      const canWrite = (innerValues && !field.latex()) || hasNoInnerValues
      if (canWrite) {
        field.latex(innerValues[indx] || '')
      }
    })
  }, [innerValues])

  useEffect(() => {
    if (window.isMobileDevice && mQuill.current) {
      const { innerFields = [] } = mQuill.current
      innerFields.forEach((field, index) => {
        appendIcon(field.el(), iconStatus.current?.[index], toggleHideKeyboard)
      })
    }
  }, [latex, changed])

  const noKeypadMode = symbols?.[0] === math.NO_KEYPAD.value

  return (
    <MathInputStyles
      noBorder={noBorder}
      noPadding
      ref={containerRef}
      minWidth={style.width}
      minHeight={style.height}
      fontSize={style.fontSize}
      showKeyboardIcon={window.isMobileDevice}
      onClick={handleClickMath}
    >
      <div className="input">
        <div className="input__math" data-cy="answer-math-input-style">
          <span
            className={
              window.isMobileDevice
                ? 'input__math__field mobile-view'
                : 'input__math__field'
            }
            ref={mathFieldRef}
            data-cy="answer-math-input-field"
          />
        </div>
        {(!isEmpty(keyboardPosition) || alwaysShowKeyboard) && !noKeypadMode && (
          <MathKeyboardWrapper
            className="input__keyboard"
            position={keyboardPosition}
          >
            <MathKeyboard
              symbols={symbols}
              numberPad={numberPad}
              restrictKeys={restrictKeys}
              customKeys={customKeys}
              showResponse={false}
              onInput={onInputKeyboard}
            />
          </MathKeyboardWrapper>
        )}
      </div>
    </MathInputStyles>
  )
}

StaticMath.propTypes = {
  style: PropTypes.object,
  onInput: PropTypes.func.isRequired,
  onInnerFieldClick: PropTypes.func,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  latex: PropTypes.string.isRequired,
  customKeys: PropTypes.array,
  restrictKeys: PropTypes.array,
  innerValues: PropTypes.array,
  alwaysShowKeyboard: PropTypes.bool,
}

StaticMath.defaultProps = {
  style: {},
  customKeys: [],
  restrictKeys: [],
  innerValues: [],
  onInnerFieldClick: () => {},
  alwaysShowKeyboard: false,
}

const StaticMathWithResources = (props) => (
  <WithResources
    criticalResources={[AppConfig.jqueryPath]}
    resources={[
      `${AppConfig.mathquillPath}/mathquill.css`,
      `${AppConfig.mathquillPath}/mathquill.min.js`,
    ]}
    fallBack={<span />}
  >
    <StaticMath {...props} />
  </WithResources>
)

export default connect((state) => ({
  customKeypads: state.customKeypad.keypads,
}))(StaticMathWithResources)
