import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Select } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { IconBookmark, IconSend } from "@edulastic/icons";
import styled from "styled-components";

import SelectContainer from "./SelectContainer";

const QuestionSelectDropdown = ({
  gotoQuestion,
  options = [],
  currentItem,
  skinb,
  t,
  bookmarks = [],
  skipped = [],
  dropdownStyle = {},
  moveToNext,
  utaId
}) => {
  const dropdownWrapper = useRef(null);
  const menuStyle = { top: `${dropdownWrapper.current?.clientHeight}px !important`, left: `0px !important` };
  const showSubmit = sessionStorage.getItem("testAttemptReviewVistedId") === utaId;
  const scrollableContainer = document.getElementById("assessment-player-default-scroll");
  return (
    <SelectContainer
      ref={dropdownWrapper}
      menuStyle={menuStyle}
      style={dropdownStyle}
      skinb={skinb}
      className="question-select-dropdown"
    >
      <Select
        getPopupContainer={triggerNode => scrollableContainer || triggerNode.parentNode}
        value={currentItem}
        data-cy="options"
        onChange={value => {
          value === "SUBMIT" ? moveToNext(null, true, value) : gotoQuestion(parseInt(value, 10));
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
        {showSubmit && (
          <Select.Option key={options.length} value="SUBMIT">
            Submit <IconSend />
          </Select.Option>
        )}
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
  skipped: PropTypes.array.isRequired
};

export default withNamespaces("student")(QuestionSelectDropdown);

const SkippedIcon = styled.i`
  color: #b1b1b1;
  font-size: 18px;
`;
