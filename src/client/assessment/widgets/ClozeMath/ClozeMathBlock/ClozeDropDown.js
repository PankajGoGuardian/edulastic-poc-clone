import React, { useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { find, indexOf } from 'lodash'
import styled from 'styled-components'
import { Select } from 'antd'
import { darkBlue, lightGrey12 } from '@edulastic/colors'
import { SelectInputStyled, MathFormulaDisplay } from '@edulastic/common'
import CheckedBlock from './CheckedBlock'
import {
  getStemNumeration,
  getStylesFromUiStyleToCssStyle,
} from '../../../utils/helpers'

const { Option } = Select

const ClozeDropDown = ({ resprops = {}, id }) => {
  const {
    responseContainers,
    save,
    options,
    answers = {},
    evaluation = [],
    checked,
    item,
    onInnerClick,
    showIndex,
    uiStyles,
    disableResponse,
    isPrintPreview,
    allOptions,
    answerScore,
    allCorrects,
    setDropDownInUse,
    answersById,
    isLCBView,
  } = resprops

  const { dropDowns: _dropDownAnswers = [] } = answers
  let val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : ''
  const {
    responseIds: { dropDowns },
  } = item
  const { index } = find(dropDowns, (res) => res.id === id) || {}
  const response = find(responseContainers || [], (cont) => cont.id === id)

  const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)

  const dropdownStyle = useMemo(() => {
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
      width: `${width}px`,
      height: `${height}px`,
      ...cssStyles,
    }
  }, [item])

  const dropDownWrapper = useRef(null)

  const getPopupContainer = (node) => {
    return node.parentNode
  }

  const handleEvent = (event) => {
    if (typeof setDropDownInUse === 'function') {
      if (event === 'focus') {
        setDropDownInUse(true)
      } else if (event === 'blur') {
        setDropDownInUse(false)
      }
    }
  }

  if (isPrintPreview) {
    const itemIndex = indexOf(
      allOptions.map((o) => o.id),
      id
    )
    val = getStemNumeration('lowercase', itemIndex)
  }

  return checked ? (
    <CheckedBlock
      width={dropdownStyle.width}
      height={dropdownStyle.height}
      item={item}
      userAnswer={_dropDownAnswers[id]}
      id={id}
      showIndex={showIndex}
      evaluation={evaluation}
      type="dropDowns"
      onInnerClick={onInnerClick}
      isPrintPreview={isPrintPreview}
      answerScore={answerScore}
      allCorrects={allCorrects}
      answersById={answersById}
      isLCBView={isLCBView}
    />
  ) : (
    <DropdownWrapper ref={dropDownWrapper} isPrintPreview={isPrintPreview}>
      <Dropdown
        data-cy="textDropDown"
        disabled={disableResponse}
        onChange={(text) => save({ value: text, index }, 'dropDowns', id)}
        getPopupContainer={getPopupContainer}
        value={val}
        onFocus={() => handleEvent('focus')}
        onBlur={() => handleEvent('blur')}
        {...dropdownStyle}
      >
        {options &&
          options[id] &&
          options[id].map((option, respID) => (
            <Option value={option} key={respID}>
              <MathFormulaDisplay
                dangerouslySetInnerHTML={{ __html: option }}
                fontSize={dropdownStyle?.fontSize}
              />
            </Option>
          ))}
      </Dropdown>
    </DropdownWrapper>
  )
}

ClozeDropDown.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
}

ClozeDropDown.defaultProps = {}

export default ClozeDropDown

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  .ant-select {
    min-width: 120px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};

    .ant-select-selection-selected-value {
      ${({ isPrintPreview }) => (isPrintPreview ? { color: darkBlue } : {})}
    }
  }

  text-indent: 0;
`

const Dropdown = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection {
      border: ${(props) =>
        props.noBorder ? 'none' : ` 1px solid ${lightGrey12}`};
    }
  }
`
