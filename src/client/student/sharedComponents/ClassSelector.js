import React, { useEffect } from "react";
import { Select } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { extraDesktopWidthMax, largeDesktopWidth } from "@edulastic/colors";

import { getClasses, getCurrentGroup, changeClassAction } from "../Login/ducks";

const ClassSelector = ({ t, classList, currentGroup, changeClass }) => {
  useEffect(() => {
    if (currentGroup === "" && classList.length === 1) {
      //all classes. but really only one classes available
      changeClass(classList[0]._id);
    }
    if (currentGroup != "") {
      //not all classes
      const currentGroupInList = classList.find(x => x._id === currentGroup);
      if (!currentGroupInList) {
        //currently selected class is not in the list. so selecting first available class
        if (classList.length > 0) {
          changeClass(classList[0]._id);
        }
      }
    }
  }, [classList, currentGroup]);

  return (
    <AssignmentSelectClass id="class-dropdown-wrapper">
      <ClassLabel>{t("common.classLabel")}</ClassLabel>
      <Select
        value={currentGroup}
        getPopupContainer={() => document.getElementById("class-dropdown-wrapper")}
        onChange={value => {
          changeClass(value);
        }}
      >
        {classList.length > 1 && (
          <Select.Option key="all" value={""}>
            All classes
          </Select.Option>
        )}
        {classList.map((cl, i) => (
          <Select.Option key={cl._id} value={cl._id}>
            {cl.name}
          </Select.Option>
        ))}
      </Select>
    </AssignmentSelectClass>
  );
};

ClassSelector.propTypes = {
  t: PropTypes.func.isRequired
};

const stateToProps = state => ({
  // classes: getClasses(state),
  currentGroup: getCurrentGroup(state)
});
export default connect(
  stateToProps,
  { changeClass: changeClassAction }
)(ClassSelector);

const ClassLabel = styled.span`
  display: flex;
  font-size: ${props => props.theme.headerClassTitleFontSize};
  color: ${props => props.theme.headerClassTitleColor};
  font-weight: 600;
  margin-right: 30px;
  align-items: center;
  letter-spacing: 0.2px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 12px;
    margin-right: 19px;
  }

  @media (max-width: 768px) {
    width: 65px;
    width: auto;
    margin-right: 10px;
  }
`;

const AssignmentSelectClass = styled.div`
  display: flex;

  .ant-select {
    height: 40px;
    width: 190px;

    @media (min-width: ${extraDesktopWidthMax}) {
      width: 240px;
    }

    @media (max-width: ${largeDesktopWidth}) {
      height: 37px;
      width: 164px;
    }
  }

  .ant-select-selection {
    border: 0px;
    background-color: ${props => props.theme.headerDropdownBgColor};
    color: ${props => props.theme.headerDropdownTextColor};
    font-size: ${props => props.theme.headerDropdownFontSize};
  }

  .ant-select-selection__rendered {
    height: 100%;
    align-items: center;
    display: flex !important;
    padding-left: 15px;
    font-size: 12px;

    @media (max-width: ${largeDesktopWidth}) {
      padding-left: 2px;
      font-size: 11px;
    }
  }
  .anticon-down {
    svg {
      fill: ${props => props.theme.headerDropdownTextColor};
    }
  }
  @media (max-width: 768px) {
    padding-top: 10px;
    width: 100%;
    .ant-select {
      height: 32px;
      flex: 1;
      margin-right: 26px;
      margin-left: 20px;
    }
  }
`;
