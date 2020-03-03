import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Input, message } from "antd";
import { desktopWidth, themeColor, white, lightGreySecondary, fadedGrey, darkGrey, greyish } from "@edulastic/colors";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { IconPlusCircle, IconTrash, IconSave } from "@edulastic/icons";
import { FaBars } from "react-icons/fa";
import { ThemeButton } from "../../../src/components/common/ThemeButton";

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
  const { module: { title, mIndex, description } = {}, id, updateModule, deleteModule } = props;

  const [editState, toggleEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  /*
   * TODO: On SortElement Click Highlight Container
   */
  const [dragging, setDragging] = useState(false);

  const handleInputChange = (e, label) => {
    label === "title" ? setEditTitle(e.target.value) : setEditDescription(e.target.value);
  };

  const handleModuleEdit = () => {
    setEditTitle(title);
    setEditDescription(description);
    toggleEdit(true);
  };

  const handleEdit = id => {
    if (updateModule({ id, editTitle, editDescription })) {
      toggleEdit(false);
    }
  };

  return editState ? (
    <>
      <EditModuleContainer>
        <QLabel>{mIndex || id + 1}.</QLabel>
        <div data-cy={`module-${id + 1}`}>
          <Title>Module Name</Title>
          <Input
            placeholder="Enter module name"
            value={editTitle}
            onChange={e => handleInputChange(e, "title")}
            style={{ background: lightGreySecondary, width: "685px" }}
          />
          <Title>Description</Title>
          <Input.TextArea
            placeholder="Enter module description"
            value={editDescription}
            onChange={e => handleInputChange(e, "description")}
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
      <ModuleContent>
        <ModuleTitle>
          <StyledSpan width={30} fSize={18}>
            {mIndex || id + 1}.
          </StyledSpan>
          <Label>{title}</Label>
        </ModuleTitle>
        <ModuleDescription>{description}</ModuleDescription>
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
  box-shadow: 0 0 15px 0 ${fadedGrey};
  border-radius: 4px;
`;

const ModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 6px;
  z-index: 1001;
  box-shadow: 0 0 10px 0 ${fadedGrey};
  border-radius: 4px;
  border: ${({ dragging }) => dragging && `1px solid ${  themeColor}`};
`;

const DragHandle = styled.div`
  color: ${themeColor};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
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

const ModuleTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 100%;
`;

const ModuleDescription = styled.div`
  font-size: 12px;
  color: ${darkGrey};
`;

const ModuleActions = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  width: 235px;
`;

const SortableModules = SortableContainer(props => (
  <StyledModuleList>
    {props.modulesList.map((mod, i) => (
      <ModuleItem id={i} key={`module-${mod.title}-${mod.description}`} module={mod} index={i} {...props} />
    ))}
  </StyledModuleList>
));

const ManageModulesModalBody = props => {
  const [addState, toggleAddState] = useState(props.addState || false);

  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");

  const {
    destinationCurriculumSequence,
    handleAddModule,
    onCloseManageModule,
    addModuleToPlaylist,
    deleteModuleFromPlaylist,
    updateModuleInPlaylist,
    resequenceModules,
    handleApply
  } = props;

  const setEditModuleData = (title, description) => {
    setEditTitle(title);
    setEditDescription(description);
  };

  const clearPreviousAddData = () => {
    setAddTitle("");
    setAddDescription("");
  };
  const handleSort = prop => resequenceModules(prop);

  const applyHandler = () => {
    handleApply();
    onCloseManageModule();
  };

  const handleModuleSave = () => {
    if (addTitle.trim()) {
      const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
        x => x.title.trim().toLowerCase() === addTitle.trim().toLowerCase()
      );
      if (titleAlreadyExists) {
        message.error(`Module with title '${addTitle}' already exists. Please use another title`);
        return;
      }
      addModuleToPlaylist({ title: addTitle, description: addDescription });
      if (props.addState) {
        props.handleTestAdded(0);
        message.info(`${addTitle} module is created and added ${props.testAddedTitle} test to it`);
      }
      toggleAddState(false);
      clearPreviousAddData();
    } else {
      message.warning("Module name cannot be empty");
    }
  };

  const handleInputChange = (e, label) => {
    label === "title" ? setAddTitle(e.target.value) : setAddDescription(e.target.value);
  };

  const handleModuleUpdate = ({ id, editTitle, editDescription }) => {
    const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
      (x, ind) => x.title.trim().toLowerCase() === editTitle.trim().toLowerCase() && ind !== id
    );
    if (titleAlreadyExists) {
      message.error(`Module with title '${editTitle}' already exists. Please use another title`);
      return false;
    }
    updateModuleInPlaylist({ id, title: editTitle, description: editDescription });
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
        />
        {addState && (
          <>
            <AddNewModuleContainer>
              <QLabel>{modulesList.length + 1}.</QLabel>
              <div data-cy={`module-${modulesList.length + 1}`}>
                <Title>Module Name</Title>
                <Input
                  placeholder="Enter module name"
                  style={{ background: lightGreySecondary, width: "685px" }}
                  value={addTitle}
                  onChange={e => handleInputChange(e, "title")}
                />
                <Title>Description</Title>
                <Input.TextArea
                  placeholder="Enter module description"
                  value={addDescription}
                  style={{ background: lightGreySecondary, width: "685px" }}
                  onChange={e => handleInputChange(e, "description")}
                />
                <ThemeButton data-cy="manageModuleApply" key="submit" type="primary" onClick={handleModuleSave}>
                  <StyledSpan width={100} fSize={12}>
                    SAVE
                  </StyledSpan>
                </ThemeButton>
              </div>
            </AddNewModuleContainer>
          </>
        )}

        {
          <div style={{ marginLeft: "20px" }}>
            <ThemeButton key="submit" type="primary" data-cy="addModule" onClick={() => toggleAddState(true)}>
              <IconPlusCircle color={white} width={15} height={15} />
              <StyledSpan width={122} fSize={12} marginL={20}>
                ADD MODULE
              </StyledSpan>
            </ThemeButton>
          </div>
        }
      </ModalContent>
      <ModalFooter>
        <Button data-cy="manageModuleCancel" type="primary" ghost key="back" onClick={onCloseManageModule}>
          CANCEL
        </Button>
        <ThemeButton data-cy="done-module" key="submit" type="primary" onClick={applyHandler}>
          DONE
        </ThemeButton>
      </ModalFooter>
    </ModalContainer>
  );
};

ManageModulesModalBody.propTypes = {
  destinationCurriculumSequence: PropTypes.object.isRequired,
  addModuleToPlaylist: PropTypes.func.isRequired,
  handleAddModule: PropTypes.func.isRequired,
  newModule: PropTypes.object.isRequired
};

export default ManageModulesModalBody;

const Title = styled.div`
  font-weight: 400;
  margin: 4px 2px;
`;

const QLabel = styled.div`
  width: 40px;
  font-size: 18px;
  font-weight: 600;
`;

const AddNewModuleContainer = styled.div`
  background: ${white};
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  box-shadow: 0 0 15px 0 ${fadedGrey};
  margin-bottom: 20px;
`;

const StyledModuleList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  max-height: 900px;
  overflow: auto;
`;

const StyledSpan = styled.span`
  width: ${({ width }) => width}px;
  font-size: ${({ fSize }) => fSize}px;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 760px;
  background: ${greyish};
  .ant-input {
    margin-bottom: 10px;
  }
`;

const ModalHeader = styled.h3`
  font-size: 20px;
  font-weight: 600;
`;

const ModalContent = styled.div`
  padding-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  .ant-btn {
    font-size: 10px;
    font-weight: 600;
    min-width: 100px;
    padding-left: 70px;
    padding-right: 70px;
    margin-left: 5px;
    margin-right: 5px;
    @media only screen and (max-width: ${desktopWidth}) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`;
