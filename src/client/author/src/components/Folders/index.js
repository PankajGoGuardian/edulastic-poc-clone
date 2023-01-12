import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { themeColor } from '@edulastic/colors'
import { IconFolders, IconPlusCircle } from '@edulastic/icons'
import { isEmpty } from 'lodash'
import {
  receiveFolderAction,
  setContentsUpdatedAction,
} from '../../actions/folder'
import {
  getFoldersSelector,
  isOpenAddItemsModalSelector,
  isOpenRemovalModalSelector,
  getUpdatedFolderSelector,
} from '../../selectors/folder'
import {
  FoldersListWrapper,
  FolderListItem,
  FolderListItemTitle,
  AddFolderButton,
} from './styled'
import FolderList from './FolderList'
import AddModal from './AddModal'
import RemovalModal from './RemovalModal'
import MoveModal from './MoveModal'
import ConfirmDelete from './ConfirmDelete'

const Folders = ({
  folders,
  folderType,
  showAllItems,
  isOpenAddModal,
  isOpenRemovalModal,
  updatedFolderId,
  isActive,
  loadFolders,
  onSelectFolder,
  setContentsUpdated,
  removeItemFromCart,
  selectedFolderId,
}) => {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [isOpenCreate, setIsOpenCreate] = useState(false)
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)
  const [isOpenRename, setIsOpenRename] = useState(false)

  useEffect(() => {
    const selectedFolderData = folders.find(
      ({ _id = '' }) => _id === selectedFolderId
    )
    setSelectedFolder(selectedFolderData)
  }, [selectedFolderId, folders])

  const showCreateModal = () => {
    setIsOpenCreate(true)
  }

  const showRenameModal = (folder) => {
    setSelectedFolder(folder)
    setIsOpenRename(true)
  }

  const hideCreateOrUpdateModal = () => {
    setIsOpenCreate(false)
    setIsOpenRename(false)
  }

  const showDeleteConfirm = (folder) => {
    setSelectedFolder(folder)
    setIsOpenConfirm(true)
  }

  const hideDeleteConfirm = () => {
    setIsOpenConfirm(false)
    setSelectedFolder(null)
  }

  const handleSelectFolder = (folder) => {
    if (folder) {
      setSelectedFolder(folder)
    } else {
      setSelectedFolder(null)
    }

    if (onSelectFolder) {
      onSelectFolder(folder?._id)
    }
  }

  useEffect(() => {
    loadFolders(folderType)
  }, [])

  useEffect(() => {
    if (!isActive) {
      setSelectedFolder(null)
    }
  }, [isActive])

  useEffect(() => {
    if (updatedFolderId) {
      if (
        isActive &&
        onSelectFolder &&
        selectedFolder?._id === updatedFolderId
      ) {
        onSelectFolder(updatedFolderId)
      }
      setContentsUpdated(null)
    }
  }, [updatedFolderId])

  const isEmptyFolders = isEmpty(folders)
  const openCreateModal = isOpenCreate || (isOpenAddModal && isEmptyFolders)

  return (
    <>
      {(openCreateModal || isOpenRename) && (
        <AddModal
          folder={selectedFolder}
          closeModal={hideCreateOrUpdateModal}
          folderType={folderType}
          isRename={isOpenRename}
        />
      )}
      {isOpenConfirm && (
        <ConfirmDelete
          folder={selectedFolder}
          closeModal={hideDeleteConfirm}
          folderType={folderType}
        />
      )}
      {isOpenAddModal && !isEmptyFolders && (
        <MoveModal
          folderType={folderType}
          removeItemFromCart={removeItemFromCart}
        />
      )}
      {isOpenRemovalModal && (
        <RemovalModal
          folderType={folderType}
          removeItemFromCart={removeItemFromCart}
        />
      )}

      {showAllItems && (
        <FolderListItem data-cy="FOLDERS" leftBorder active>
          <FolderListItemTitle ellipsis title="Folders">
            <IconFolders color={themeColor} />
            <span>FOLDERS</span>
            <AddFolderButton
              data-cy="addFolderButton"
              onClick={showCreateModal}
            >
              <IconPlusCircle />
            </AddFolderButton>
          </FolderListItemTitle>
        </FolderListItem>
      )}
      {isActive && (
        <FoldersListWrapper data-cy="folder-list">
          {!showAllItems && (
            <AddFolderButton
              data-cy="addFolderButton"
              onClick={showCreateModal}
              right="6px"
              top="-38px"
            >
              <IconPlusCircle aria-label="add new folder" />
            </AddFolderButton>
          )}
          <FolderList
            ellipsis
            showAllItems={showAllItems}
            folderId={selectedFolder?._id}
            selectFolder={handleSelectFolder}
            showRenameModal={showRenameModal}
            showDeleteConfirm={showDeleteConfirm}
          />
        </FoldersListWrapper>
      )}
    </>
  )
}

Folders.propTypes = {
  onSelectFolder: PropTypes.func,
  folderType: PropTypes.string,
  showAllItems: PropTypes.bool,
  isActive: PropTypes.bool,
}

Folders.defaultProps = {
  onSelectFolder: () => null,
  showAllItems: false,
  isActive: true,
  folderType: 'ASSIGNMENT',
}

export default connect(
  (state) => ({
    folders: getFoldersSelector(state),
    updatedFolderId: getUpdatedFolderSelector(state),
    isOpenAddModal: isOpenAddItemsModalSelector(state),
    isOpenRemovalModal: isOpenRemovalModalSelector(state),
  }),
  {
    loadFolders: receiveFolderAction,
    setContentsUpdated: setContentsUpdatedAction,
  }
)(Folders)
