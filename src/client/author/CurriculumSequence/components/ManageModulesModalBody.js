import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Input, message } from "antd";
import { desktopWidth, themeColor, white, lightGreySecondary, fadedGrey, darkGrey, greyish } from "@edulastic/colors";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { IconPlusCircle, IconTrash, IconSave } from "@edulastic/icons";
import { ThemeButton } from "../../src/components/common/ThemeButton";
import { FaBars } from "react-icons/fa";

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
    module: { title, mIndex, description } = {},
    id,
    updateModule,
    deleteModule,
    handleInputChange,
    data,
    setCurrentData,
    clearPreviousData
  } = props;
  const [editState, toggleEdit] = useState(false);

  const handleModuleEdit = () => {
    setCurrentData(title, description);
    toggleEdit(true);
  };

  const handleEdit = id => {
    updateModule(id);
    clearPreviousData();
    toggleEdit(false);
  };

  return editState ? (
    <>
      <EditModuleContainer>
        <QLabel>{mIndex || id + 1}.</QLabel>
        <div>
          <Title>Module Name</Title>
          <Input
            placeholder="Enter module name"
            value={data.title || title}
            onChange={e => handleInputChange(e, "title")}
            style={{ background: lightGreySecondary, width: "685px" }}
          />
          <Title>Description</Title>
          <Input.TextArea
            placeholder="Enter module description"
            value={data.description || description}
            onChange={e => handleInputChange(e, "description")}
            style={{ background: lightGreySecondary, width: "685px" }}
          />
          <ThemeButton data-cy="manageModuleApply" key="submit" type="primary" onClick={() => handleEdit(id)}>
            <IconSave color={white} width={15} height={15} />
            <StyledSpan width={100} fSize={12}>
              SAVE
            </StyledSpan>
          </ThemeButton>
        </div>
      </EditModuleContainer>
    </>
  ) : (
    <ModuleContainer>
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
          <StyledSpan width={80} fSize={12}>
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
  min-height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  box-shadow: 0 0 15px 0 ${fadedGrey};
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
    {props.modulesList.map((module, i) => (
      <ModuleItem id={i} module={module} index={i} {...props} />
    ))}
  </StyledModuleList>
));

const ManageModulesModalBody = props => {
  const [addState, toggleAddState] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  const setCurrentData = (title, description) => {
    setTitle(title);
    setDescription(description);
  };

  const clearPreviousData = () => {
    setTitle("");
    setDescription("");
  };

  const handleSort = prop => resequenceModules(prop);

  const applyHandler = () => {
    handleApply();
    onCloseManageModule();
  };

  const handleModuleSave = () => {
    if (title.trim()) {
      addModuleToPlaylist({ title, description });
      toggleAddState(false);
      clearPreviousData();
    } else {
      message.warning("Module name cannot be empty");
    }
  };

  const handleInputChange = (e, label) => {
    label === "title" ? setTitle(e.target.value) : setDescription(e.target.value);
  };

  const handleModuleUpdate = id => updateModuleInPlaylist({ id, title, description });

  const modulesList = [...destinationCurriculumSequence.modules];

  return (
    <ModalContainer>
      <ModalHeader>Manage Modules</ModalHeader>
      <ModalContent>
        <SortableModules
          setCurrentData={setCurrentData}
          modulesList={modulesList}
          deleteModule={deleteModuleFromPlaylist}
          updateModule={handleModuleUpdate}
          handleInputChange={handleInputChange}
          data={{ title, description }}
          clearPreviousData={clearPreviousData}
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
              <div>
                <Title>Module Name</Title>
                <Input
                  placeholder="Enter module name"
                  style={{ background: lightGreySecondary, width: "685px" }}
                  value={title}
                  onChange={e => handleInputChange(e, "title")}
                />
                <Title>Description</Title>
                <Input.TextArea
                  placeholder="Enter module description"
                  value={description}
                  style={{ background: lightGreySecondary, width: "685px" }}
                  onChange={e => handleInputChange(e, "description")}
                />
              </div>
            </AddNewModuleContainer>
            <br />
            <ThemeButton data-cy="manageModuleApply" key="submit" type="primary" onClick={handleModuleSave}>
              <IconSave color={white} width={15} height={15} />
              <StyledSpan width={100} fSize={12}>
                SAVE
              </StyledSpan>
            </ThemeButton>
          </>
        )}

        {!addState && (
          <ThemeButton key="submit" type="primary" onClick={() => toggleAddState(true)}>
            <IconPlusCircle color={white} width={15} height={15} />
            <StyledSpan width={140} fSize={12}>
              ADD MODULE
            </StyledSpan>
          </ThemeButton>
        )}
      </ModalContent>
      <ModalFooter>
        <Button data-cy="manageModuleCancel" type="primary" ghost key="back" onClick={onCloseManageModule}>
          CANCEL
        </Button>
        <ThemeButton data-cy="manageModuleApply" key="submit" type="primary" onClick={applyHandler}>
          APPLY
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
  padding-bottom: 10px;
  background: ${lightGreySecondary};
  .ant-input {
    margin-bottom: 10px;
  }
`;

const ModalHeader = styled.h3`
  font-size: 24px;
  font-weight: 600;
`;

const ModalContent = styled.div``;

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
