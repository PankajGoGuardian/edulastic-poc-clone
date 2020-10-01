import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { compose } from 'redux'
import { isEmpty } from 'lodash'
import { Menu, Dropdown } from 'antd'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import {
  EduButton,
  Label,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { themeColor, white, mainTextColor, title } from '@edulastic/colors'

import { getSelectedItemSelector } from '../../../TestPage/components/AddItems/ducks'
import {
  getUserRole,
  isPublisherUserSelector,
  getCollectionsToAddContent,
} from '../../../src/selectors/user'
import {
  toggleRemoveItemsFolderAction,
  toggleMoveItemsFolderAction,
} from '../../../src/actions/folder'
import { createTestFromCartAction } from '../../ducks'
import { getSelectedTestsSelector } from '../../../TestList/ducks'
import { setAddCollectionModalVisibleAction } from '../../../ContentBuckets/ducks'
import { getSelectedPlaylistSelector } from '../../../Playlist/ducks'

const Actions = ({
  selectedItems,
  selectedTests,
  selectedPlaylists,
  setAddCollectionModalVisible,
  toggleAddItemModal,
  toggleRemovalModal, // open a modal to remove items from a folder
  createTestFromCart,
  type,
  t,
  collectionsToWrite,
}) => {
  let numberOfSelectedItems = selectedItems?.length
  if (type === 'TEST') {
    numberOfSelectedItems = selectedTests?.length
  }
  if (type === 'PLAYLIST') {
    numberOfSelectedItems = selectedPlaylists?.length
  }

  // Keep this format as createTestFromCart is directly called in Menu item it will have a payload related to event
  const handleCreateTest = () => {
    if (!numberOfSelectedItems) {
      return notification({ messageKey: 'addItemsToCreateTest' })
    }
    createTestFromCart()
  }

  const getItemsToMoveOrRemoveFromFolder = () => {
    let itemsToAdd = []
    // question item does not have name or title,
    // so will pass item index for now
    if (type === 'TESTITEM') {
      itemsToAdd = selectedItems?.map((x, i) => ({
        itemId: x,
        name: `item ${i + 1}`,
      }))
    }
    if (type === 'TEST') {
      itemsToAdd = selectedTests?.map((x) => ({ itemId: x._id, name: x.title }))
    }
    return itemsToAdd
  }

  const toggleMoveFolderModal = () => {
    const itemsToAddFolder = getItemsToMoveOrRemoveFromFolder()
    if (toggleAddItemModal && !isEmpty(itemsToAddFolder)) {
      toggleAddItemModal({
        items: itemsToAddFolder,
        isOpen: true,
      })
    }
  }

  const openRemoveItemsFromFolderModal = () => {
    const itemsToRemoveFolder = getItemsToMoveOrRemoveFromFolder()
    if (toggleRemovalModal && !isEmpty(itemsToRemoveFolder)) {
      toggleRemovalModal({
        items: itemsToRemoveFolder,
        isOpen: true,
      })
    }
  }

  const menu = (
    <DropMenu>
      {!isEmpty(collectionsToWrite) && type === 'TESTITEM' && (
        <MenuItems onClick={handleCreateTest}>
          <span>Create a Test</span>
        </MenuItems>
      )}
      <MenuItems
        data-cy="add-to-folder"
        onClick={() => toggleMoveFolderModal()}
      >
        Add to Folder
      </MenuItems>
      <MenuItems
        data-cy="remove-from-folder"
        onClick={openRemoveItemsFromFolderModal}
      >
        Remove from Folder
      </MenuItems>
      {!isEmpty(collectionsToWrite) && (
        <MenuItems onClick={() => setAddCollectionModalVisible(true)}>
          <span>Add to Collection</span>
        </MenuItems>
      )}
      {!isEmpty(collectionsToWrite) && (
        <MenuItems>
          <span>Remove from Collection</span>
        </MenuItems>
      )}
    </DropMenu>
  )

  return (
    <FlexContainer>
      <Label style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
        <span>{numberOfSelectedItems || 0} </span>
        {t('component.item.itemCount')}
      </Label>
      <Dropdown overlay={menu} placement="bottomCenter">
        <EduButton
          data-cy="assignmentActions"
          height="30px"
          width="145px"
          isGhost
        >
          {t('component.item.actions')}
        </EduButton>
      </Dropdown>
    </FlexContainer>
  )
}

Actions.propTypes = {
  selectedItems: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  selectedItems: getSelectedItemSelector(state),
  userRole: getUserRole(state),
  isPublisherUser: isPublisherUserSelector(state),
  selectedTests: getSelectedTestsSelector(state),
  selectedPlaylists: getSelectedPlaylistSelector(state),
  collectionsToWrite: getCollectionsToAddContent(state),
})

const withConnect = connect(mapStateToProps, {
  setAddCollectionModalVisible: setAddCollectionModalVisibleAction,
  createTestFromCart: createTestFromCartAction,
  toggleRemovalModal: toggleRemoveItemsFolderAction,
  toggleAddItemModal: toggleMoveItemsFolderAction,
})

export default compose(withNamespaces('author'), withConnect)(Actions)

const DropMenu = styled(Menu)`
  width: 150px;
`

const MenuItems = styled(Menu.Item)`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${title};
  font-weight: 600;
  &:hover {
    svg {
      fill: ${white};
      path {
        fill: ${white};
        stroke: ${white};
      }
    }
  }
  svg,
  i {
    fill: ${mainTextColor};
    height: 12px;
    margin-right: 10px;
    path {
      fill: ${mainTextColor};
    }
  }
  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColor};
  }
`
