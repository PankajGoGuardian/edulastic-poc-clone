import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  IconMoreVertical,
  IconFolderDeactive,
  IconPencilEdit,
} from '@edulastic/icons'
import { orderBy } from 'lodash'
import { Dropdown, Icon } from 'antd'
import {
  getFoldersSelector,
  getSelectedItems,
  isOpenAddItemsModalSelector,
  isOpenRemovalModalSelector,
} from '../../selectors/folder'
import {
  FolderListItem,
  FolderListItemTitle,
  CaretUp,
  DropMenu,
  MenuItems,
  MoreButton,
} from './styled'

const FolderList = ({
  folders,
  folderId,
  ellipsis,
  showAllItems,
  selectFolder,
  showRenameModal,
  showDeleteConfirm,
}) => {
  const menu = (folder) => (
    <DropMenu>
      <CaretUp className="fa fa-caret-up" />
      <MenuItems
        data-cy="rename"
        key="1"
        onClick={() => showRenameModal(folder)}
      >
        <IconPencilEdit width={12} height={12} />
        <span>Rename</span>
      </MenuItems>
      <MenuItems
        data-cy="delete"
        key="2"
        onClick={() => showDeleteConfirm(folder)}
      >
        <Icon type="close" /> <span>Delete</span>
      </MenuItems>
    </DropMenu>
  )

  return (
    <>
      {showAllItems && (
        <FolderListItem onClick={() => selectFolder(null)} active={!folderId}>
          <FolderListItemTitle ellipsis={ellipsis} title="All Assignments">
            <IconFolderDeactive />
            <span>All Assignments</span>
          </FolderListItemTitle>
        </FolderListItem>
      )}
      {orderBy(folders, ['folderName'], ['asc']).map((folder, index) => {
        const isActive = folder._id === folderId
        return (
          <FolderListItem
            data-cy={folder.folderName}
            key={index}
            active={isActive}
          >
            <FolderListItemTitle
              ellipsis={ellipsis}
              title={folder.folderName}
              onClick={() => selectFolder(folder)}
            >
              <IconFolderDeactive />
              <span>{folder.folderName}</span>
            </FolderListItemTitle>
            {ellipsis && (
              <Dropdown
                overlay={menu(folder)}
                trigger={['click']}
                placement="bottomRight"
              >
                <MoreButton data-cy="folder-option" active={isActive}>
                  <IconMoreVertical />
                </MoreButton>
              </Dropdown>
            )}
          </FolderListItem>
        )
      })}
    </>
  )
}

FolderList.propTypes = {
  showRenameModal: PropTypes.func,
  showDeleteConfirm: PropTypes.func,
  selectFolder: PropTypes.func,
  showAllItems: PropTypes.bool,
  folders: PropTypes.array,
  folderId: PropTypes.string,
  ellipsis: PropTypes.bool,
}

FolderList.defaultProps = {
  showRenameModal: () => null,
  showDeleteConfirm: () => null,
  selectFolder: () => null,
  showAllItems: false,
  folders: [],
  folderId: '',
  ellipsis: false,
}

export default connect(
  (state) => ({
    folders: getFoldersSelector(state),
    selectedItems: getSelectedItems(state),
    isOpenAddModal: isOpenAddItemsModalSelector(state),
    isOpenRemovalModal: isOpenRemovalModalSelector(state),
  }),
  {}
)(FolderList)
