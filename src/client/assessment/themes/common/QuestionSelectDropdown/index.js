import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Select } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { IconBookmark } from "@edulastic/icons";
import styled from "styled-components";

import SelectContainer from "./SelectContainer";

const QuestionSelectDropdown = ({
  gotoQuestion,
  options,
  currentItem,
  skinb,
  t,
  bookmarks = [],
  skipped = [],
  dropdownStyle = {},
  zoomLevel
}) => {
  const dropdownWrapper = useRef(null);
  const menuStyle = { top: `${dropdownWrapper.current?.clientHeight}px !important`, left: `0px !important` };
  return (
    <SelectContainer ref={dropdownWrapper} menuStyle={menuStyle} style={dropdownStyle} skinb={skinb}>
      <Select
        getPopupContainer={triggerNode => triggerNode.parentNode}
        defaultValue={currentItem}
        data-cy="options"
        onChange={value => {
          gotoQuestion(parseInt(value, 10));
        }}
      >
        {options.map((item, index) => (
          <Select.Option key={index} value={item}>
            {`${t("common.layout.selectbox.question")} ${index + 1}/${options.length}`}
            {bookmarks[index] ? (
              <IconBookmark color="#f8c165" height={16} />
            ) : skipped[index] ? (
              <SkippedIcon className="fa fa-exclamation-circle" />
            ) : (
              ""
            )}
          </Select.Option>
        ))}
      </Select>
    </SelectContainer>
  );
};

QuestionSelectDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  currentItem: PropTypes.number.isRequired,
  bookmarks: PropTypes.array.isRequired,
  skipped: PropTypes.array.isRequired,
  zoomLevel: PropTypes.string
};

QuestionSelectDropdown.defaultProps = {
  zoomLevel: localStorage.getItem("zoomLevel") || "1"
};

export default withNamespaces("student")(QuestionSelectDropdown);

const SkippedIcon = styled.i`
  color: #b1b1b1;
  font-size: 18px;
`;
