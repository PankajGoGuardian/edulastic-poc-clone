import React, { useMemo } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { find } from 'lodash'
import { lightGrey12 } from '@edulastic/colors'
import { TextInputStyled } from '@edulastic/common'
import CheckedBlock from './CheckedBlock'
import { getStylesFromUiStyleToCssStyle } from '../../../utils/helpers'

const ClozeInput = ({ id, resprops = {} }) => {
  const {
    responseContainers,
    save,
    answers = {},
    evaluation = [],
    checked,
    item,
    onInnerClick,
    uiStyles = {},
    showIndex,
    disableResponse,
    isPrintPreview,
    answerScore,
    allCorrects,
  } = resprops
  const { inputs: _inputsAnwers = [] } = answers
  const {
    responseIds: { inputs },
  } = item
  const val = _inputsAnwers[id]?.value || ''
  const { index } = find(inputs, (res) => res.id === id) || {}

  const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)

  const inputBoxStyle = useMemo(() => {
    const response = find(responseContainers, (cont) => cont.id === id)
    const individualWidth = response?.widthpx || 0
    const individualHeight = response?.heightpx || 0
    const {
      heightpx: globalHeight = 0,
      widthpx: globalWidth = 0,
      minHeight,
      minWidth,
      transparentBackground,
    } = item.uiStyle || {}
    const width =
      individualWidth ||
      Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10))
    const height =
      individualHeight ||
      Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10))

    if (transparentBackground) {
      cssStyles.bg = 'transparent'
      cssStyles.noBorder = true
    }

    return {
      ...uiStyles,
      width: !width ? 'auto' : `${width}px`,
      height: !height ? 'auto' : `${height}px`,
      ...cssStyles,
    }
  }, [uiStyles, item])

  return checked ? (
    <CheckedBlock
      width={inputBoxStyle.width}
      height={inputBoxStyle.height}
      evaluation={evaluation}
      showIndex={showIndex}
      userAnswer={_inputsAnwers[id]}
      id={id}
      item={item}
      type="inputs"
      onInnerClick={onInnerClick}
      isPrintPreview={isPrintPreview}
      answerScore={answerScore}
      allCorrects={allCorrects}
    />
  ) : (
    <InputDiv>
      <InputBox
        disabled={disableResponse}
        onChange={(e) => save({ value: e.target.value, index }, 'inputs', id)}
        value={val}
        data-cy="textInput"
        aria-label="text input"
        {...inputBoxStyle}
      />
    </InputDiv>
  )
}

ClozeInput.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
}

export default ClozeInput

const InputDiv = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const InputBox = styled(TextInputStyled)`
  text-align: center;
  min-width: ${({ minWidth }) => minWidth};
  &.ant-input {
    border: ${(props) =>
      props.noBorder ? 'none' : ` 1px solid ${lightGrey12}`};
    font-weight: normal;
  }
`
