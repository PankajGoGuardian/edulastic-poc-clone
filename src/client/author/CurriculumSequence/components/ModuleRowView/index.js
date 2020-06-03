import React, { Fragment } from "react";
import { Dropdown, Icon, Menu } from "antd";
import { IconMoreVertical, IconVerified } from "@edulastic/icons";
import { lightGrey5, greyThemeDark1, themeColor, themeColorLighter } from "@edulastic/colors";
import { StyledLabel, StyledTag, HideLinkLabel, InfoColumnLabel } from "../../../Reports/common/styled";
import { Tooltip } from "../../../../common/utils/helpers";
import { getProgressColor } from "../../util";
import {
  IconActionButton,
  InfoColumnsDesktop,
  InfoColumnsMobile,
  ModuleHeader,
  ModuleID,
  ModuleHeaderData,
  FirstColumn,
  ModuleTitleWrapper,
  ModuleTitle,
  ModuleTitlePrefix,
  ModuleDescription,
  ProficiencyColumn,
  StyledProgressBar,
  SubmittedColumn,
  ScoreColumn,
  ClassesColumn,
  TimeColumn,
  LastColumn
} from "../styled";

const ModuleRowView = props => {
  const {
    module,
    moduleIndex,
    summaryData,
    isStudent,
    isDesktop,
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

  const moduleManagementMenu = (
    <Menu data-cy="moduleItemMoreMenu">
      <Menu.Item onClick={addModuleMenuClick}>Add Module</Menu.Item>
      <Menu.Item onClick={editModuleMenuClick}>Edit Module</Menu.Item>
      <Menu.Item onClick={deleteModuleMenuClick}>Delete Module</Menu.Item>
    </Menu>
  );

  const moduleActionsMenu = (
    <Fragment>
      {!hideEditOptions && hasEditAccess && !isStudent && !moduleStatus ? (
        <HideLinkLabel
          textColor={themeColor}
          fontWeight="Bold"
          data-cy={module.hidden ? "show-module" : "hide-module"}
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            toggleModule(module, moduleIndex);
          }}
        >
          {module.hidden ? "SHOW MODULE" : "HIDE MODULE"}
        </HideLinkLabel>
      ) : null}
      <LastColumn
        style={moduleInlineStyle}
        width={hideEditOptions || isStudent ? "auto" : null}
        justifyContent={hideEditOptions && "flex-end"}
        ml={hideEditOptions && "auto"}
      >
        {moduleStatus ? (
          !hideEditOptions && (
            <StyledLabel data-cy="module-complete" textColor={themeColorLighter} fontWeight="Bold">
              MODULE COMPLETED
              <IconVerified color={themeColorLighter} style={{ "margin-left": "20px" }} />
            </StyledLabel>
          )
        ) : isStudent ? (
          <Fragment />
        ) : (
          !hideEditOptions && (
            <StyledTag
              data-cy="AssignWholeModule"
              bgColor={themeColor}
              onClick={() => {
                !module.hidden && totalAssigned ? assignModule(module) : {};
              }}
              style={moduleInlineStyle}
            >
              {totalAssigned ? "ASSIGN MODULE" : "NO ASSIGNMENTS"}
            </StyledTag>
          )
        )}
        {isDesktop && !isStudent && (
          <Dropdown overlay={moduleManagementMenu} trigger={["click"]}>
            <IconActionButton onClick={e => e.stopPropagation()}>
              <IconMoreVertical width={5} height={14} color={themeColor} />
            </IconActionButton>
          </Dropdown>
        )}
      </LastColumn>
    </Fragment>
  );

  const lastColumOfModuleRow = isDesktop ? (
    moduleActionsMenu
  ) : (
    <Dropdown
      overlay={
        <Fragment>
          {moduleActionsMenu}
          {moduleManagementMenu}
        </Fragment>
      }
      trigger={["click"]}
    >
      <IconActionButton onClick={e => e.stopPropagation()}>
        <IconMoreVertical width={5} height={14} color={themeColor} />
      </IconActionButton>
    </Dropdown>
  );

  const ResolvedInfoColumsWrapper = isDesktop ? InfoColumnsDesktop : InfoColumnsMobile;

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
          <ModuleDescription
            collapsed={collapsed}
            dangerouslySetInnerHTML={{ __html: collapsed ? toPreviewDescription : description }}
          />
        </FirstColumn>
        {urlHasUseThis && (
          <ResolvedInfoColumsWrapper>
            <ProficiencyColumn style={moduleInlineStyle}>
              <InfoColumnLabel textColor={lightGrey5}>PROFICIENCY</InfoColumnLabel>
              {/* TODO: Method to find Progress Percentage */}
              <StyledProgressBar
                strokeColor={getProgressColor(summaryData[moduleIndex]?.value)}
                strokeWidth={13}
                percent={summaryData[moduleIndex]?.value}
                format={percent => (percent ? `${percent}%` : "")}
              />
            </ProficiencyColumn>
            {!isStudent ? (
              <SubmittedColumn style={{ ...moduleInlineStyle }}>
                <InfoColumnLabel justify="center" textColor={lightGrey5}>
                  SUBMITTED
                </InfoColumnLabel>
                <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                  {/* TODO: Method to find submissions */}
                  {summaryData[moduleIndex]?.submitted === "-"
                    ? summaryData[moduleIndex]?.submitted
                    : `${summaryData[moduleIndex].submitted}%`}
                </InfoColumnLabel>
              </SubmittedColumn>
            ) : (
              <ScoreColumn>
                <InfoColumnLabel justify="center" textColor={lightGrey5}>
                  SCORE
                </InfoColumnLabel>
                <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                  {/* TODO: Method to find sum of scores */}
                  {summaryData[moduleIndex]?.scores >= 0 && summaryData[moduleIndex]?.maxScore
                    ? `${summaryData[moduleIndex]?.scores}/${summaryData[moduleIndex]?.maxScore}`
                    : "-"}
                </InfoColumnLabel>
              </ScoreColumn>
            )}
            {!isStudent ? (
              <ClassesColumn style={{ ...moduleInlineStyle }}>
                <InfoColumnLabel justify="center" textColor={lightGrey5}>
                  CLASSES
                </InfoColumnLabel>
                <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                  {/* TODO: Method to find classes */}
                  {summaryData[moduleIndex]?.classes}
                </InfoColumnLabel>
              </ClassesColumn>
            ) : (
              <TimeColumn>
                <InfoColumnLabel justify="center" textColor={lightGrey5}>
                  TIME SPENT
                </InfoColumnLabel>
                <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                  {/* TODO: Method to find Total Time Spent */}
                  {summaryData[moduleIndex]?.timeSpent}
                </InfoColumnLabel>
              </TimeColumn>
            )}
          </ResolvedInfoColumsWrapper>
        )}
        {lastColumOfModuleRow}
      </ModuleHeaderData>
    </ModuleHeader>
  );
};

export default ModuleRowView;
