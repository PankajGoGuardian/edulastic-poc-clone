import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { white, greyLight1 } from '@edulastic/colors'
import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import { math, defaultSymbols } from '@edulastic/constants'
import MathInput from '../MathInput'
import Draggable from '../MathInput/Draggable'
import KatexInput from '../KatexInput'
import EduButton from '../EduButton'
import SubTitle from '../Subtitle'
import FlexContainer from '../FlexContainer'

const { defaultNumberPad } = math

const MathModal = ({
  value,
  symbols,
  isEditable,
  numberPad,
  showResponse,
  showDropdown,
  show,
  onSave,
  onClose,
  width,
  onChangeKeypad,
}) => {
  const mathInputRef = useRef(null)
  const [latex, setLatex] = useState(value || '')
  const [latexMode, setLatextMode] = useState(false)

  useEffect(() => {
    if (show) {
      if (mathInputRef.current) {
        mathInputRef.current.setFocus()
      }
      setLatextMode(false)
      setLatex(value)
    }
  }, [show])

  const onInput = (newLatex) => {
    setLatex(newLatex)
  }

  const switchMode = (evt) => {
    setLatextMode(!latexMode)
    evt?.target?.blur()
  }

  if (!show) {
    return null
  }

  return (
    <Draggable
      usePortal
      position={{ x: '50%', y: '50%' }}
      transform="translate(-50%, -50%)"
    >
      <ModalInner width={width}>
        <ModalHeader justifyContent="space-between" padding="16px 24px">
          <Title>Edit Math</Title>
          <IconClose onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          {(!isEditable || latexMode) && (
            <KatexInput value={latex} onInput={onInput} />
          )}
          {!latexMode && isEditable && (
            <MathInput
              ref={mathInputRef}
              fullWidth
              alwaysShowKeyboard
              defaultFocus
              symbols={symbols}
              numberPad={numberPad}
              showResponse={showResponse}
              showDropdown={showDropdown}
              value={latex}
              resetMath
              onInput={(newLatex) => onInput(newLatex)}
              onChangeKeypad={onChangeKeypad}
              showDragHandle={false}
            />
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between" padding="12px 16px">
          <EduButton
            noBorder={!latexMode}
            isGhost={!latexMode}
            onClick={switchMode}
          >
            {!isEditable || latexMode ? 'KEYPAD MODE' : 'LATEX MODE'}
          </EduButton>
          <FlexContainer>
            <EduButton isGhost onClick={() => onClose()}>
              CANCEL
            </EduButton>
            <EduButton type="primary" onClick={() => onSave(latex)}>
              OK
            </EduButton>
          </FlexContainer>
        </ModalFooter>
      </ModalInner>
    </Draggable>
  )
}

MathModal.propTypes = {
  show: PropTypes.bool,
  isEditable: PropTypes.bool,
  symbols: PropTypes.array,
  numberPad: PropTypes.array,
  width: PropTypes.string,
  showDropdown: PropTypes.bool,
  showResponse: PropTypes.bool,
  value: PropTypes.string,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  onChangeKeypad: PropTypes.func,
}

MathModal.defaultProps = {
  show: false,
  isEditable: true,
  value: '',
  width: null,
  symbols: defaultSymbols,
  numberPad: defaultNumberPad,
  showDropdown: false,
  showResponse: false,
  onSave: () => {},
  onClose: () => {},
  onChangeKeypad: () => {},
}

export default MathModal

const ModalInner = styled.div`
  position: relative;
  background: ${white};
  width: ${({ width }) => width};
  z-index: 1003;

  & .input__math {
    margin: 0px 15px;
    width: calc(100% - 30px);
  }
`

const ModalHeader = styled(FlexContainer)`
  border-bottom: 1px solid ${greyLight1};

  svg {
    cursor: pointer;
  }
`

const Title = styled(SubTitle)`
  padding: 0px;
  background: ${white};
`

const ModalBody = styled.div`
  min-height: 315px;
  padding: 16px 4px 0px;
`

const ModalFooter = styled(FlexContainer)`
  border-top: 1px solid ${greyLight1};
`
