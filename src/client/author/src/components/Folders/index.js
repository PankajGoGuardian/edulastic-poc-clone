import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { themeColor } from "@edulastic/colors";
import { IconFolders, IconPlusCircle } from "@edulastic/icons";
import { isEmpty } from "lodash";
import { clearFolderAction, receiveFolderAction, setFolderAction } from "../../actions/folder";
import {
  getFolderSelector,
  getFoldersSelector,
  isOpenAddItemsModalSelector,
  isOpenRemovalModalSelector
} from "../../selectors/folder";
import { FoldersListWrapper, FolderListItem, FolderListItemTitle, AddFolderButton } from "./styled";
import FolderList from "./FolderList";
import AddModal from "./AddModal";
import RemovalModal from "./RemovalModal";
import MoveModal from "./MoveModal";
import ConfirmDelete from "./ConfirmDelete";

class Folders extends React.Component {
  state = { selectedFolder: null };

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

  showCreateModal = () => {
    this.setState({ isOpenCreateOrUpdateModal: true });
  };

  showRenameModal = folder => {
    this.setState({ selectedFolder: folder, isOpenCreateOrUpdateModal: true });
  };

  hideCreateOrUpdateModal = () => {
    this.setState({ isOpenCreateOrUpdateModal: false, selectedFolder: null });
  };

  showDeleteConfirm = folder => {
    this.setState({ selectedFolder: folder, isOpenConfirm: true });
  };

  hideDeleteConfirm = () => {
    this.setState({ selectedFolder: null, isOpenConfirm: false });
  };

  handleSelectFolder = folder => {
    const { setFolder, clearFolder, onSelectFolder } = this.props;
    if (folder) {
      setFolder(folder);
    } else {
      clearFolder();
    }

    if (onSelectFolder) {
      onSelectFolder(folder?._id);
    }
  };

  render() {
    const { folders, folderData, isOpenAddModal, isOpenRemovalModal, folderType, showAllItems } = this.props;
    const { selectedFolder, isOpenConfirm, isOpenCreateOrUpdateModal } = this.state;
    const isEmptyFolders = isEmpty(folders);
    const openCreateModal = isOpenCreateOrUpdateModal || (isOpenAddModal && isEmptyFolders);

    return (
      <Fragment>
        {openCreateModal && (
          <AddModal folder={selectedFolder} closeModal={this.hideCreateOrUpdateModal} folderType={folderType} />
        )}
        {isOpenConfirm && <ConfirmDelete folder={selectedFolder} closeModal={this.hideDeleteConfirm} />}
        {isOpenAddModal && !isEmptyFolders && <MoveModal folderType={folderType} />}
        {isOpenRemovalModal && <RemovalModal folderType={folderType} />}

        {showAllItems && (
          <FolderListItem data-cy="newFolder" leftBorder active>
            <FolderListItemTitle ellipsis title="Folders">
              <IconFolders color={themeColor} />
              FOLDERS
              <AddFolderButton onClick={this.showCreateModal}>
                <IconPlusCircle />
              </AddFolderButton>
            </FolderListItemTitle>
          </FolderListItem>
        )}
        <FoldersListWrapper data-cy="folder-list">
          {!showAllItems && (
            <AddFolderButton onClick={this.showCreateModal} right="6px" top="-38px">
              <IconPlusCircle />
            </AddFolderButton>
          )}
          <FolderList
            ellipsis
            showAllItems={showAllItems}
            folderId={folderData?._id}
            selectFolder={this.handleSelectFolder}
            showRenameModal={this.showRenameModal}
            showDeleteConfirm={this.showDeleteConfirm}
          />
        </FoldersListWrapper>
      </Fragment>
    );
  }
}

Folders.propTypes = {
  onSelectFolder: PropTypes.func,
  folderType: PropTypes.string,
  showAllItems: PropTypes.bool
};

Folders.defaultProps = {
  onSelectFolder: () => null,
  showAllItems: false,
  folderType: "ASSIGNMENT"
};

export default connect(
  state => ({
    folders: getFoldersSelector(state),
    folderData: getFolderSelector(state),
    isOpenAddModal: isOpenAddItemsModalSelector(state),
    isOpenRemovalModal: isOpenRemovalModalSelector(state)
  }),
  {
    loadFolders: receiveFolderAction,
    setFolder: setFolderAction,
    clearFolder: clearFolderAction
  }
)(Folders);
