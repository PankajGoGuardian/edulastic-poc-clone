import React from "react";
import styled, { css } from "styled-components";
import { Select } from "antd";
import { themeColor, smallDesktopWidth, mediumDesktopExactWidth } from "@edulastic/colors";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentItemSelector, getItemCountSelector, setCurrentItemAction } from "../../sharedDucks/TestItem";
import Nav from "../../../assessment/themes/common/Nav";

const { Option } = Select;

const QuestionSelect = ({ count, current, setCurrentItem }) => (
  <QuestionListWrapper>
    <Select
      data-cy="questionNumber"
      value={current}
      onChange={val => {
        setCurrentItem(val);
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
        <PreviousBtn data-cy="previousItem" onClick={() => setCurrentItem(current - 1)}>
          <i className="fa fa-angle-left" />
        </PreviousBtn>
      )}
      {current < count - 1 && (
        <NextBtn data-cy="nextItem" onClick={() => setCurrentItem(current + 1)}>
          <i className="fa fa-angle-right" />
        </NextBtn>
      )}
    </div>
  </QuestionListWrapper>
);
export default connect(
  state => ({
    current: getCurrentItemSelector(state),
    count: getItemCountSelector(state)
  }),
  {
    setCurrentItem: setCurrentItemAction
  }
)(QuestionSelect);

QuestionSelect.propTypes = {
  current: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  setCurrentItem: PropTypes.func.isRequired
};

const QuestionListWrapper = styled.div`
  display: flex;
  height: 35px;
  justify-content: space-between;

  .ant-select {
    width: 145px;
    @media (max-width: 768px) {
      height: 40px;
    }
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
`;

const PreviousBtn = styled(Nav.BackArrow)`
  left: 115px;
`;

const NextBtn = styled(Nav.NextArrow)`
  @media screen and (min-width: ${smallDesktopWidth}) {
    right: 10px;
  }
  @media screen and (min-width: ${mediumDesktopExactWidth}) {
    right: 0px;
  }
`;
