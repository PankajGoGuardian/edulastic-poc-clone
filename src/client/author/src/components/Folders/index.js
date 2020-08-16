import React, { Fragment, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { EduButton, CustomModalStyled, notification } from "@edulastic/common";
import { folderTypes } from "@edulastic/constants";
import { themeColor } from "@edulastic/colors";
import { IconMoreVertical, IconFolderDeactive, IconPencilEdit, IconFolders, IconPlusCircle } from "@edulastic/icons";
import { find, identity, lowerCase, orderBy, pickBy, isEmpty } from "lodash";
import { Dropdown, Icon, Input } from "antd";
import {
  clearFolderAction,
  receiveFolderAction,
  receiveAddMoveFolderAction,
  receiveCreateFolderAction,
  receiveDeleteFolderAction,
  receiveRenameFolderAction,
  setFolderAction,
  setItemsMoveFolderAction
} from "../../actions/folder";
import { getFolderSelector, getFoldersSelector, getSelectedItems, isOpenAddItemsModal } from "../../selectors/folder";
import {
  FoldersListWrapper,
  FolderListItem,
  FolderListItemTitle,
  AddFolderButton,
  CaretUp,
  DropMenu,
  MenuItems,
  MoreButton,
  ModalTitle,
  MoveFolderActionModal
} from "./styled";

const ExtendedInput = ({ value, onChange, visible, onKeyUp }) => {
  const renameInput = useRef();
  useLayoutEffect(() => {
    renameInput.current.select();
  }, [visible]);
  return (
    <Input
      style={{ "border-color": themeColor }}
      placeholder="Name this folder"
      value={value}
      onChange={onChange}
      ref={renameInput}
      onKeyUp={onKeyUp}
    />
  );
};
class Folders extends React.Component {
  state = { visibleModal: {}, folderName: "", selectedFolder: null, moveFolderId: "" };

  componentDidMount() {
    const { loadFolders, folderType } = this.props;
    if (loadFolders) {
      loadFolders(folderType);
    }
  }

  componentWillUnmount() {
    const { clearFolder } = this.props;
    clearFolder();
  }

  showModal = modalName => {
    const { visibleModal } = this.state;
    this.setState({
      visibleModal: {
        ...visibleModal,
        [modalName]: true
      }
    });
  };

  hideModal = (name, callback) => {
    const { clearSelectedItems } = this.props;
    const { visibleModal } = this.state;
    this.setState(
      () => ({
        visibleModal: {
          ...visibleModal,
          [name]: false
        },
        folderName: "",
        selectedFolder: null
      }),
      () => {
        if (callback) callback();
      }
    );
    clearSelectedItems([]);
  };

  showRenameModal = folderId => {
    this.setState({ selectedFolder: folderId }, () => this.showModal("newFolder"));
  };

  showDeleteConfirm = folderId => {
    this.setState({ selectedFolder: folderId }, () => this.showModal("delFolder"));
  };

  createUpdateFolder = () => {
    const { folders } = this.props;
    const { folderName, selectedFolder } = this.state;
    const isExist = find(folders, folder => lowerCase(folder.folderName) === lowerCase(folderName));

    if (isExist) {
      return notification({ messageKey: "folderNameAlreadyUsed" });
    }

    if (selectedFolder) {
      const { renameFolder } = this.props;
      if (renameFolder) {
        renameFolder({ folderId: selectedFolder, folderName });
      }
    } else {
      const { createFolderRequest, folderType } = this.props;
      if (createFolderRequest) {
        createFolderRequest({ folderName, folderType });
      }
    }
    this.setState({
      visibleModal: false,
      folderName: "",
      selectedFolder: ""
    });
  };

  deleteSelectedFolder = () => {
    const { folders, deleteFolder } = this.props;
    const { selectedFolder } = this.state;
    const delFolderName = folders.find(folder => selectedFolder === folder._id).folderName;
    if (deleteFolder) {
      deleteFolder({ folderId: selectedFolder, delFolderName });
    }
    this.setState({
      visibleModal: false,
      folderName: "",
      selectedFolder: ""
    });
  };

  handleMoveFolder = () => {
    const {
      selectedItems,
      addMoveToFolderRequest,
      folders,
      folderType,
      clearSelectedItems,
      isAdvancedView
    } = this.props;
    const { moveFolderId } = this.state;
    if (!moveFolderId) {
      notification({ type: "info", messageKey: "selectFolder" });
      return;
    }
    if (isEmpty(folders)) {
      return;
    }
    const { folderName, content } = folders.find(folder => folder._id === moveFolderId) || {};

    const itemsExistInFolder = [];
    const itemsNotExistInFolder = [];

    const currentFolderMap = content.reduce((p, v) => {
      p[v._id] = true;
      return p;
    }, {});
    selectedItems.forEach(item => {
      if (currentFolderMap[item.itemId]) {
        itemsExistInFolder.push(isAdvancedView ? item.title : item.name);
      } else {
        itemsNotExistInFolder.push(isAdvancedView ? item.title : item.name);
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
        sourceFolderId: folderTypes,
        assignmentsNameList: itemsNotExistInFolder,
        folderName
      };
      return pickBy(param, identity);
    });

    addMoveToFolderRequest({ folderId: moveFolderId, params });

    clearSelectedItems([]);

    this.setState({ moveFolderId: "" });
  };

  handleSelectFolder = async folder => {
    const { setFolder, clearFolder, onSelectFolder, isOpenAddModal } = this.props;

    if (isOpenAddModal) {
      const { _id } = folder;
      this.setState({ moveFolderId: _id });
    } else if (folder) {
      await setFolder(folder);
    } else {
      await clearFolder();
    }

    if (!isOpenAddModal && onSelectFolder) {
      onSelectFolder(folder?._id);
    }
  };

  handleCreateOnKeyPress = e => {
    const { folderName } = this.state;
    if (e.keyCode === 13 && folderName.length) {
      this.createUpdateFolder();
    }
  };

  handleChangeNewFolderName = e => this.setState({ folderName: e.target.value });

  renderFolders = ellipsis => {
    const {
      folders,
      hideLabel,
      isOpenAddModal,
      folderData: { _id: folderId }
    } = this.props;
    const { moveFolderId } = this.state;

    const menu = id => (
      <DropMenu>
        <CaretUp className="fa fa-caret-up" />
        <MenuItems data-cy="rename" key="1" onClick={() => this.showRenameModal(id)}>
          <IconPencilEdit width={12} height={12} />
          <span>Rename</span>
        </MenuItems>
        <MenuItems data-cy="delete" key="2" onClick={() => this.showDeleteConfirm(id)}>
          <Icon type="close" /> <span>Delete</span>
        </MenuItems>
      </DropMenu>
    );

    return (
      <>
        {!isOpenAddModal && !hideLabel && (
          <FolderListItem onClick={() => this.handleSelectFolder(null)} active={!folderId}>
            <FolderListItemTitle ellipsis={ellipsis} title="All Assignments">
              <IconFolderDeactive />
              <span>All Assignments</span>
            </FolderListItemTitle>
          </FolderListItem>
        )}
        {orderBy(folders, ["folderName"], ["asc"]).map((folder, index) => {
          const isActive = isOpenAddModal ? folder._id === moveFolderId : folder._id === folderId;
          return (
            <FolderListItem data-cy={folder.folderName} key={index} active={isActive}>
              <FolderListItemTitle
                ellipsis={ellipsis}
                title={folder.folderName}
                onClick={() => this.handleSelectFolder(folder)}
              >
                <IconFolderDeactive />
                <span>{folder.folderName}</span>
              </FolderListItemTitle>
              {!isOpenAddModal && (
                <Dropdown overlay={menu(folder._id)} trigger={["click"]} placement="bottomRight">
                  <MoreButton data-cy="moreButton" active={isActive}>
                    <IconMoreVertical />
                  </MoreButton>
                </Dropdown>
              )}
            </FolderListItem>
          );
        })}
      </>
    );
  };

  get addFolder() {
    return (
      <AddFolderButton onClick={() => this.showModal("newFolder")}>
        <IconPlusCircle />
      </AddFolderButton>
    );
  }

  render() {
    const { selectedItems, folders, clearSelectedItems, isOpenAddModal, hideLabel } = this.props;
    const { visibleModal, folderName, selectedFolder } = this.state;
    const oldFolderName = selectedFolder ? folders.find(folder => selectedFolder === folder._id).folderName : "";
    const isEmptyFolders = isEmpty(folders);
    const openCreateModal = visibleModal.newFolder || visibleModal.createFolder || (isOpenAddModal && isEmptyFolders);

    return (
      <Fragment>
        <CustomModalStyled
          centered
          title={
            !visibleModal.createFolder && <ModalTitle>{selectedFolder ? "Rename" : "Create a New Folder"}</ModalTitle>
          }
          visible={openCreateModal}
          onCancel={() => this.hideModal(visibleModal.createFolder ? "createFolder" : "newFolder")}
          footer={[
            <EduButton
              isGhost
              data-cy="cancel"
              key="back"
              variant="create"
              onClick={() => this.hideModal(visibleModal.createFolder ? "createFolder" : "newFolder")}
            >
              Cancel
            </EduButton>,
            <EduButton
              data-cy="submit"
              key="submit"
              color="primary"
              variant="create"
              disabled={!visibleModal.createFolder ? !folderName : ""}
              onClick={
                !visibleModal.createFolder
                  ? this.createUpdateFolder
                  : () => this.hideModal("createFolder", () => this.showModal("newFolder"))
              }
            >
              {visibleModal.createFolder ? "Create New Folder" : selectedFolder ? "Update" : "Create"}
            </EduButton>
          ]}
        >
          {visibleModal.createFolder ? (
            <h4>No folders have been created.</h4>
          ) : (
            <ExtendedInput
              value={folderName || oldFolderName}
              onChange={this.handleChangeNewFolderName}
              visible={visibleModal.newFolder}
              onKeyUp={this.handleCreateOnKeyPress}
            />
          )}
        </CustomModalStyled>
        <CustomModalStyled
          title="Delete Folder"
          visible={visibleModal.delFolder}
          onCancel={() => this.hideModal("delFolder")}
          footer={[
            <EduButton data-cy="cancel" isGhost key="back" onClick={() => this.hideModal("delFolder")}>
              CANCEL
            </EduButton>,
            <EduButton data-cy="submit" key="submit" onClick={this.deleteSelectedFolder}>
              PROCEED
            </EduButton>
          ]}
        >
          <p style={{ textAlign: "center" }}>
            {oldFolderName && (
              <>
                <b>{oldFolderName}</b> will get deleted but all tests will remain untouched. The tests can still be
                accessed from All Assignments.
              </>
            )}
          </p>
        </CustomModalStyled>

        <MoveFolderActionModal
          centered
          title={<ModalTitle>{`Move ${selectedItems.length} item(s) to…`}</ModalTitle>}
          visible={isOpenAddModal && !isEmptyFolders}
          onCancel={() => clearSelectedItems([])}
          footer={[
            <EduButton isGhost data-cy="cancel" key="back" variant="create" onClick={() => clearSelectedItems([])}>
              Cancel
            </EduButton>,
            <EduButton data-cy="submit" key="submit" color="primary" variant="create" onClick={this.handleMoveFolder}>
              Move
            </EduButton>
          ]}
        >
          <FoldersListWrapper>{this.renderFolders()}</FoldersListWrapper>
        </MoveFolderActionModal>
        {!hideLabel && (
          <FolderListItem data-cy="newFolder" leftBorder active>
            <FolderListItemTitle ellipsis title="Folders">
              <IconFolders color={themeColor} />
              FOLDERS
              <AddFolderButton onClick={() => this.showModal("newFolder")}>
                <IconPlusCircle />
              </AddFolderButton>
            </FolderListItemTitle>
          </FolderListItem>
        )}
        <FoldersListWrapper data-cy="folder-list">
          {hideLabel && (
            <AddFolderButton onClick={() => this.showModal("newFolder")} right="6px" top="-38px">
              <IconPlusCircle />
            </AddFolderButton>
          )}
          {this.renderFolders(true)}
        </FoldersListWrapper>
      </Fragment>
    );
  }
}

Folders.propTypes = {
  isAdvancedView: PropTypes.bool,
  onSelectFolder: PropTypes.func,
  folderType: PropTypes.string
};

Folders.defaultProps = {
  isAdvancedView: false,
  onSelectFolder: () => null,
  folderType: "ASSIGNMENT"
};

export default connect(
  state => ({
    folders: getFoldersSelector(state),
    folderData: getFolderSelector(state),
    selectedItems: getSelectedItems(state),
    isOpenAddModal: isOpenAddItemsModal(state)
  }),
  {
    createFolderRequest: receiveCreateFolderAction,
    addMoveToFolderRequest: receiveAddMoveFolderAction,
    deleteFolder: receiveDeleteFolderAction,
    renameFolder: receiveRenameFolderAction,
    loadFolders: receiveFolderAction,
    setFolder: setFolderAction,
    clearFolder: clearFolderAction,
    clearSelectedItems: setItemsMoveFolderAction
  }
)(Folders);
