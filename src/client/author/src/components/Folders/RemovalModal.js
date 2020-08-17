import React, { useState } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { EduButton, notification } from "@edulastic/common";
import { toggleRemoveItemsFolderAction, removeItemsFromFolderAction } from "../../actions/folder";
import { getSelectedItems } from "../../selectors/folder";
import { ModalTitle, Modal } from "./styled";
import FolderList from "./FolderList";

const RemovalModal = ({ selectedItems, folderType, removeItems, closeModal }) => {
  const [selected, setFolderToAdd] = useState({});

  const handleCloseModal = () => {
    if (closeModal) {
      closeModal({
        items: [],
        isOpen: false
      });
    }
  };

  const handleRemoveItems = () => {
    if (isEmpty(selected)) {
      return notification({ type: "info", messageKey: "selectFolder" });
    }
    const itemsToRemove = selectedItems
      .filter(ite => !isEmpty(selected.content.filter(itemInFolder => itemInFolder._id === ite.itemId)))
      .map(x => x.itemId);

    if (isEmpty(itemsToRemove)) {
      return notification({ type: "info", msg: `Items don't exist in ${selected.folderName}` });
    }

    removeItems({ folderId: selected._id, folderName: selected.folderName, itemsToRemove, folderType });
  };

  return (
    <Modal
      centered
      visible
      title={<ModalTitle>{`Remove ${selectedItems.length} item(s) from…`}</ModalTitle>}
      onCancel={handleCloseModal}
      footer={[
        <EduButton isGhost data-cy="cancel" key="back" variant="create" onClick={handleCloseModal}>
          Cancel
        </EduButton>,
        <EduButton data-cy="submit" key="submit" color="primary" variant="create" onClick={handleRemoveItems}>
          Remove
        </EduButton>
      ]}
    >
      <FolderList folderId={selected?._id} selectFolder={setFolderToAdd} />
    </Modal>
  );
};

export default connect(
  state => ({
    selectedItems: getSelectedItems(state)
  }),
  {
    closeModal: toggleRemoveItemsFolderAction,
    removeItems: removeItemsFromFolderAction
  }
)(RemovalModal);
