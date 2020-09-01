import React from "react";
import { connect } from "react-redux";
import { CustomModalStyled, EduButton } from "@edulastic/common";
import { receiveDeleteFolderAction } from "../../actions/folder";

const ConfirmDeleteFolder = ({ folder, closeModal, deleteFolder }) => {
  const handleProceed = () => {
    if (deleteFolder) {
      deleteFolder({ folderId: folder._id, delFolderName: folder.folderName });
    }
    closeModal();
  };

  return (
    <CustomModalStyled
      visible
      title="Delete Folder"
      onCancel={closeModal}
      footer={[
        <EduButton data-cy="cancel" isGhost key="back" onClick={closeModal}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="submit" key="submit" onClick={handleProceed}>
          PROCEED
        </EduButton>
      ]}
    >
      <p style={{ textAlign: "center" }}>
        {folder && (
          <>
            <b>{folder?.folderName}</b> will get deleted but all tests will remain untouched. The tests can still be
            accessed from All Assignments.
          </>
        )}
      </p>
    </CustomModalStyled>
  );
};

export default connect(
  null,
  {
    deleteFolder: receiveDeleteFolderAction
  }
)(ConfirmDeleteFolder);
