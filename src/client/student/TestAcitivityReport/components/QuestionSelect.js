import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import { themeColor, tabletWidth } from '@edulastic/colors'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import {
  getCurrentItemSelector,
  getItemCountSelector,
  setCurrentItemAction,
} from '../../sharedDucks/TestItem'
import Nav from '../../../assessment/themes/common/Nav'

const { Option } = Select

const QuestionSelect = ({ count, current, setCurrentItem }) => (
  <QuestionListWrapper>
    <Select
      data-cy="questionNumber"
      value={current}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      onChange={(val) => {
        setCurrentItem(val)
      }}
    >
      {[...new Array(count)].map((item, index) => (
        <Option key={index} value={index}>
          {`Question ${index + 1}/${count}`}
        </Option>
      ))}
    </Select>
    <div>
      {current > 0 && (
        <PreviousBtn
          data-cy="previousItem"
          onClick={() => setCurrentItem(current - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </PreviousBtn>
      )}
      {current < count - 1 && (
        <NextBtn data-cy="nextItem" onClick={() => setCurrentItem(current + 1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </NextBtn>
      )}
    </div>
  </QuestionListWrapper>
)
export default connect(
  (state) => ({
    current: getCurrentItemSelector(state),
    count: getItemCountSelector(state),
  }),
  {
    setCurrentItem: setCurrentItemAction,
  }
)(QuestionSelect)

QuestionSelect.propTypes = {
  current: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  setCurrentItem: PropTypes.func.isRequired,
}

const QuestionListWrapper = styled.div`
  display: flex;
  height: 35px;
  justify-content: space-between;

  .ant-select {
    width: 145px;
  }
  .ant-select-selection {
    display: flex;
    align-items: center;
  }
  .ant-select-selection__rendered {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }
  .anticon-down {
    svg {
      fill: ${themeColor};
    }
  }
  .ant-pagination-item-active {
    border-color: ${themeColor};
  }
  .ant-pagination {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .ant-select-dropdown {
    z-index: 1;
  }
`

const PreviousBtn = styled(Nav.BackArrow)`
  left: 80px;
  @media screen and (max-width: ${tabletWidth}) {
    left: 4px;
  }
`

const NextBtn = styled(Nav.NextArrow)`
  right: 10px;
`
