import React, { useRef } from "react";
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
    showIndex,
    uiStyles
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

  const dropDownWrapper = useRef(null);
  const menuStyle = { top: `${dropDownWrapper.current?.clientHeight}px !important`, left: `0px !important` };

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
    <DropdownWrapper ref={dropDownWrapper} width={width} height={height} menuStyle={menuStyle}>
      <Select
        onChange={text => save({ value: text, index }, "dropDowns", id)}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        value={val}
        dropdownStyle={uiStyles}
      >
        {options &&
          options[id] &&
          options[id].map((option, respID) => (
            <Option value={option} key={respID}>
              {option}
            </Option>
          ))}
      </Select>
    </DropdownWrapper>
  );
};

ClozeDropDown.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

ClozeDropDown.defaultProps = {};

export default ClozeDropDown;

const DropdownWrapper = styled.span`
  position: relative;
  display: inline-block;
  min-height: 35px;
  .ant-select {
    min-width: 120px;
    margin: 0px 2px;
    width: ${props => props.width};
    height: ${props => props.height};
    min-height: 35px;
    vertical-align: middle;

    .ant-select-selection__rendered {
      line-height: 35px;
    }
  }
  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle};
  }
`;
