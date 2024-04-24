import React from 'react'
import { Menu } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import { borderGrey4 } from '@edulastic/colors'
import {
  toggleMoveItemsFolderAction,
  toggleRemoveItemsFolderAction,
} from '../../../src/actions/folder'

const AddRemoveTest = ({
  testDetail,
  toggleAddItemModal,
  toggleRemovalModal,
}) => {
  const toggleMoveFolderModal = (event) => {
    if (toggleAddItemModal && !isEmpty(testDetail)) {
      toggleAddItemModal({
        items: [testDetail],
        isOpen: true,
      })
    }
    event.stopPropagation()
  }

  const openRemoveItemsFromFolderModal = (event) => {
    event.stopPropagation()
    if (toggleRemovalModal && !isEmpty(testDetail)) {
      toggleRemovalModal({
        items: [testDetail],
        isOpen: true,
      })
    }
    event.stopPropagation()
  }

  return (
    <MenuWrapper>
      <Menu.Item
        data-cy="add-to-folder"
        onClick={({ domEvent }) => toggleMoveFolderModal(domEvent)}
      >
        Add to Folder
      </Menu.Item>
      <Menu.Item
        data-cy="remove-from-folder"
        onClick={({ domEvent }) => openRemoveItemsFromFolderModal(domEvent)}
      >
        Remove from Folder
      </Menu.Item>
    </MenuWrapper>
  )
}

const enhance = compose(
  connect(null, {
    toggleRemovalModal: toggleRemoveItemsFolderAction,
    toggleAddItemModal: toggleMoveItemsFolderAction,
  })
)
export default enhance(AddRemoveTest)

const MenuWrapper = styled(Menu)`
  border: 1px solid ${borderGrey4};
  border-radius: 4px;
`
