import React from "react";
import styled from "styled-components";
import { Select, Pagination } from "antd";
import { themeColor } from "@edulastic/colors";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentItemSelector, getItemCountSelector, setCurrentItemAction } from "../../sharedDucks/TestItem";

const { Option } = Select;

/*
 * @params count {Number} - create options based on the count
 */
const createOptions = count => {
  const options = [];
  for (let i = 1; i <= count; i++) {
    options.push(`Question ${i}/${count}`);
  }
  return options;
};

const QuestionSelect = ({ count, current, setCurrentItem }) => {
  const options = createOptions(count || 1);

  const updatePagination = current => {
    if (current > 0) {
      setCurrentItem(current - 1);
    }
  };

  return (
    <QuestionListWrapper>
      <Select
        value={current}
        onChange={val => {
          setCurrentItem(val);
        }}
      >
        {options.map((option, index) => (
          <Option key={index} value={index}>
            {option}
          </Option>
        ))}
      </Select>
      <Pagination
        onChange={updatePagination}
        current={current + 1}
        total={options.length}
        showTotal={total => <b>{`${current + 1} out of ${total} questions`}</b>}
        pageSize={1}
      />
    </QuestionListWrapper>
  );
};
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
