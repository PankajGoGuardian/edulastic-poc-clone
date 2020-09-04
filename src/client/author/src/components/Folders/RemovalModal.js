import React, { useState } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { EduButton, notification } from "@edulastic/common";
import { folderTypes } from "@edulastic/constants";
import { toggleRemoveItemsFolderAction, removeItemsFromFolderAction } from "../../actions/folder";
import { getSelectedItems } from "../../selectors/folder";
import { ModalTitle, Modal } from "./styled";
import FolderList from "./FolderList";

const RemovalModal = ({ selectedItems, folderType, removeItems, closeModal, removeItemFromCart }) => {
  const [selected, setFolderToRemoveItems] = useState({});

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
      .map(x => ({ itemId: x.itemId, name: x.name }));

    if (isEmpty(itemsToRemove)) {
      let contentName = "assignment";
      if (folderType === folderTypes.TEST) {
        contentName = "test";
      } else if (folderType === folderTypes.ITEM) {
        contentName = "item";
      }

      const showNamesInMsg =
        selectedItems.length > 1 && folderType !== folderTypes.ITEM
          ? `${selectedItems.length} ${contentName}(s)`
          : folderType !== folderTypes.ITEM
          ? `${selectedItems[0].name}`
          : `${contentName}(s)`;

      const customMsg = `${showNamesInMsg} don't exist in ${selected.folderName}`;

      return notification({ type: "info", msg: customMsg });
    }

    removeItems({ folderId: selected._id, folderName: selected.folderName, itemsToRemove, folderType });

    itemsToRemove.forEach(itemId => {
      if (removeItemFromCart) {
        removeItemFromCart({ _id: itemId }, false);
      }
    });
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
      <FolderList folderId={selected?._id} selectFolder={setFolderToRemoveItems} />
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
