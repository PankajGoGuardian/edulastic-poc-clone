import React, { useRef } from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const ClozeDropDownAnswerDisplay = ({ resprops = {}, id }) => {
  const { options, answers = {}, item, responseContainers, uiStyles = {} } = resprops;
  const { dropDowns: _dropDownAnswers = [] } = answers;

  const val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : "";
  const responseContainer = find(responseContainers || [], cont => cont.id === id);
  const width = (responseContainer ? responseContainer.widthpx : item.uiStyle.minWidth) || "auto";

  const dropDownWrapper = useRef(null);
  const menuStyle = { top: `${dropDownWrapper.current?.clientHeight}px !important`, left: `0px !important` };

  return (
    <SelectWrapper ref={dropDownWrapper} menuStyle={menuStyle}>
      <Select
        width={width}
        disabled
        value={val}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        style={{ ...uiStyles, width: !width ? "auto" : `${width}px` }}
      >
        {options &&
          options[id] &&
          options[id].map((response, respID) => (
            <Option value={response} key={respID}>
              {response}
            </Option>
          ))}
      </Select>
    </SelectWrapper>
  );
};

ClozeDropDownAnswerDisplay.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default ClozeDropDownAnswerDisplay;

const StyledSelect = styled(Select)``;

const SelectWrapper = styled.span`
  display: inline-block;
  position: relative;
  min-height: 35px;
  .ant-select {
    min-width: 120px;
    margin: 0px 4px;
    min-height: 35px;
  }
  .ant-select-disabled .ant-select-selection {
    background: #fff;
    color: rgba(0, 0, 0, 0.65);
  }
`;
