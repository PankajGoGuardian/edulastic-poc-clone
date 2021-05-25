import React, { useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { find } from 'lodash'
import styled from 'styled-components'
import { ScrollContext, MathSpan, SelectInputStyled } from '@edulastic/common'
import { convertToMathTemplate } from '@edulastic/common/src/utils/mathUtils'

const { Option } = SelectInputStyled

const minWidthMap = {
  xs: 100,
  sm: 100,
  md: 150,
  lg: 200,
  xl: 250,
}

const SelectWrapper = styled.span`
  position: relative;
  vertical-align: middle;
  display: inline-flex;
  .ant-select-dropdown {
    ${({ dropdownMenuStyle }) => dropdownMenuStyle};
  }

  .ant-select-dropdown-menu-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    display: block;
    font-size: ${({ theme }) => theme?.fontSize}px;
    white-space: normal;
  }

  .ant-select {
    font-size: ${({ theme }) => theme?.fontSize};
    min-width: ${({ theme }) => minWidthMap[theme?.zoomLevel] || 100}px;

    .ant-select-selection {
      display: flex;
      align-items: center;
    }
  }
`

const Select = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection {
      &.ant-select-selection--single {
        .ant-select-selection__rendered {
          max-width: calc(100% - 32px);
          padding: 0px 4px 0px 10px;
          line-height: 1;
        }
      }
    }
  }
`

const ChoicesBox = ({ style = {}, resprops, id }) => {
  const selectWrapperRef = useRef(null)
  const {
    btnStyle,
    placeholder,
    options,
    onChange: changeAnswers,
    item,
    disableResponse,
    isReviewTab,
    cAnswers,
    responsecontainerindividuals,
    userSelections,
  } = resprops
  const { getScrollElement } = useContext(ScrollContext)
  if (!id) return null
  const { responseIds } = item
  const { index } = find(responseIds, (response) => response.id === id)
  let userAnswer = find(
    userSelections,
    (answer) => (answer ? answer.id : '') === id
  )
  const individualStyle = responsecontainerindividuals[index]

  const heightpx = individualStyle && individualStyle.heightpx
  const widthpx = individualStyle && individualStyle.widthpx
  const individualPlacholder = individualStyle && individualStyle.placeholder

  const styles = {
    ...btnStyle,
    width: widthpx || btnStyle.width,
    height: heightpx || btnStyle.height,
    ...style,
  }

  if (isReviewTab) {
    userAnswer = find(cAnswers, (answer) => (answer ? answer.id : '') === id)
  }

  const selectChange = (val) => {
    if (changeAnswers) {
      changeAnswers(val, index, id)
    }
  }

  const getPopupContainer = () => {
    const scrollEl = getScrollElement()
    if (!scrollEl || (scrollEl === window && 'location' in scrollEl)) {
      return document.body
    }
    return scrollEl
  }

  const dropdownMenuStyle = {
    top: styles?.height ? `${styles.height}px !important` : null,
    left: `0px !important`,
  }
  return (
    <SelectWrapper dropdownMenuStyle={dropdownMenuStyle} ref={selectWrapperRef}>
      <Select
        value={convertToMathTemplate(userAnswer?.value)}
        style={{
          ...styles,
          overflow: 'hidden',
        }}
        height={heightpx || btnStyle.height}
        placeholder={individualPlacholder || placeholder}
        getPopupContainer={getPopupContainer}
        data-cy="drop_down_select"
        disabled={disableResponse}
        onChange={selectChange}
      >
        {options &&
          options[id] &&
          options[id].map((response, respID) => (
            <Option title={response} value={response} key={respID}>
              <MathSpan dangerouslySetInnerHTML={{ __html: response }} />
            </Option>
          ))}
      </Select>
    </SelectWrapper>
  )
}

ChoicesBox.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
}

ChoicesBox.defaultProps = {
  resprops: {},
  style: {},
}

export default ChoicesBox
