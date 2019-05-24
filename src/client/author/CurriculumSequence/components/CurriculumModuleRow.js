import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, Menu, Dropdown, Icon, Modal } from "antd";
import {
  mobileWidth,
  lightBlue,
  white,
  desktopWidth,
  tabletWidth,
  greenThird,
  extraDesktopWidth,
  mainBgColor
} from "@edulastic/colors";
import { IconVerified, IconVisualization, IconCheckSmall, IconMoreVertical, IconLeftArrow } from "@edulastic/icons";
import {
  toggleCheckedUnitItemAction,
  setSelectedItemsForAssignAction,
  removeItemFromUnitAction,
  removeUnitAction
} from "../ducks";
import assessmentRed from "../assets/assessment.svg";
import assessmentGreen from "../assets/concept-check.svg";
import { matchAssigned, getNumberOfAssigned } from "../util";
import Tags from "../../src/components/common/Tags";

import AssessmentPlayer from "../../../assessment";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import AssignmentDragItem from "./AssignmentDragItem";
/**
 * @typedef {object} Props
 * @property {import('./CurriculumSequence').Module} module
 * @property {function} onCollapseExpand
 * @property {function} toggleUnitItem
 * @property {boolean} collapsed
 * @property {string[]} checkedUnitItems
 * @property {boolean} isContentExpanded
 * @property {any[]} assigned
 * @property {function} setSelectedItemsForAssign
 * @property {function} removeItemFromUnit
 * @property {function} removeUnit
 * @property {boolean} padding
 * set module item that will be assigned, also
 * when there's more than 0 elements set, modal for assignment will be shown
 * when empty array is set, modal is hidden
 */

const IS_ASSIGNED = "ASSIGNED";
const NOT_ASSIGNED = "ASSIGN";

/** @extends Component<Props> */
class ModuleRow extends Component {
  state = {
    showModal: false,
    selectedTest: ""
  };

  /**
   * @param {import('./CurriculumSequence').Module} module
   */
  assignModule = module => {
    const { setSelectedItemsForAssign, history, playlistId } = this.props;
    const moduleItemsIds = module.data.map(item => item.contentId);
    setSelectedItemsForAssign(moduleItemsIds);
    history.push(`/author/playlists/assignments/${playlistId}/${module._id}`);
  };
  assignTest = (moduleId, testId) => {
    const { history, playlistId } = this.props;
    history.push(`/author/playlists/assignments/${playlistId}/${moduleId}/${testId}`);
  };
  viewTest = testId => {
    this.setState({
      showModal: true,
      selectedTest: testId
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    const {
      onCollapseExpand,
      collapsed,
      padding,
      assigned,
      status,
      isContentExpanded,
      module,
      moduleIndex,
      mode,
      dropContent,
      onBeginDrag,
      removeItemFromUnit,
      hideEditOptions,
      curriculum,
      customize,
      removeUnit
    } = this.props;
    const { completed, title, _id, data = [] } = module;

    const { assignModule, assignTest } = this;

    const totalAssigned = data.length;
    const numberOfAssigned = getNumberOfAssigned(assigned, data.map(d => d.contentId));
    const [whichModule, moduleName] = title ? title.split(":") : [];
    const { showModal, selectedTest } = this.state;
    const menu = (
      <Menu data-cy="addContentMenu">
        {curriculum.modules.map(moduleItem => (
          <Menu.Item data-cy="addContentMenuItem">
            <span>{moduleItem.title}</span>
          </Menu.Item>
        ))}
        <Menu.Item data-cy="addContentMenuItemAssignNow">
          <span>Assign Now</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <React.Fragment>
        <ModalWrapper
          footer={null}
          visible={showModal}
          onCancel={this.closeModal}
          width="calc(100% - 30px)"
          height="calc(100% - 30px)"
          destroyOnClose={true}
        >
          <AssessmentPlayer testId={selectedTest} preview />
        </ModalWrapper>
        <ModuleWrapper data-cy="curriculumModuleRow" key={`${data.length}-${module.id}`} padding={padding}>
          <Container>
            <Module>
              <ModuleHeader
                collapsed={collapsed}
                padding="17px 25px 16px 27px"
                borderRadius={collapsed ? "5px" : "unset"}
                boxShadow={collapsed ? "0 3px 7px 0 rgba(0, 0, 0, 0.1)" : "unset"}
              >
                <ModuleInfo>
                  <CustomIcon marginRight="25" marginLeft={7} onClick={() => onCollapseExpand(moduleIndex)}>
                    {!collapsed ? (
                      <Icon type="up" style={{ color: "#707070" }} />
                    ) : (
                      <Icon type="down" style={{ color: "#707070" }} />
                    )}
                  </CustomIcon>
                  <ModuleTitleAssignedWrapper>
                    <ModuleTitleWrapper>
                      <ModuleTitlePrefix>
                        {whichModule}
                        {!hideEditOptions && (
                          <Icon
                            type="close-circle"
                            data-cy="removeUnit"
                            style={{ visibility: "hidden" }}
                            onClick={() => removeUnit(module.id)}
                          />
                        )}
                      </ModuleTitlePrefix>
                      <ModuleTitle>{moduleName}</ModuleTitle>
                    </ModuleTitleWrapper>

                    {completed && !hideEditOptions && (
                      <React.Fragment>
                        <ModuleCompleted>
                          <ModuleCompletedLabel>MODULE COMPLETED</ModuleCompletedLabel>
                          <ModuleCompletedIcon>
                            <CustomIcon>
                              <IconVerified color={greenThird} />
                            </CustomIcon>
                          </ModuleCompletedIcon>
                        </ModuleCompleted>
                      </React.Fragment>
                    )}
                    <ModulesWrapper>
                      {!completed && !hideEditOptions && (
                        <ModulesAssigned>
                          Assigned
                          <NumberOfAssigned data-cy="numberOfAssigned">{numberOfAssigned}</NumberOfAssigned>
                          of
                          <TotalAssigned data-cy="totalAssigned">{totalAssigned}</TotalAssigned>
                        </ModulesAssigned>
                      )}
                      {((!completed && !hideEditOptions) || (status === "published" && mode === "embedded")) && (
                        <AssignModuleButton>
                          <Button ghost data-cy="AssignWholeModule" onClick={() => assignModule(module)}>
                            ASSIGN MODULE
                          </Button>
                        </AssignModuleButton>
                      )}
                    </ModulesWrapper>
                  </ModuleTitleAssignedWrapper>
                </ModuleInfo>
              </ModuleHeader>
              {!collapsed && (
                // eslint-disable-next-line
                <div>
                  {data.map((moduleData, index) => {
                    const { standards } = moduleData;
                    const standardTags = (standards && standards.map(stand => stand.name)) || [];
                    const moreMenu = (
                      <Menu data-cy="moduleItemMoreMenu">
                        <Menu.Item
                          data-cy="moduleItemMoreMenuItem"
                          onClick={() =>
                            removeItemFromUnit({
                              moduleIndex: moduleIndex,
                              itemId: moduleData.contentId
                            })
                          }
                        >
                          Remove
                        </Menu.Item>
                      </Menu>
                    );

                    const isAssigned = matchAssigned(assigned, moduleData.contentId).length > 0;
                    if ((!hideEditOptions && customize) || mode === "embedded") {
                      return (
                        <AssignmentDragItem
                          key={`${index}-${moduleData.id}`}
                          moduleData={moduleData}
                          onToggleCheck={() => toggleCheckedUnitItem(moduleData.contentId)}
                          isContentExpanded={isContentExpanded}
                          hideEditOptions={hideEditOptions}
                          assignTest={this.assignTest}
                          mode={mode}
                          assigned={assigned}
                          moreMenu={moreMenu}
                          menu={menu}
                          standardTags={standardTags}
                          status={status}
                          contentIndex={index}
                          moduleIndex={moduleIndex}
                          handleDrop={dropContent}
                          onBeginDrag={onBeginDrag}
                        />
                      );
                    }

                    return (
                      <Assignment
                        data-cy="moduleAssignment"
                        key={`${moduleData.id}-${moduleData.assigned}`}
                        padding="14px 30px 14px 50px"
                        borderRadius="unset"
                        boxShadow="unset"
                      >
                        <ModuleFocused />
                        <AssignmentInnerWrapper>
                          <AssignmentContent expanded={isContentExpanded}>
                            {/* <Checkbox
                            onChange={() => toggleUnitItem(moduleData.id)}
                            checked={checkedUnitItems.indexOf(moduleData.id) !== -1}
                            className="module-checkbox"
                          /> */}
                            <CustomIcon marginLeft={16}>
                              <Icon type="right" style={{ color: "#707070" }} />
                            </CustomIcon>
                            <ModuleDataName>{moduleData.contentTitle}</ModuleDataName>
                          </AssignmentContent>
                          <AssignmentIconsWrapper expanded={isContentExpanded}>
                            {!hideEditOptions && (
                              <ModuleAssignedUnit>
                                {moduleData.assigned && !moduleData.completed && (
                                  <CustomIcon>
                                    <img src={assessmentRed} alt="Module item is assigned" />
                                  </CustomIcon>
                                )}
                                {moduleData.completed && (
                                  <CustomIcon>
                                    <img src={assessmentGreen} alt="Module item is completed" />
                                  </CustomIcon>
                                )}
                              </ModuleAssignedUnit>
                            )}
                            <Tags tags={standardTags} />
                            <AssignmentIconsHolder>
                              <AssignmentIcon>
                                <CustomIcon>
                                  <IconVisualization
                                    color="#1774F0"
                                    onClick={() => this.viewTest(moduleData.contentId)}
                                  />
                                </CustomIcon>
                              </AssignmentIcon>
                              {(!hideEditOptions || (status === "published" && mode === "embedded")) && (
                                <AssignmentButton assigned={isAssigned}>
                                  <Button data-cy="assignButton" onClick={() => assignTest(_id, moduleData.contentId)}>
                                    {isAssigned ? (
                                      <IconCheckSmall color={white} />
                                    ) : (
                                      <IconLeftArrow color="#1774F0" width={13.3} height={9.35} />
                                    )}
                                    {isAssigned ? IS_ASSIGNED : NOT_ASSIGNED}
                                  </Button>
                                </AssignmentButton>
                              )}
                              {(!hideEditOptions || mode === "embedded") && (
                                <AssignmentIcon>
                                  <Dropdown overlay={moreMenu} trigger={["click"]}>
                                    <CustomIcon data-cy="assignmentMoreOptionsIcon" marginLeft={25} marginRight={1}>
                                      <IconMoreVertical color="#1774F0" />
                                    </CustomIcon>
                                  </Dropdown>
                                </AssignmentIcon>
                              )}
                            </AssignmentIconsHolder>
                          </AssignmentIconsWrapper>
                        </AssignmentInnerWrapper>
                      </Assignment>
                    );
                  })}
                </div>
              )}
            </Module>
          </Container>
        </ModuleWrapper>
      </React.Fragment>
    );
  }
}

ModuleRow.propTypes = {
  setSelectedItemsForAssign: PropTypes.func.isRequired,
  module: PropTypes.object.isRequired,
  onCollapseExpand: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  padding: PropTypes.bool.isRequired,
  // checkedUnitItems: PropTypes.array.isRequired,
  customize: PropTypes.bool,
  isContentExpanded: PropTypes.bool.isRequired,
  removeItemFromUnit: PropTypes.func.isRequired,
  assigned: PropTypes.array.isRequired,
  mode: PropTypes.string,
  status: PropTypes.string,
  removeUnit: PropTypes.func.isRequired
};

const ModalWrapper = styled(Modal)`
  top: 20px;
  padding: 0;
  overflow: hidden;
  .ant-modal-content {
    background: ${mainBgColor};
    .ant-modal-close-icon {
      color: ${white};
    }
    .ant-modal-body {
      padding: 0px;
      min-height: 100px;
      text-align: center;
      main {
        padding: 60px 0px 0px;
        height: calc(100vh - 40px);
        & > section {
          padding: 0px;
          min-height: calc(100vh - 100px);
        }
      }
    }
  }
`;

export const CustomIcon = styled.span`
  cursor: pointer;
  margin-right: ${props => (props.marginRight ? props.marginRight : 25)}px;
  margin-left: ${({ marginLeft }) => marginLeft || 0}px;
  @media only screen and (max-width: ${mobileWidth}) {
    margin-right: 5px;
    margin-left: 0px;
    padding: 5px;
  }
`;

export const AssignmentIconsHolder = styled.div`
  display: flex;
  justify-items: flex-end;
  margin-left: auto;
  @media only screen and (max-width: ${desktopWidth}) {
    margin-left: 0;
    justify-items: flex-start;
    /* margin-right: 100%;  */
  }
`;

/* NOTE: margin-right: 100%; - hack but works */
const ModuleFocused = styled.div`
  border-left: 3px solid #4aac8b;
  width: 3px;
  position: absolute;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  top: 0;
  opacity: 0;
`;

export const ModuleAssignedUnit = styled.div`
  margin-right: auto;
  @media only screen and (max-width: ${tabletWidth}) {
    margin-right: 0;
    position: absolute;
    top: 0px;
  }
  @media only screen and (max-width: ${tabletWidth}) and (min-width: ${mobileWidth}) {
    right: -25px;
  }
`;

const ModuleTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: ${tabletWidth}) {
    width: 80%;
  }
`;

const ModuleCompletedLabel = styled.div`
  color: ${greenThird};
  font-size: 11px;
  @media only screen and (max-width: ${tabletWidth}) {
    display: none;
  }
`;

const ModuleCompletedIcon = styled.div`
  padding-left: 30px;
  padding-right: 30px;
  @media only screen and (max-width: ${tabletWidth}) {
    padding-left: 0px;
    padding-right: 0px;
    position: absolute;
    top: 5px;
    right: -10px;
  }
`;

const ModuleCompleted = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  width: auto;
  align-items: center;
  @media only screen and (max-width: ${tabletWidth}) {
    align-self: flex-start;
    margin-left: 0;
  }
`;

const NumberOfAssigned = styled.strong`
  padding-left: 4px;
  padding-right: 4px;
  font-weight: bolder;
`;

const TotalAssigned = styled.strong`
  padding-left: 4px;
  font-weight: bolder;
`;

export const AssignmentButton = styled.div`
  min-width: 121px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : "#1774F0")};
    border-color: ${({ assigned }) => (assigned ? "#1774F0" : white)};
    background-color: ${({ assigned }) => (assigned ? "#1774F0" : white)};
    min-width: 121px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(201, 208, 219, 0.5);
    &:hover {
      background-color: ${({ assigned }) => (assigned ? white : "#1774F0")};
      color: ${({ assigned }) => (assigned ? "#1774F0" : white)};
      border-color: ${({ assigned }) => (assigned ? white : "#1774F0")};
      svg {
        fill: ${({ assigned }) => (assigned ? "#1774F0" : white)};
      }
    }
    i {
      position: absolute;
      position: absolute;
      left: 6px;
      display: flex;
      align-items: center;
    }
    span {
      margin-left: auto;
      margin-right: auto;
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

const AssignModuleButton = styled.div`
  align-self: center;
  .ant-btn {
    min-height: 30px;
    font-size: 10px;
    margin-right: 20px;
    color: #1774f0;
    border-color: ${white};
    box-shadow: 0 2px 4px rgba(201, 208, 219, 0.5);
    @media only screen and (max-width: ${mobileWidth}) {
      margin-right: 0px;
      padding: 0px 7px;
    }
  }
  @media only screen and (max-width: ${desktopWidth}) {
    align-self: flex-start;
  }
`;

export const AssignmentContent = styled.div`
  flex-direction: row;
  display: flex;
  min-width: ${props => (!props.expanded ? "30%" : "45%")};
  @media only screen and (max-width: ${mobileWidth}) {
    width: 80%;
  }
`;

const ModuleTitle = styled.div`
  display: flex;
  justify-self: flex-start;
  align-items: center;
  color: #30404f;
  font-size: 18px;
  @media only screen and (max-width: ${tabletWidth}) {
    align-items: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    padding: 0px 0px 5px;
  }
`;

const ModuleTitleAssignedWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  @media only screen and (max-width: ${tabletWidth}) {
    flex-wrap: wrap;
    margin-top: -5px;
    position: relative;
  }
`;

const ModuleTitlePrefix = styled.div`
  font-weight: 300;
`;

export const ModuleDataName = styled.div`
  font-weight: 600;
  color: #30404f;
  font-size: 14px;
  font-family: Open Sans, SemiBold;
  @media only screen and (max-width: ${desktopWidth}) {
    min-width: auto;
    order: 2;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    font-size: 12px;
    padding: 0px 0px 5px;
  }
`;

const ModuleInfo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  @media only screen and (max-width: ${mobileWidth}) {
    align-items: flex-start;
  }
`;

const AssignmentIconsWrapper = styled.div`
  margin-left: auto;
  padding: 0px;
  display: inline-flex;
  min-width: 65%;
  display: flex;
  justify-content: flex-end;
  @media screen and (max-width: ${extraDesktopWidth}) {
    min-width: 45%;
  }
  @media screen and (max-width: ${desktopWidth}) {
    min-width: 35%;
  }
  @media only screen and (max-width: ${tabletWidth}) {
    min-width: 50%;
    padding-top: 10px;
    margin-left: auto;
    margin-right: 0px;
  }
  @media screen and (max-width: ${mobileWidth}) {
    min-width: 100%;
  }
`;

export const AssignmentIcon = styled.span`
  margin-left: 10px;
  margin-right: 10px;
`;

const Row = styled.div`
  border-radius: 10px;
  background: ${white};
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 10px;
  box-shadow: none;
  align-items: center;
  @media (max-width: ${mobileWidth}) {
    padding-left: 10px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  height: 100%;

  @media (max-width: ${mobileWidth}) {
    padding-left: 0px;
    margin-right: ${props => !props.value && "20px !important"};
    margin-left: ${props => props.value && "20px !important"};
  }
`;

const ModulesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  margin-bottom: auto;
  margin-top: auto;
  @media only screen and (max-width: ${tabletWidth}) {
    justify-content: flex-start;
    margin-left: auto;
    margin-bottom: 0;
    margin-top: 0;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    /* flex-direction: column; */
  }
`;

const Module = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #949494;
  @media only screen and (max-width: ${mobileWidth}) {
    font-size: 11px;
  }
`;

const ModuleHeader = styled(Row)`
  box-shadow: none;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: ${({ collapsed }) => (!collapsed ? "0px" : "10px")};
  border-bottom-right-radius: ${({ collapsed }) => (!collapsed ? "0px" : "10px")};
  /* padding-bottom: 0; */
  overflow: hidden;
  position: relative;
`;

const Assignment = styled(Row)`
  border-radius: 0;
  border-bottom: 1px #f2f2f2 solid;
  position: relative;
  background: #f9fbfc !important;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
  }
  &:first-child {
    border-top: 1px #f2f2f2 solid;
  }
  &:last-child {
    border-bottom: 0px;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
`;
Assignment.displayName = "Assignment";

const AssignmentInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  .module-checkbox {
    align-self: center;
  }
  & div,
  & span {
    align-items: center;
  }
  @media only screen and (max-width: ${tabletWidth}) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-items: center;
    margin-left: auto;
    align-items: flex-start;
  }
`;
AssignmentInnerWrapper.displayName = "AssignmentInnerWrapper";

const ModulesAssigned = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  padding-right: 20px;
  padding-left: 20px;
  font-weight: 400;
  color: #434b5d;
  margin-left: auto;
  justify-self: flex-end;
  line-height: 2.4;
  min-width: 123px;
  max-height: 30px;
  margin-top: auto;
  margin-bottom: auto;
  font-family: Open Sans, SemiBold;
  @media only screen and (max-width: ${tabletWidth}) {
    margin-right: auto;
    justify-self: flex-start;
    padding: 0;
    margin: 0;
    margin-bottom: 10px;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    min-width: 95px;
    margin-bottom: 0px;
  }
`;

const ModuleWrapper = styled.div`
  & {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0px;
    padding-right: ${({ padding }) => (padding ? "20px" : "0px")};
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .module-checkbox {
    span {
      margin-right: 23px;
    }
  }
  .module-btn-assigned {
    background-color: ${lightBlue};
    margin-left: auto;
    justify-self: flex-end;
  }
  .module-btn-expand-collapse {
    border: none;
    box-shadow: none;
  }
`;

const enhance = compose(
  connect(
    ({ curriculumSequence }) => ({
      checkedUnitItems: curriculumSequence.checkedUnitItems,
      isContentExpanded: curriculumSequence.isContentExpanded,
      assigned: curriculumSequence.assigned
    }),
    {
      toggleUnitItem: toggleCheckedUnitItemAction,
      setSelectedItemsForAssign: setSelectedItemsForAssignAction,
      removeItemFromUnit: removeTestFromModuleAction,
      removeUnit: removeUnitAction
    }
  )
);

export default enhance(ModuleRow);
