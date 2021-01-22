import React, { useRef, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
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
  const [currentInnerField, setCurrentInnerField] = useState(null)
  const containerRef = useRef(null)
  const mathFieldRef = useRef(null)
  const mQuill = useRef(null)

  const handleClickOutside = useMemo(() => {
    return (e) => {
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

  const handleSave = () => {
    if (!mQuill.current) {
      return []
    }
    const { innerFields = [] } = mQuill.current
    const newValues = innerFields.map((field) =>
      reformatMathInputLatex(field.latex())
    )
    onInput(newValues)
  }

  const handleFocusInner = (innerField) => {
    setKeyboardPosition(getKeyboardPosition(innerField.el(), symbols))
    onInnerFieldClick(getIndex(innerField.el()))
    setCurrentInnerField(innerField)
    document.addEventListener('click', handleClickOutside, false)
  }

  const onInputKeyboard = (key, command = 'cmd') => {
    if (!currentInnerField) {
      return
    }
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

  const setInnerFields = () => {
    if (!mQuill.current) {
      return
    }
    mQuill.current.latex(sanitizeLatex(latex))
    const { innerFields = [] } = mQuill.current

    innerFields.forEach((field, indx) => {
      // TODO: use uuid instead of index ?
      field.el().id = `inner-${indx}`
      field.el().addEventListener('click', () => {
        handleFocusInner(field)
      })
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

      field.write('')

      if (innerValues && innerValues[indx]) {
        field.write(innerValues[indx])
      }
    })
  }

  useEffect(() => {
    if (mathFieldRef.current && !mQuill.current && MQ) {
      try {
        mQuill.current = MQ.StaticMath(mathFieldRef.current)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }, [mathFieldRef.current])

  useEffect(() => {
    setInnerFields()
  }, [latex])

  useEffect(() => {
    if (isEmpty(innerValues)) {
      setInnerFields()
    }
  }, [innerValues])

  return (
    <MathInputStyles
      noBorder={noBorder}
      noPadding
      ref={containerRef}
      minWidth={style.width}
      minHeight={style.height}
    >
      <div className="input">
        <div className="input__math" data-cy="answer-math-input-style">
          <span
            className="input__math__field"
            ref={mathFieldRef}
            data-cy="answer-math-input-field"
          />
        </div>
        {(!isEmpty(keyboardPosition) || alwaysShowKeyboard) && (
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
    criticalResources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
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
