import React, { useRef, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { find, indexOf } from 'lodash'
import styled from 'styled-components'
import { Select } from 'antd'
import { darkBlue, lightGrey12 } from '@edulastic/colors'
import { SelectInputStyled, MathFormulaDisplay } from '@edulastic/common'
import CheckedBlock from './CheckedBlock'
import { getStemNumeration } from '../../../utils/helpers'

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
  } = resprops

  const { dropDowns: _dropDownAnswers = [] } = answers
  let val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : ''
  const {
    responseIds: { dropDowns },
  } = item
  const { index } = find(dropDowns, (res) => res.id === id) || {}
  const response = find(responseContainers || [], (cont) => cont.id === id)

  const dropdownStyle = useMemo(() => {
    const individualWidth = response?.widthpx || 0
    const individualHeight = response?.heightpx || 0

    const {
      heightpx: globalHeight = 0,
      widthpx: globalWidth = 0,
      minHeight,
      minWidth,
    } = item.uiStyle || {}

    const width =
      individualWidth ||
      Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10))
    const height =
      individualHeight ||
      Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10))
    return {
      ...uiStyles,
      width: `${width}px`,
      height: `${height}px`,
    }
  }, [item])

  const dropDownWrapper = useRef(null)
  const [menuStyle, setMenuStyle] = useState({
    top: `${dropdownStyle.height} !important`,
    left: `0px !important`,
  })

  const getPopupContainer = (node) => {
    return node.parentNode
  }

  if (isPrintPreview) {
    const itemIndex = indexOf(
      allOptions.map((o) => o.id),
      id
    )
    val = getStemNumeration('lowercase', itemIndex)
  }
  // TODO
  // make a generic component for dropdown and use it in all questions
  // so that we can have control all dropdowns just by changing one place
  useEffect(() => {
    // recalculate the dimensions whenever the element is mounted
    if (dropDownWrapper.current) {
      const wrapper = dropDownWrapper.current
      const { height: wrapperHeight, top } = wrapper.getBoundingClientRect()
      const optionCount = options?.length || 0
      const heightOfEachOption = 40
      const totalOptionsHeight = Math.max(optionCount * heightOfEachOption, 120)
      if (window.innerHeight - (wrapperHeight + top) < totalOptionsHeight) {
        // dropdown near to the bottom of the screen
        // or dropdown has many options wihch cannot fit at the bottom

        // show options above the dropdown
        setMenuStyle({
          top: `auto !important`,
          left: `0px !important`,
          bottom: `100%`,
        })
      } else {
        // show options below the dropdown
        setMenuStyle({
          top: `${wrapper.clientHeight}px !important`,
          left: `0px !important`,
        })
      }
    }
  }, [dropDownWrapper.current])

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
    />
  ) : (
    <DropdownWrapper
      ref={dropDownWrapper}
      menuStyle={menuStyle}
      isPrintPreview={isPrintPreview}
    >
      <Dropdown
        disabled={disableResponse}
        onChange={(text) => save({ value: text, index }, 'dropDowns', id)}
        getPopupContainer={getPopupContainer}
        value={val}
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

  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle};
  }
  text-indent: 0;
`

const Dropdown = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection {
      border: 1px solid ${lightGrey12};
    }
  }
`
