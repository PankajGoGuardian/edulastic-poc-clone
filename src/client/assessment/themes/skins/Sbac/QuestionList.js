import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Select, Tooltip } from 'antd'
import { IconBookmark, IconSend } from '@edulastic/icons'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import SelectContainer from '../../common/QuestionSelectDropdown/SelectContainer'

const QuestionList = ({
  gotoQuestion,
  options = [],
  currentItem,
  skinb,
  i18Translate,
  bookmarks = [],
  skipped = [],
  dropdownStyle = {},
  moveToNext,
  utaId,
  blockNavigationToAnsweredQuestions,
  zoomLevel,
}) => {
  const dropdownWrapper = useRef(null)

  useEffect(() => {
    if (dropdownWrapper?.current?.clientWidth) {
      const zoomValue = parseFloat(zoomLevel)
      const effectiveClientWidth =
        zoomValue * dropdownWrapper.current?.clientWidth

      const interval = setInterval(() => {
        const ele1 = document.getElementsByClassName(
          'question-select-list-dropdown'
        )
        const ele = ele1[0]
        if (ele) {
          const childEle = ele.childNodes[0]
          ele.style.minWidth = `${effectiveClientWidth}px`
          childEle.style.zoom = zoomLevel
          clearInterval(interval)
        }
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [dropdownWrapper, zoomLevel])

  const showSubmit =
    sessionStorage.getItem('testAttemptReviewVistedId') === utaId
  return (
    <SelectContainer
      ref={dropdownWrapper}
      style={dropdownStyle}
      skinb={skinb}
      className="question-select-dropdown"
    >
      <Tooltip
        placement="bottom"
        title={
          blockNavigationToAnsweredQuestions
            ? 'This assignment is restricted from navigating back to the previous question.'
            : null
        }
      >
        <Select
          dropdownStyle={{
            zIndex: 1100,
          }}
          dropdownClassName="question-select-list-dropdown"
          value={currentItem}
          data-cy="options"
          onChange={(value) => {
            value === 'SUBMIT'
              ? moveToNext(null, true, value)
              : gotoQuestion(parseInt(value, 10))
          }}
          disabled={blockNavigationToAnsweredQuestions}
        >
          {options.map((item, index) => (
            <Select.Option
              data-cy="questionSelectOptions"
              key={index}
              value={item}
            >
              {`${i18Translate('common.layout.selectbox.question')} ${
                index + 1
              }/${options.length}`}
              {bookmarks[index] ? (
                <IconBookmark color="#f8c165" height={16} />
              ) : skipped[index] ? (
                <SkippedIcon className="fa fa-exclamation-circle" />
              ) : (
                ''
              )}
            </Select.Option>
          ))}
          {showSubmit && (
            <Select.Option key={options.length} value="SUBMIT">
              Submit <IconSend />
            </Select.Option>
          )}
        </Select>
      </Tooltip>
    </SelectContainer>
  )
}

QuestionList.propTypes = {
  options: PropTypes.array.isRequired,
  i18Translate: PropTypes.func.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  currentItem: PropTypes.number.isRequired,
  bookmarks: PropTypes.array.isRequired,
  skipped: PropTypes.array.isRequired,
}

export default withNamespaces('student')(QuestionList)

const SkippedIcon = styled.i`
  color: #b1b1b1;
  font-size: 18px;
`
