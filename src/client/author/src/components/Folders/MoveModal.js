import React, { useState } from "react";
import { connect } from "react-redux";
import { EduButton, notification } from "@edulastic/common";
import { folderTypes } from "@edulastic/constants";
import { identity, pickBy, isEmpty } from "lodash";
import { getSelectedItems, getFolderSelector } from "../../selectors/folder";
import { receiveAddMoveFolderAction, toggleMoveItemsFolderAction } from "../../actions/folder";
import { ModalTitle, Modal } from "./styled";
import FolderList from "./FolderList";

const MoveModal = ({ folderType, selectedItems, addMoveToFolderRequest, closeMoveModal, folderData }) => {
  const [selected, setFolderToAdd] = useState({});

  const handleCancel = () => {
    if (closeMoveModal) {
      closeMoveModal({
        items: [],
        isOpen: false
      });
    }
  };

  const handleMoveFolder = () => {
    if (isEmpty(selected)) {
      return notification({ type: "info", messageKey: "selectFolder" });
    }
    const { folderName, content } = selected;

    const itemsExistInFolder = [];
    const itemsNotExistInFolder = [];

    const currentFolderMap = content.reduce((p, v) => {
      p[v._id] = true;
      return p;
    }, {});
    selectedItems.forEach(item => {
      if (currentFolderMap[item.itemId]) {
        itemsExistInFolder.push(item.name);
      } else {
        itemsNotExistInFolder.push(item.name);
      }
    });
    if (itemsExistInFolder && itemsExistInFolder.length > 0) {
      const showAlreadyExistMsg =
        itemsExistInFolder.length > 1 ? `${itemsExistInFolder.length} assignments` : itemsExistInFolder;
      notification({ type: "info", msg: `${showAlreadyExistMsg} already exist in ${folderName} folder` });
    }
    if (itemsNotExistInFolder.length === 0) {
      return;
    }

    /**
     * in assignment, we save the test ids.
     * so in case of folderType ASSIGNMENT,
     * contentType will be TEST
     */
    let type = folderType;
    if (type === folderTypes.ASSIGNMENT) {
      type = folderTypes.TEST;
    }

    const params = selectedItems.map(row => {
      const param = {
        _id: row.itemId,
        contentType: type,
        sourceFolderId: folderData?._id,
        assignmentsNameList: itemsNotExistInFolder,
        folderName
      };
      return pickBy(param, identity);
    });

    addMoveToFolderRequest({ folderId: selected._id, params });
  };

  return (
    <Modal
      centered
      visible
      title={<ModalTitle>{`Add ${selectedItems.length} item(s) to…`}</ModalTitle>}
      onCancel={handleCancel}
      footer={[
        <EduButton isGhost data-cy="cancel" key="back" variant="create" onClick={handleCancel}>
          Cancel
        </EduButton>,
        <EduButton data-cy="submit" key="submit" color="primary" variant="create" onClick={handleMoveFolder}>
          Move
        </EduButton>
      ]}
    >
      <FolderList folderId={selected?._id} selectFolder={setFolderToAdd} />
    </Modal>
  );
};

export default connect(
  state => ({
    folderData: getFolderSelector(state),
    selectedItems: getSelectedItems(state)
  }),
  {
    addMoveToFolderRequest: receiveAddMoveFolderAction,
    closeMoveModal: toggleMoveItemsFolderAction
  }
)(MoveModal);
