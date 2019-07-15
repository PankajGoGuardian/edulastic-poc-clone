import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const ClozeDropDownAnswerDisplay = ({ resprops = {}, id }) => {
  const { options, answers = {}, item, response_containers, uiStyles = {} } = resprops;
  const { dropDowns: _dropDownAnswers = [] } = answers;

  const val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : "";
  const responseContainer = find(response_containers || [], cont => cont.id === id);
  const width = (responseContainer ? responseContainer.widthpx : item.ui_style.min_width) || "auto";

  return (
    <SelectWrapper>
      <StyledSelect width={width} disabled value={val} style={{ ...uiStyles, width: !width ? "auto" : `${width}px` }}>
        {options &&
          options[id] &&
          options[id].map((response, respID) => (
            <Option value={response} key={respID}>
              {response}
            </Option>
          ))}
      </StyledSelect>
    </SelectWrapper>
  );
};

ClozeDropDownAnswerDisplay.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default ClozeDropDownAnswerDisplay;

const StyledSelect = styled(Select)`
  min-width: 120px;
  margin: 0px 4px;
  min-height: 35px;
`;

const SelectWrapper = styled.span`
  .ant-select-disabled .ant-select-selection {
    background: #fff;
    color: rgba(0, 0, 0, 0.65);
  }
`;
