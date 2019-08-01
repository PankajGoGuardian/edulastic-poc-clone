import React, { Fragment, useState, useEffect } from "react";
import { Select } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { green, extraDesktopWidthMax, largeDesktopWidth, mobileWidthMax } from "@edulastic/colors";
import { IconFilterClass } from "@edulastic/icons";

import { getClasses, getCurrentGroup, changeClassAction } from "../Login/ducks";

const ClassSelector = ({ t, classList, currentGroup, changeClass }) => {
  const [isShown, setShown] = useState(false);

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
    <Fragment>
      <AssignmentMobileButton onClick={() => setShown(!isShown)}>
        <IconFilterClass />
      </AssignmentMobileButton>
      <AssignmentSelectClass id="class-dropdown-wrapper" isShown={isShown}>
        <ClassLabel>{t("common.classLabel")}</ClassLabel>
        <Select
          value={currentGroup}
          getPopupContainer={() => document.getElementById("class-dropdown-wrapper")}
          onChange={value => {
            changeClass(value);
          }}
        >
          {classList.length > 1 && (
            <Select.Option key="all" value="">
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
    </Fragment>
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

  @media (max-width: ${mobileWidthMax}) {
    display: none;
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

  @media (max-width: ${mobileWidthMax}) {
    position: absolute;
    top: calc(100% + 11px);
    left: -70px;
    width: 100vw !important;
    padding: 16px 26px;
    z-index: 1;
    background: #fff;
    padding-top: 10px;
    width: 100%;
    opacity: ${({ isShown }) => (isShown ? 1 : 0)};
    pointer-events: ${({ isShown }) => (isShown ? "all" : "none")};

    .ant-select {
      height: 40px;
      flex: 1;
      margin-right: 0;
      margin-left: 0;
      border: 1px solid #e1e1e1;
      width: 100%;
      max-width: 100%;
    }

    .ant-select-selection {
      background: #f8f8f8;
    }
  }
`;

const AssignmentMobileButton = styled.div`
  display: none;

  @media (max-width: ${mobileWidthMax}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 40px;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    svg {
      fill: ${green};
    }
  }
`;
