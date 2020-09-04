import React, { useState } from "react";
import { connect } from "react-redux";
import { EduButton, notification } from "@edulastic/common";
import { folderTypes } from "@edulastic/constants";
import { identity, pickBy, isEmpty } from "lodash";
import { getSelectedItems, getFoldersSelector } from "../../selectors/folder";
import { receiveAddMoveFolderAction, toggleMoveItemsFolderAction } from "../../actions/folder";
import { ModalTitle, Modal } from "./styled";
import FolderList from "./FolderList";

const MoveModal = ({
  folderType,
  selectedItems,
  addMoveToFolderRequest,
  removeItemFromCart,
  closeMoveModal,
  folders
}) => {
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
      let contentName = "assignment";
      if (folderType === folderTypes.TEST) {
        contentName = "test";
      } else if (folderType === folderTypes.ITEM) {
        contentName = "item";
      }
      const showAlreadyExistMsg =
        itemsExistInFolder.length > 1 || folderType === folderTypes.ITEM
          ? `${itemsExistInFolder.length} ${contentName}(s)`
          : itemsExistInFolder;

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

    const params = selectedItems
      .filter(item => !(content || []).find(c => c._id === item.itemId))
      .map(item => {
        const folder = folders.find(f => !!(f.content || []).find(c => c._id === item.itemId));
        const param = {
          _id: item.itemId,
          contentType: type,
          sourceFolderId: folder?._id,
          assignmentsNameList: itemsNotExistInFolder,
          folderName
        };
        return pickBy(param, identity);
      });

    addMoveToFolderRequest({ folderId: selected._id, params, folderType });

    selectedItems.forEach(item => {
      if (removeItemFromCart) {
        removeItemFromCart({ _id: item.itemId }, false);
      }
    });
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
    folders: getFoldersSelector(state),
    selectedItems: getSelectedItems(state)
  }),
  {
    addMoveToFolderRequest: receiveAddMoveFolderAction,
    closeMoveModal: toggleMoveItemsFolderAction
  }
)(MoveModal);
