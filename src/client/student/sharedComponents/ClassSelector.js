import { extraDesktopWidthMax, green, largeDesktopWidth, mobileWidthMax, themeColorBlue } from "@edulastic/colors";
import { IconFilterClass } from "@edulastic/icons";
import { Select } from "antd";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { changeChildAction, changeClassAction, getCurrentGroup } from "../Login/ducks";

const ClassSelector = ({ t, classList, currentGroup, changeClass, allClasses, showAllClassesOption }) => {
  const [isShown, setShown] = useState(false);
  useEffect(() => {
    if (!showAllClassesOption) {
      /* For skill report we are not showing "All options", so when we route to the skill-report 
       page we pick the first class id by default and exit out of useEffect */
      if (!currentGroup && classList.length) changeClass(classList[0]?._id);
    } else {
      if (currentGroup === "" && classList.length === 1) {
        // all classes. but really only one classes available
        changeClass(classList[0]._id);
      }
      if (currentGroup !== "") {
        // not all classes

        const currentGroupInList = classList.find(x => x._id === currentGroup);
        if (!currentGroupInList) {
          // currently selected class is not in the list. so selecting first available class
          if (classList.length > 0 && !sessionStorage.temporaryClass) {
            changeClass(classList[0]._id);
          }
        }
      }
    }
  }, [classList, currentGroup, showAllClassesOption]);
  const temporaryClassId = sessionStorage.getItem("temporaryClass");
  const tempClass = allClasses.find(clazz => clazz._id === temporaryClassId) || {};
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
          {classList.length > 1 && showAllClassesOption && (
            <Select.Option key="all" value="">
              All classes
            </Select.Option>
          )}

          {!isEmpty(tempClass) && (
            <Select.Option key={tempClass._id} value={tempClass._id}>
              {tempClass.name}
            </Select.Option>
          )}
          {classList.map(
            cl =>
              temporaryClassId !== cl._id && (
                <Select.Option key={cl._id} value={cl._id}>
                  {cl.name}
                </Select.Option>
              )
          )}
        </Select>
      </AssignmentSelectClass>
    </Fragment>
  );
};

ClassSelector.propTypes = {
  t: PropTypes.func.isRequired
};

const stateToProps = state => ({
  currentGroup: getCurrentGroup(state),
  allClasses: state.studentEnrollClassList.allClasses
});
export default connect(
  stateToProps,
  { changeClass: changeClassAction }
)(ClassSelector);

function StudentSelect({ changeChild, childs, currentChild }) {
  if ((childs || []).length <= 1) {
    return null;
  }
  return (
    <AssignmentSelectClass id="class-dropdown-wrapper">
      <ClassLabel>student</ClassLabel>
      <Select
        value={currentChild}
        getPopupContainer={() => document.getElementById("class-dropdown-wrapper")}
        onChange={value => {
          changeChild(value);
        }}
      >
        {childs.map(cl => (
          <Select.Option key={cl._id} value={cl._id}>
            {cl.name}
          </Select.Option>
        ))}
      </Select>
    </AssignmentSelectClass>
  );
}

export const StudentSlectCommon = connect(
  state => ({
    childs: state?.user?.user?.children,
    currentChild: state?.user?.currentChild
  }),
  {
    changeChild: changeChildAction
  }
)(StudentSelect);

const ClassLabel = styled.span`
  display: flex;
  font-size: ${props => props.theme.header.headerClassTitleFontSize};
  color: ${props => props.theme.header.headerClassTitleColor};
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
  align-items: center;

  .ant-select {
    height: 40px;
    width: 190px;
    border-color: ${themeColorBlue};

    @media (min-width: ${extraDesktopWidthMax}) {
      width: 240px;
    }

    @media (max-width: ${largeDesktopWidth}) {
      height: 37px;
      width: 164px;
    }
  }

  .ant-select-selection {
    background-color: ${props => props.theme.headerDropdownBgColor};
    color: ${themeColorBlue};
    font-size: ${props => props.theme.classNameFontSize};
    border-color: ${themeColorBlue};
    box-shadow: none !important;
    font-weight: 600;
  }

  .ant-select-dropdown-menu-item {
    background-color: ${props => props.theme.headerDropdownItemBgColor};
    color: ${props => props.theme.headerDropdownTextColor};
    font-size: ${props => props.theme.classNameFontSize};
    &.ant-select-dropdown-menu-item-selected {
      background-color: ${props => props.theme.headerDropdownItemBgSelectedColor};
      color: ${props => props.theme.headerDropdownItemTextSelectedColor};
    }

    &:hover {
      background-color: ${props => props.theme.headerDropdownItemBgHoverColor} !important;
      color: ${props => props.theme.headerDropdownItemTextHoverColor} !important;
    }
  }

  .ant-select-selection__rendered {
    height: 100%;
    align-items: center;
    display: flex !important;
    padding-left: 15px;
    font-size: ${props => props.theme.classNameFontSize};

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
    left: 50%;
    transform: translateX(-50%);
    width: 100vw !important;
    padding: 16px 26px;
    z-index: 1;
    background: #fff;
    padding-top: 10px;
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
