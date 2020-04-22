import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Input, message } from "antd";
import {
  desktopWidth,
  themeColor,
  white,
  lightGreySecondary,
  fadedGrey,
  darkGrey,
  greyish,
  title,
  greenDark6
} from "@edulastic/colors";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { IconPlusCircle, IconTrash } from "@edulastic/icons";
import { FaBars } from "react-icons/fa";
import { ThemeButton } from "../../../src/components/common/ThemeButton";
import { EduButton } from "@edulastic/common";
import { ModuleCount } from "../CurriculumModuleRow";

/*
 *
 * @TODO
 * 1. Seperate functional components to its respective files
 * 2. Seperate styled components to its respective files
 * 3. Remove unused props and slices of code
 *
 */

const ModuleResequenceHandle = SortableHandle(() => (
  <DragHandle>
    <FaBars />
  </DragHandle>
));

const ModuleItem = SortableElement(props => {
  const {
    module: { mIndex, moduleId, moduleGroupName, title: moduleName, description: moduleDescription } = {},
    id,
    updateModule,
    deleteModule
  } = props;

  const [editState, toggleEdit] = useState(false);

  const [editModuleGroupName, setEditModuleGroupName] = useState("");
  const [editModuleId, setEditModuleId] = useState("");
  const [editModuleName, setEditModuleName] = useState("");
  const [editModuleDescription, setEditModuleDescription] = useState("");
  /*
   * TODO: On SortElement Click Highlight Container
   */
  const [dragging] = useState(false);

  const handleInputChange = (e, label) => {
    const val = e.target.value;
    switch (label) {
      case "moduleGroupName":
        val.toString().length <= 24 && setEditModuleGroupName(val);
        break;
      case "moduleId":
        val.toStrinval.toString() <= 4 && setEditModuleId(val);
        break;
      case "moduleName":
        val.toString().length <= 100 && setEditModuleName(val);
        break;
      case "moduleDescription":
        val.toString().length <= 1000 && setEditModuleDescription(val);
        break;
      default:
        console.warn("Invalid call to function:handleInputChange");
        break;
    }
  };

  const handleModuleEdit = () => {
    setEditModuleGroupName(moduleGroupName);
    setEditModuleId(moduleId);
    setEditModuleName(moduleName);
    setEditModuleDescription(moduleDescription);
    toggleEdit(true);
  };

  const handleEdit = id => {
    if (updateModule({ id, editModuleGroupName, editModuleId, editModuleName, editModuleDescription })) {
      toggleEdit(false);
    }
  };

  return editState ? (
    <>
      <EditModuleContainer>
        <div data-cy={`module-${id + 1}`}>
          <Title>Module Name</Title>
          <Input
            placeholder="Enter module group name"
            value={editModuleGroupName}
            onChange={e => handleInputChange(e, "moduleGroupName")}
            style={{ background: lightGreySecondary, width: "685px" }}
          />
          <Title>Module ID/Name</Title>
          <Input
            placeholder="Enter ID"
            style={{ display: "inline-block", background: lightGreySecondary, width: "155px" }}
            value={editModuleId}
            onChange={e => handleInputChange(e, "moduleId")}
          />
          <Input
            placeholder="Enter module name"
            style={{ display: "inline-block", background: lightGreySecondary, width: "515px", marginLeft: "15px" }}
            value={editModuleName}
            onChange={e => handleInputChange(e, "moduleName")}
          />
          <Title>Description</Title>
          <Input.TextArea
            placeholder="Enter module description"
            value={editModuleDescription}
            onChange={e => handleInputChange(e, "moduleDescription")}
            style={{ background: lightGreySecondary, width: "685px" }}
          />
          <ThemeButton data-cy="manageModuleApply" key="submit" type="primary" onClick={() => handleEdit(id)}>
            <StyledSpan width={100} fSize={12}>
              UPDATE MODULE
            </StyledSpan>
          </ThemeButton>
        </div>
      </EditModuleContainer>
    </>
  ) : (
    <ModuleContainer dragging={dragging} data-cy={`module-${mIndex || id + 1}`}>
      <ModuleResequenceHandle />
      <ModuleID width={30} fSize={18}>
        <span>{moduleId || mIndex || id + 1}</span>
      </ModuleID>
      <ModuleContent>
        <ModuleGroup>{moduleGroupName}</ModuleGroup>
        <ModuleTitle>
          <Label>{moduleName}</Label>
        </ModuleTitle>
        <ModuleDescription>{moduleDescription}</ModuleDescription>
      </ModuleContent>
      <ModuleActions>
        <ThemeButton key="submit" type="primary" onClick={handleModuleEdit}>
          <StyledSpan width={70} fSize={12}>
            EDIT
          </StyledSpan>
        </ThemeButton>
        <Button
          style={{ padding: "8px" }}
          data-cy="addModuleCancel"
          type="primary"
          ghost
          key="back"
          onClick={() => deleteModule(id)}
        >
          <IconTrash color={themeColor} width={15} height={15} />
        </Button>
      </ModuleActions>
    </ModuleContainer>
  );
});

const Label = styled.span`
  padding: 0 4px;
`;

const EditModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 230px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  margin: 8px 0;
  /* box-shadow: 0 0 15px 0 ${fadedGrey}; */
  border-radius: 4px;
  border: 1px solid #DADAE4;
`;

const ModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 6px 0px;
  z-index: 1001;
  /* box-shadow: 0 0 10px 0 ${fadedGrey}; */
  border-radius: 4px;
  border: ${({ dragging }) => (dragging ? `1px solid ${themeColor}` : "1px solid #DADAE4")};
`;

const DragHandle = styled.div`
  color: ${themeColor};
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const ModuleContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ModuleID = styled.div`
  width: 100%;
  max-width: 64px;
  span {
    display: block;
    width: fit-content;
    margin: auto;
    min-width: 38px;
    max-width: 64px;
    min-height: 30px;
    color: ${white};
    background: ${greenDark6};
    text-align: center;
    font-size: 16px;
    padding: 4px;
    border-radius: 2px;
    font-weight: 600;
    user-select: none;
  }
  margin-right: 15px;
`;

const ModuleGroup = styled.div`
  color: #8e9aa4;
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  padding: 0 4px;
  text-transform: uppercase;
`;

const ModuleTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 100%;
`;

const ModuleDescription = styled.div`
  font-size: 12px;
  color: ${darkGrey};
  white-space: pre-wrap;
  overflow-wrap: break-word;
  padding: 0 4px;
`;

const ModuleActions = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  width: 235px;
`;

const SortableModules = SortableContainer(props => (
  <StyledModuleList addState={props.addState}>
    {props.modulesList.map((mod, i) => (
      <ModuleItem id={i} key={`module-${mod.title}-${mod.description}`} module={mod} index={i} {...props} />
    ))}
  </StyledModuleList>
));

const ManageModulesModalBody = props => {
  const [addState, toggleAddState] = useState(props.addState || true);

  const [moduleGroupName, setModuleGroupName] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  const {
    destinationCurriculumSequence,
    onCloseManageModule,
    addModuleToPlaylist,
    deleteModuleFromPlaylist,
    updateModuleInPlaylist,
    resequenceModules,
    handleApply,
    handleTestAdded
  } = props;

  const setEditModuleData = (moduleGroupName, moduleId, moduleName, moduleDescription) => {
    setEditModuleGroupName(moduleGroupName);
    setEditModuleId(moduleId);
    setEditModuleName(moduleName);
    setEditModuleDescription(moduleDescription);
  };

  const clearPreviousAddData = () => {
    setModuleGroupName("");
    setModuleId("");
    setModuleName("");
    setModuleDescription("");
  };
  const handleSort = prop => resequenceModules(prop);

  const applyHandler = () => handleApply();

  const handleModuleSave = () => {
    if (moduleName.trim()) {
      const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
        x => x.title.trim().toLowerCase() === moduleName.trim().toLowerCase()
      );
      if (titleAlreadyExists) {
        message.error(`Module with title '${moduleName}' already exists. Please use another title`);
        return;
      }
      addModuleToPlaylist({ title: moduleName, description: moduleDescription, moduleId, moduleGroupName });
      if (props.addState) {
        handleTestAdded(0);
        message.info(`${moduleName} module is created and added ${props.testAddedTitle} test to it`);
      }
      toggleAddState(false);
      clearPreviousAddData();
    } else {
      message.warning("Module name cannot be empty");
    }
  };

  const handleModuleCancel = () => {
    toggleAddState(false);
    clearPreviousAddData();
  };

  const handleInputChange = (e, label) => {
    const val = e.target.value;
    switch (label) {
      case "moduleGroupName":
        val.toString().length <= 24 && setModuleGroupName(val);
        break;
      case "moduleId":
        val.toString().length <= 4 && setModuleId(val);
        break;
      case "moduleName":
        val.toString().length <= 100 && setModuleName(val);
        break;
      case "moduleDescription":
        val.toString().length <= 1000 && setModuleDescription(val);
        break;
      default:
        console.warn("Invalid call to function:handleInputChange");
        break;
    }
  };

  const handleModuleUpdate = ({ id, editModuleGroupName, editModuleId, editModuleName, editModuleDescription }) => {
    const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
      (x, ind) => x.title.trim().toLowerCase() === editModuleName.trim().toLowerCase() && ind !== id
    );
    if (titleAlreadyExists) {
      message.error(`Module with title '${editModuleName}' already exists. Please use another title`);
      return false;
    }
    if (editModuleName) {
      updateModuleInPlaylist({
        id,
        title: editModuleName,
        description: editModuleDescription,
        moduleGroupName: editModuleGroupName,
        moduleId: editModuleId
      });
    } else {
      message.warning("Module title cannot be Empty");
    }
    return true;
  };

  const modulesList = [...destinationCurriculumSequence.modules];

  return (
    <ModalContainer>
      <ModalHeader>Manage Modules</ModalHeader>
      <ModalContent>
        <SortableModules
          setEditModuleData={setEditModuleData}
          modulesList={modulesList}
          deleteModule={deleteModuleFromPlaylist}
          updateModule={handleModuleUpdate}
          handleInputChange={handleInputChange}
          onSortEnd={handleSort}
          lockAxis="y"
          lockOffset={["0%", "0%"]}
          lockToContainerEdges
          useDragHandle
          addState={addState}
        />
        {addState && (
          <>
            <AddNewModuleContainer>
              <div data-cy={`module-${modulesList.length + 1}`}>
                <Title>Module Group Name</Title>
                <Input
                  placeholder="Enter module group name"
                  style={{ background: lightGreySecondary, width: "685px" }}
                  value={moduleGroupName}
                  onChange={e => handleInputChange(e, "moduleGroupName")}
                />
                <Title>Module ID/Name</Title>
                <Input
                  placeholder="Enter ID"
                  style={{ display: "inline-block", background: lightGreySecondary, width: "155px" }}
                  value={moduleId}
                  onChange={e => handleInputChange(e, "moduleId")}
                />
                <Input
                  placeholder="Enter module name"
                  style={{
                    display: "inline-block",
                    background: lightGreySecondary,
                    width: "515px",
                    marginLeft: "15px"
                  }}
                  value={moduleName}
                  onChange={e => handleInputChange(e, "moduleName")}
                />
                <Title>Description</Title>
                <Input.TextArea
                  placeholder="Enter module description"
                  value={moduleDescription}
                  style={{ background: lightGreySecondary, width: "685px" }}
                  onChange={e => handleInputChange(e, "moduleDescription")}
                />
                <AddBtnsWrapper>
                  <ThemeButton
                    isGhost
                    data-cy="cancelModuleAdd"
                    key="submit"
                    type="primary"
                    onClick={handleModuleCancel}
                  >
                    <StyledSpan width={80} fSize={12}>
                      CANCEL
                    </StyledSpan>
                  </ThemeButton>
                  <ThemeButton data-cy="addNewModule" key="submit" type="primary" onClick={handleModuleSave}>
                    <StyledSpan width={80} fSize={12}>
                      ADD
                    </StyledSpan>
                  </ThemeButton>
                </AddBtnsWrapper>
              </div>
            </AddNewModuleContainer>
          </>
        )}

        {!addState && (
          <EduButton key="submit" type="primary" data-cy="addModule" onClick={() => toggleAddState(true)}>
            <IconPlusCircle color={white} width={15} height={15} />
            <span>ADD MODULE</span>
          </EduButton>
        )}
      </ModalContent>
      <ModalFooter>
        <EduButton
          isGhost
          width="200px"
          data-cy="manageModuleCancel"
          type="primary"
          key="back"
          onClick={onCloseManageModule}
        >
          CANCEL
        </EduButton>
        <EduButton width="200px" data-cy="done-module" key="submit" type="primary" onClick={applyHandler}>
          SAVE
        </EduButton>
      </ModalFooter>
    </ModalContainer>
  );
};

ManageModulesModalBody.propTypes = {
  destinationCurriculumSequence: PropTypes.object.isRequired,
  addModuleToPlaylist: PropTypes.func.isRequired
};

export default ManageModulesModalBody;

const Title = styled.div`
  margin: 4px 2px;
  text-transform: uppercase;
  color: ${title};
  font-weight: 500;
`;

const AddNewModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px 20px 20px 40px;
  /* box-shadow: 0 0 15px 0 ${fadedGrey}; */
  margin-bottom: 20px;
  border: 1px solid #DADAE4;
`;

const StyledModuleList = styled.div`
  margin-bottom: 10px;
  max-height: ${props => (props.addState ? "calc(100vh - 480px)" : "calc(100vh - 230px)")};
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AddBtnsWrapper = styled.div`
  display: flex;
  width: 235px;
  justify-content: space-between;
  margin-top: 8px;
`;

const StyledSpan = styled.span`
  width: ${({ width }) => width}px;
  font-size: ${({ fSize }) => fSize}px;
`;

const ModalContainer = styled.div`
  width: 100%;
  background: ${white};
  .ant-input {
    margin-bottom: 10px;
  }
`;

const ModalHeader = styled.h3`
  font-size: 20px;
  font-weight: 600;
`;

const ModalContent = styled.div`
  padding: 20px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 480px;
  padding: 20px;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 40px;
    padding-right: 40px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;
