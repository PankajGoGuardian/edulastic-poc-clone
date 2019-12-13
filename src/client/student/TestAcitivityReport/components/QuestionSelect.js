import React from "react";
import styled, { css } from "styled-components";
import { Select } from "antd";
import { themeColor } from "@edulastic/colors";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentItemSelector, getItemCountSelector, setCurrentItemAction } from "../../sharedDucks/TestItem";

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
    <Navcontainer>
      {current > 0 ? (
        <PreviousBtn data-cy="previousItem" onClick={() => setCurrentItem(current - 1)}>
          <i class="fa fa-angle-left" />
        </PreviousBtn>
      ) : (
        ""
      )}
      {current < count - 1 ? (
        <NextBtn data-cy="nextItem" onClick={() => setCurrentItem(current + 1)}>
          <i class="fa fa-angle-right" />
        </NextBtn>
      ) : (
        ""
      )}
    </Navcontainer>
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

const Navcontainer = styled.div``;

const sharedBtnStyle = css`
  background-color: rgba(101, 209, 135, 0.5);
  position: fixed;
  top: 48%;
  z-index: 1;
  font-size: 40px;
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  width: 160px;
  height: 160px;
  padding-top: 50px;
  &:hover {
    background-color: ${themeColor};
  }
`;
const PreviousBtn = styled.nav`
  ${sharedBtnStyle}
  padding-left: 105px;
  left: 10px;
`;

const NextBtn = styled.nav`
  ${sharedBtnStyle}
  right: -100px;
  padding-left: 30px;
`;
