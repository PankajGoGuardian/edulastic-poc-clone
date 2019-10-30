import React, { useRef } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const SelectWrapper = styled.span`
  margin: 0px 4px 5px 5px;
  display: inline-flex;
  .ant-select-dropdown-menu-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    display: block;
  }
`;

const ChoicesBox = ({ style = {}, resprops, id, className }) => {
  const selectWrapperRef = useRef(null);
  const {
    userAnswers,
    btnStyle,
    placeholder,
    options,
    onChange: changeAnswers,
    item,
    disableResponse,
    isReviewTab,
    cAnswers,
    responsecontainerindividuals
  } = resprops;

  if (!id) return null;
  const { responseIds } = item;
  const { index } = find(responseIds, response => response.id === id);
  let userAnswer = find(userAnswers, answer => (answer ? answer.id : "") === id);
  const individualStyle = responsecontainerindividuals[index];

  const heightpx = individualStyle && individualStyle.heightpx;
  const widthpx = individualStyle && individualStyle.widthpx;
  const individualPlacholder = individualStyle && individualStyle.placeholder;

  const styles = {
    ...btnStyle,
    width: widthpx || btnStyle.width,
    height: heightpx || btnStyle.height,
    ...style
  };

  if (isReviewTab) {
    userAnswer = find(cAnswers, answer => (answer ? answer.id : "") === id);
  }

  const selectChange = val => {
    if (changeAnswers) {
      changeAnswers(val, index, id);
    }
  };
  return (
    <SelectWrapper ref={selectWrapperRef} className={className}>
      <Select
        // setting value as  "" or null will not display placeholder
        defaultValue={userAnswer?.value}
        style={{
          ...styles,
          minWidth: styles.width || 100,
          overflow: "hidden"
        }}
        placeholder={individualPlacholder || placeholder}
        getPopupContainer={() => findDOMNode(selectWrapperRef.current)}
        data-cy="drop_down_select"
        disabled={disableResponse}
        onChange={selectChange}
      >
        {options &&
          options[id] &&
          options[id].map((response, respID) => (
            <Option title={response} value={response} key={respID}>
              {response}
            </Option>
          ))}
      </Select>
    </SelectWrapper>
  );
};

ChoicesBox.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

ChoicesBox.defaultProps = {
  resprops: {}
};

export default ChoicesBox;
