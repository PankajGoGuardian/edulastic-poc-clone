import React, { Fragment } from "react";
import { Dropdown, Icon, Menu } from "antd";
import { IconMoreVertical, IconVerified } from "@edulastic/icons";
import { lightGrey5, themeColor, themeColorLighter } from "@edulastic/colors";
import { StyledLabel, StyledTag, HideLinkLabel } from "../../../Reports/common/styled";
import { Tooltip } from "../../../../common/utils/helpers";
import ProgressBars from "./ProgressBars";
import {
  IconActionButton,
  ModuleHeader,
  ModuleID,
  ModuleHeaderData,
  FirstColumn,
  ModuleTitleWrapper,
  ModuleTitle,
  ModuleTitlePrefix,
  ModuleDescription,
  LastColumn
} from "../styled";

const ModuleRowView = props => {
  const {
    module,
    isDesktop,
    moduleIndex,
    summaryData,
    isStudent,
    urlHasUseThis,
    hasEditAccess,
    moduleStatus,
    collapsed,
    removeUnit,
    toggleModule,
    assignModule,
    addModuleMenuClick,
    editModuleMenuClick,
    deleteModuleMenuClick
  } = props;

  const { title, data = [], description = "", moduleId, moduleGroupName } = module;

  const hideEditOptions = !urlHasUseThis;

  const totalAssigned = data.length;

  const moduleInlineStyle = {
    "white-space": "nowrap",
    opacity: module.hidden ? `.5` : `1`,
    pointerEvents: module.hidden ? "none" : "all",
    overflow: "hidden"
  };

  const toPreviewDescription = (description || "").replace(/<p[^>]*>/g, "<span>").replace(/<\/p>/g, "</span>");

  const onClickHideShow = event => {
    event.preventDefault();
    event.stopPropagation();
    toggleModule(module, moduleIndex);
  };

  const onClickAssign = () => {
    !module.hidden && totalAssigned ? assignModule(module) : {};
  };

  const moduleManagementMenu = (
    <Menu data-cy="moduleItemMoreMenu">
      {!isDesktop && <Menu.Item onClick={onClickHideShow}>{module.hidden ? "Show Module" : "Hide Module"}</Menu.Item>}
      {!isDesktop && !moduleStatus && totalAssigned && <Menu.Item onClick={onClickAssign}>Assign Module</Menu.Item>}
      <Menu.Item onClick={addModuleMenuClick}>Add Module</Menu.Item>
      <Menu.Item onClick={editModuleMenuClick}>Edit Module</Menu.Item>
      <Menu.Item onClick={deleteModuleMenuClick}>Delete Module</Menu.Item>
    </Menu>
  );

  const hideLink = !hideEditOptions && hasEditAccess && !isStudent && !moduleStatus && (
    <HideLinkLabel
      textColor={themeColor}
      fontWeight="Bold"
      data-cy={module.hidden ? "show-module" : "hide-module"}
      onClick={onClickHideShow}
    >
      {module.hidden ? "SHOW MODULE" : "HIDE MODULE"}
    </HideLinkLabel>
  );

  let moduleCompleteOrAssign = "";
  if (!isStudent && moduleStatus && !hideEditOptions) {
    moduleCompleteOrAssign = (
      <StyledLabel data-cy="module-complete" textColor={themeColorLighter} fontWeight="Bold">
        MODULE COMPLETED
        <IconVerified color={themeColorLighter} style={{ "margin-left": "20px" }} />
      </StyledLabel>
    );
  } else if (!isStudent && !hideEditOptions) {
    moduleCompleteOrAssign = (
      <StyledTag bgColor={themeColor} onClick={onClickAssign} style={moduleInlineStyle}>
        {totalAssigned ? "ASSIGN MODULE" : "NO ASSIGNMENTS"}
      </StyledTag>
    );
  }

  const moreActions = !isStudent && (
    <Dropdown overlay={moduleManagementMenu} trigger={["click"]}>
      <IconActionButton onClick={e => e.stopPropagation()}>
        <IconMoreVertical width={5} height={14} color={themeColor} />
      </IconActionButton>
    </Dropdown>
  );

  const moduleActions = (
    <Fragment>
      {hideLink}
      <LastColumn
        style={moduleInlineStyle}
        width={hideEditOptions || isStudent ? "auto" : null}
        justifyContent={hideEditOptions && "flex-end"}
        ml={hideEditOptions && "auto"}
      >
        {moduleCompleteOrAssign}
        {moreActions}
      </LastColumn>
    </Fragment>
  );

  return (
    <ModuleHeader>
      <ModuleID>
        <span>{moduleId || moduleIndex + 1}</span>
      </ModuleID>
      <ModuleHeaderData>
        <FirstColumn
          urlHasUseThis={urlHasUseThis}
          style={{
            ...moduleInlineStyle,
            marginRight: urlHasUseThis && "auto",
            width: isDesktop ? "" : "100%"
          }}
        >
          <StyledLabel fontWeight="normal" textColor={lightGrey5}>
            {moduleGroupName}
          </StyledLabel>
          <ModuleTitleWrapper>
            <Tooltip title={title}>
              <ModuleTitle data-cy="module-name">{title}</ModuleTitle>
            </Tooltip>
            <ModuleTitlePrefix>
              {!hideEditOptions && (
                <Icon
                  type="close-circle"
                  data-cy="removeUnit"
                  style={{ visibility: "hidden" }}
                  onClick={() => removeUnit(module.id)}
                />
              )}
            </ModuleTitlePrefix>
          </ModuleTitleWrapper>
          {description && (
            <ModuleDescription
              collapsed={collapsed}
              dangerouslySetInnerHTML={{ __html: collapsed ? toPreviewDescription : description }}
            />
          )}
        </FirstColumn>
        <ProgressBars
          isDesktop={isDesktop}
          isStudent={isStudent}
          urlHasUseThis={urlHasUseThis}
          columnStyle={moduleInlineStyle}
          data={summaryData[moduleIndex]}
        />
        {isDesktop ? moduleActions : moreActions}
      </ModuleHeaderData>
    </ModuleHeader>
  );
};

export const InfoProgressBar = ProgressBars;
export default ModuleRowView;
