import React from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import { FlexContainer, notification } from "@edulastic/common";
import ModuleForm from "./components/ManageModulesModal/ModuleForm";
import { ModalContainer, ModalHeader, ModalContent, ModalFooter, StyledButton } from "./components/styled";

import { createNewModuleCSAction, updateModuleCSAction, deleteModuleCSAction } from "../../ducks";
import {
  createNewModuleAction,
  updateModuleAction,
  deleteModuleAction,
  getPlaylistSelector
} from "../../../PlaylistPage/ducks";

const AddEditModuleModal = ({
  onClose,
  visible,
  addModuleToPlaylist,
  updateModuleInPlaylist,
  deleteModuleInPlaylist,
  handleSavePlaylist,
  destinationCurriculumSequence,
  moduleDate = {}
}) => {
  const { moduleIndexForEdit, moduleIndexForDelete, module } = moduleDate;
  const isEdit = !!module;
  const isDelete = moduleIndexForDelete !== undefined;

  let modalTitle = "Create a module";

  if (isEdit) {
    modalTitle = "Update Module";
  }

  if (isDelete) {
    modalTitle = "Delete Module";
  }

  const handleSaveModule = moduleData => {
    if (!isEdit) {
      const titleAlreadyExists = destinationCurriculumSequence?.modules?.find(
        x => x.title.trim().toLowerCase() === moduleData?.title.trim().toLowerCase()
      );

      if (titleAlreadyExists) {
        return notification({
          msg: `Module with title '${moduleData.title}' already exists. Please use another title`
        });
      }
    }

    if (isEdit) {
      updateModuleInPlaylist({
        id: moduleIndexForEdit,
        moduleId: moduleData.moduleId,
        moduleGroupName: moduleData.moduleGroupName,
        title: moduleData.title,
        description: moduleData.description
      });

      onClose();
    } else {
      addModuleToPlaylist({
        title: moduleData.title,
        description: moduleData.description,
        moduleId: moduleData.moduleId,
        moduleGroupName: moduleData.moduleGroupName
      });

      if (handleSavePlaylist && !destinationCurriculumSequence._id) {
        // will create playlist at first time.
        setTimeout(handleSavePlaylist, 10);
      }
    }
  };

  const deleteModule = () => {
    deleteModuleInPlaylist(moduleIndexForDelete);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title={null}
      footer={null}
      width={600}
      centered
      onCancel={onClose}
      wrapProps={{
        style: { overflow: "auto" }
      }}
    >
      <ModalContainer>
        <ModalHeader>{modalTitle}</ModalHeader>
        {!isDelete && <ModuleForm onCancel={onClose} onSave={handleSaveModule} module={module} isEdit={!!module} />}
        {isDelete && <ModalContent>Are you sure?</ModalContent>}
        {isDelete && (
          <ModalFooter>
            <FlexContainer justifyContent="flex-end" width="100%">
              <StyledButton isGhost data-cy="manageModuleCancel" onClick={onClose}>
                CANCEL
              </StyledButton>
              <StyledButton data-cy="done-module" onClick={deleteModule}>
                OK
              </StyledButton>
            </FlexContainer>
          </ModalFooter>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default connect(
  (state, { isPlaylist }) => ({
    destinationCurriculumSequence: isPlaylist
      ? getPlaylistSelector(state)
      : state.curriculumSequence?.destinationCurriculumSequence
  }),
  (dispatch, { isPlaylist }) => ({
    addModuleToPlaylist: module =>
      dispatch(isPlaylist ? createNewModuleAction(module) : createNewModuleCSAction(module)),
    updateModuleInPlaylist: module => dispatch(isPlaylist ? updateModuleAction(module) : updateModuleCSAction(module)),
    deleteModuleInPlaylist: moduleIndex =>
      dispatch(isPlaylist ? deleteModuleAction(moduleIndex) : deleteModuleCSAction(moduleIndex))
  })
)(AddEditModuleModal);
