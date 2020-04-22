import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { white } from "@edulastic/colors";
import {
  createNewModuleCSAction,
  updateModuleCSAction,
  deleteModuleCSAction,
  resequenceModulesCSAction,
  saveCurriculumSequenceAction
} from "../../../CurriculumSequence/ducks";
import ManageModulesModalBody from "../../components/modals/ManageModulesModalBody";

const ManageModulesModal = ({
  visible,
  onClose,
  destinationCurriculumSequence,
  addModuleToPlaylist,
  updateModuleInPlaylist,
  resequenceModules,
  onCloseCreateModule,
  moduleModalAdd,
  handleTestAdded,
  testAdded,
  deleteModuleFromPlaylist,
  updatePlaylist
}) => {
  const handleSave = () => {
    // need to save only when at-least a module present
    if (!destinationCurriculumSequence?.modules?.length) return;
    if (destinationCurriculumSequence._id) updatePlaylist({ isPlaylist: true });
  };

  return (
    <Modal
      open={visible}
      title="Manage Modules"
      onClose={onClose}
      footer={null}
      styles={{ modal: { minWidth: "900px", padding: "20px 30px", background: white } }}
    >
      <ManageModulesModalBody
        destinationCurriculumSequence={destinationCurriculumSequence}
        addModuleToPlaylist={addModuleToPlaylist}
        updateModuleInPlaylist={updateModuleInPlaylist}
        deleteModuleFromPlaylist={deleteModuleFromPlaylist}
        resequenceModules={resequenceModules}
        handleAddModule={onCloseCreateModule}
        handleApply={handleSave}
        onCloseManageModule={onClose}
        addState={moduleModalAdd}
        handleTestAdded={handleTestAdded}
        testAddedTitle={testAdded?.title}
      />
    </Modal>
  );
};

export default connect(
  state => ({
    destinationCurriculumSequence: state.curriculumSequence?.destinationCurriculumSequence
  }),
  {
    addModuleToPlaylist: createNewModuleCSAction,
    updateModuleInPlaylist: updateModuleCSAction,
    deleteModuleFromPlaylist: deleteModuleCSAction,
    resequenceModules: resequenceModulesCSAction,
    updatePlaylist: saveCurriculumSequenceAction
  }
)(ManageModulesModal);
