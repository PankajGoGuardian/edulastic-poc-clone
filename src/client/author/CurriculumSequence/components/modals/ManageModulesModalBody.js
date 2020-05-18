import React, { useState } from "react";
import PropTypes from "prop-types";
import { white } from "@edulastic/colors";
import { notification, FlexContainer } from "@edulastic/common";
import { IconPlusCircle } from "@edulastic/icons";
import ModuleList from "./components/ManageModulesModal/ModuleList";
import ModuleForm from "./components/ManageModulesModal/ModuleForm";

import { ModalContainer, ModalHeader, ModalContent, ModalFooter, StyledButton } from "./components/styled";

/*
 *
 * @TODO
 * 1. Seperate functional components to its respective files
 * 2. Seperate styled components to its respective files
 * 3. Remove unused props and slices of code
 */

const ManageModulesModalBody = props => {
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

  const [addState, toggleAddState] = useState(props?.addState || !destinationCurriculumSequence?.modules?.length);
  const handleSort = prop => resequenceModules(prop);

  const applyHandler = () => handleApply();

  const handleModuleSave = moduleData => {
    const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
      x => x.title.trim().toLowerCase() === moduleData.moduleName.trim().toLowerCase()
    );

    if (titleAlreadyExists) {
      return notification({
        msg: `Module with title '${moduleData.moduleName}' already exists. Please use another title`
      });
    }

    addModuleToPlaylist({
      title: moduleData.moduleName,
      description: moduleData.moduleDescription,
      moduleId: moduleData.moduleId,
      moduleGroupName: moduleData.moduleGroupName
    });
    if (props.addState) {
      handleTestAdded(0);
      notification({
        type: "info",
        msg: `${moduleData.moduleName} module is created and added ${props.testAddedTitle} test to it`
      });
    }

    toggleAddState(false);
  };

  const handleModuleCancel = () => toggleAddState(false);

  const handleModuleUpdate = (id, moduleData) => {
    const { moduleId, moduleName, moduleDescription, moduleGroupName } = moduleData;

    const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
      (x, ind) => x.title.trim().toLowerCase() === moduleName.trim().toLowerCase() && ind !== id
    );

    if (titleAlreadyExists) {
      notification({
        type: "warning",
        msg: `Module with title '${moduleName}' already exists. Please use another title`
      });
      return false;
    }

    updateModuleInPlaylist({
      id,
      moduleId,
      moduleGroupName,
      title: moduleName,
      description: moduleDescription
    });

    return true;
  };

  const modulesList = [...(destinationCurriculumSequence.modules || [])];

  return (
    <ModalContainer>
      <ModalHeader>Manage Modules</ModalHeader>
      <ModalContent>
        <ModuleList
          modulesList={modulesList}
          deleteModule={deleteModuleFromPlaylist}
          updateModule={handleModuleUpdate}
          onSortEnd={handleSort}
          lockAxis="y"
          lockOffset={["0%", "0%"]}
          lockToContainerEdges
          useDragHandle
        />

        {addState && (
          <ModuleForm onCancel={handleModuleCancel} onSave={handleModuleSave} moduleIndex={modulesList?.length} />
        )}
      </ModalContent>
      <ModalFooter>
        {!addState ? (
          <StyledButton data-cy="addModule" onClick={() => toggleAddState(true)} ml="0px">
            <IconPlusCircle color={white} width={15} height={15} />
            <span>ADD MODULE</span>
          </StyledButton>
        ) : (
          <div />
        )}
        <FlexContainer>
          <StyledButton isGhost data-cy="manageModuleCancel" onClick={onCloseManageModule}>
            CANCEL
          </StyledButton>
          <StyledButton data-cy="done-module" onClick={applyHandler}>
            DONE
          </StyledButton>
        </FlexContainer>
      </ModalFooter>
    </ModalContainer>
  );
};

ManageModulesModalBody.propTypes = {
  destinationCurriculumSequence: PropTypes.object.isRequired,
  addModuleToPlaylist: PropTypes.func.isRequired
};

export default ManageModulesModalBody;
