import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";
import CheckedBlock from "./CheckedBlock";

const { Option } = Select;

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
    uiStyles = {},
    showIndex
  } = resprops;
  const { dropDowns: _dropDownAnswers = [] } = answers;

  const val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : "";
  const {
    responseIds: { dropDowns }
  } = item;
  const { index } = find(dropDowns, res => res.id === id) || {};
  const response = find(responseContainers || [], cont => cont.id === id);
  const width = response && response.widthpx ? `${response.widthpx}px` : `${item.uiStyle.minWidth}px` || "auto";
  const height = response && response.heightpx ? `${response.heightpx}px` : "auto";

  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
      item={item}
      userAnswer={_dropDownAnswers[id]}
      id={id}
      showIndex={showIndex}
      evaluation={evaluation}
      type="dropDowns"
      onInnerClick={onInnerClick}
    />
  ) : (
    <StyeldSelect
      width={width}
      onChange={text => save({ value: text, index }, "dropDowns", id)}
      value={val}
      style={{ ...uiStyles, width: !width ? "auto" : width, height: !height ? "auto" : height }}
    >
      {options &&
        options[id] &&
        options[id].map((option, respID) => (
          <Option value={option} key={respID}>
            {option}
          </Option>
        ))}
    </StyeldSelect>
  );
};

ClozeDropDown.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default ClozeDropDown;

const StyeldSelect = styled(Select)`
  min-width: 120px;
  margin: 2px 4px;
`;
