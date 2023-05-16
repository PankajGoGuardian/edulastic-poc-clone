import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { math } from '@edulastic/constants'
import { MathKeyboard, reformatMathInputLatex } from '@edulastic/common'
import { MathInputStyles, EmptyDiv } from './MathInputStyles'
import Draggable from './Draggable'

import { WithResources } from '../../HOC/withResources'
import AppConfig from '../../../../../src/app-config'

const StaticMath = ({
  style,
  onBlur,
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
  const [mathField, setMathField] = useState(null)
  const [currentInnerField, setCurrentInnerField] = useState(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardPosition, setKeyboardPosition] = useState({})

  const containerRef = useRef(null)
  const mathFieldRef = useRef(null)

  const handleClick = (e) => {
    if (
      e.target.nodeName === 'svg' ||
      e.target.nodeName === 'path' ||
      (e.target.nodeName === 'LI' &&
        e.target.attributes[0]?.nodeValue === 'option')
    ) {
      return
    }
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowKeyboard(false)
    }
  }

  const setInnerFieldsFocuses = () => {
    if (!mathField || !mathField.innerFields || !mathField.innerFields.length) {
      return
    }

    if (!window.MathQuill) return
    const MQ = window.MathQuill.getInterface(2)

    const goTo = (fieldIndex) => {
      const nextField = mathField.innerFields[fieldIndex]
      if (nextField) {
        nextField.focus().el().click()
        onInnerFieldClick(nextField)
      }
    }

    mathField.innerFields.forEach((field) => {
      const getIndex = (id) => parseInt(id.replace('inner-', ''), 10)

      field.config({
        handlers: {
          upOutOf(pInnerField) {
            goTo(getIndex(pInnerField.el().id) - 1)
          },
          downOutOf(pInnerField) {
            goTo(getIndex(pInnerField.el().id) + 1)
          },
          moveOutOf: (dir, pInnerField) => {
            if (dir === MQ.L) {
              goTo(getIndex(pInnerField.el().id) - 1)
            } else if (dir === MQ.R) {
              goTo(getIndex(pInnerField.el().id) + 1)
            }
          },
        },
      })
    })
  }

  const getLatex = () => {
    if (!mathField) return
    return reformatMathInputLatex(mathField.latex())
  }

  const getKeyboardPosition = (el) => {
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

  const onFocus = (newInnerField) => {
    setKeyboardPosition(getKeyboardPosition(newInnerField.el()))
    setCurrentInnerField(newInnerField)
    onInnerFieldClick(newInnerField)
    setShowKeyboard(true)
  }

  const onKeyboardClose = () => {
    setShowKeyboard(false)
  }

  const sanitizeLatex = (v) => v.replace(/&amp;/g, '&')

  const setLatex = (newLatex) => {
    if (!mathField) return
    mathField.latex(sanitizeLatex(newLatex))

    for (let i = 0; i < mathField.innerFields.length; i++) {
      mathField.innerFields[i].el().id = `inner-${i}`
      mathField.innerFields[i].el().addEventListener('click', () => {
        onFocus(mathField.innerFields[i])
      })
      mathField.innerFields[i].el().addEventListener('keyup', () => {
        onInput(getLatex())
      })
    }

    setInnerFieldsFocuses()
  }

  const setInnerFieldValues = (values) => {
    if (!mathField || !mathField.innerFields) return
    for (let i = 0; i < mathField.innerFields.length; i++) {
      if (!mathField.innerFields[i]) continue
      mathField.innerFields[i].latex('')
      if (!values[i]) continue
      mathField.innerFields[i].write(values[i])
    }
  }

  const onInputKeyboard = (key, command = 'cmd') => {
    if (!currentInnerField) return
    if (key === 'in') {
      currentInnerField.write('in')
    } else if (key === 'left_move') {
      currentInnerField.keystroke('Left')
    } else if (key === 'right_move') {
      currentInnerField.keystroke('Right')
    } else if (key === 'ln--') {
      currentInnerField.write('ln\\left(\\right)')
    } else if (key === 'leftright3') {
      currentInnerField.write('\\sqrt[3]{}')
    } else if (key === 'Backspace') {
      currentInnerField.keystroke('Backspace')
    } else if (key === 'leftright2') {
      currentInnerField.write('^2')
    } else if (key === 'down_move') {
      currentInnerField.keystroke('Down')
    } else if (key === 'up_move') {
      currentInnerField.keystroke('Up')
    } else {
      currentInnerField[command](key)
    }
    currentInnerField.focus()

    onInput(getLatex())
  }

  const onBlurInput = () => {
    if (onBlur) {
      onBlur(getLatex())
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick, false)

    return function cleanup() {
      document.removeEventListener('click', handleClick, false)
    }
  })

  useEffect(() => {
    if (!window.MathQuill) return
    const MQ = window.MathQuill.getInterface(2)
    if (mathFieldRef.current) {
      try {
        setMathField(MQ.StaticMath(mathFieldRef.current))
        // eslint-disable-next-line no-empty
      } catch (e) {}
      setLatex(latex)
      setTimeout(() => {
        setInnerFieldValues(innerValues)
      })
    }
  }, [mathFieldRef.current])

  useEffect(() => {
    setLatex(latex)
    setInnerFieldValues(innerValues)
  }, [latex])

  useEffect(() => {
    // if userAnswer is cleared, innervalues becomes an empty Array,
    // in which case restore the latex to default
    if (innerValues.length === 0) setLatex(latex)
    // TODO: there is a lot of redundant code in these math components, which should be removed.
    // but since it impacts multiple question types, needs rigorous testing before doing the same.
    setInnerFieldValues(innerValues)
  }, [innerValues])

  const MathKeyboardWrapper = alwaysShowKeyboard ? EmptyDiv : Draggable

  return (
    <MathInputStyles
      noBorder={noBorder}
      noPadding
      ref={containerRef}
      minWidth={style.width}
      minHeight={style.height}
    >
      <div className="input" onBlur={onBlurInput}>
        <div className="input__math" data-cy="answer-math-input-style">
          <span
            className="input__math__field"
            ref={mathFieldRef}
            data-cy="answer-math-input-field"
          />
        </div>
        {(showKeyboard || alwaysShowKeyboard) && (
          <MathKeyboardWrapper
            className="input__keyboard"
            default={keyboardPosition}
          >
            <MathKeyboard
              symbols={symbols}
              numberPad={numberPad}
              restrictKeys={restrictKeys}
              customKeys={customKeys}
              showResponse={false}
              onClose={onKeyboardClose}
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
  onBlur: PropTypes.func,
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
  onBlur: () => {},
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

export default StaticMathWithResources
