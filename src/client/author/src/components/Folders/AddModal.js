import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { connect } from 'react-redux'
import { find, lowerCase } from 'lodash'
import { Input } from 'antd'
import { EduButton, CustomModalStyled, notification } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import {
  receiveRenameFolderAction,
  receiveCreateFolderAction,
  toggleMoveItemsFolderAction,
} from '../../actions/folder'
import {
  isOpenAddItemsModalSelector,
  getFoldersSelector,
} from '../../selectors/folder'
import { ModalTitle } from './styled'

const ExtendedInput = ({ value, onChange, visible, onKeyUp }) => {
  const renameInput = useRef()
  useLayoutEffect(() => {
    renameInput.current.select()
  }, [visible])

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <Input
      style={{ 'border-color': themeColor }}
      placeholder="Name this folder"
      value={value}
      onChange={handleChange}
      ref={renameInput}
      onKeyUp={onKeyUp}
    />
  )
}

const AddModal = ({
  folder,
  folders,
  folderType,
  closeModal,
  isOpenAddModal,
  closeMoveModal,
  renameFolder,
  createFolderRequest,
  isRename,
  visible = true,
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    if (!!folder?._id && isRename) {
      setIsEdit(true)
      setFolderName(folder?.folderName)
    } else {
      setIsEdit(false)
      setFolderName('')
    }
  }, [folder, isRename])

  const handleCloseModal = () => {
    if (isOpenAddModal) {
      closeMoveModal({
        items: [],
        isOpen: false,
      })
    }
    closeModal()
  }

  const handleAddClick = () => {
    const isExist = find(
      folders,
      (f) => lowerCase(f.folderName) === lowerCase(folderName)
    )
    if (isExist) {
      return notification({ messageKey: 'folderNameAlreadyUsed' })
    }

    if (isEdit && renameFolder) {
      renameFolder({ folderId: folder._id, folderName, folderType })
    } else if (createFolderRequest) {
      createFolderRequest({ folderName, folderType })
    }

    closeModal()
  }

  const handleCreateOnKeyPress = (e) => {
    if (e.keyCode === 13 && folderName?.length) {
      handleAddClick()
    }
  }

  if (!visible) {
    return null
  }

  return (
    <CustomModalStyled
      centered
      visible={visible}
      title={
        <ModalTitle>{isEdit ? 'Rename' : 'Create a New Folder'}</ModalTitle>
      }
      onCancel={handleCloseModal}
      footer={[
        <EduButton
          isGhost
          data-cy="cancel"
          key="back"
          variant="create"
          onClick={handleCloseModal}
        >
          Cancel
        </EduButton>,
        <EduButton
          data-cy="submit"
          key="submit"
          color="primary"
          variant="create"
          disabled={!folderName}
          onClick={handleAddClick}
        >
          {isEdit ? `Update Folder` : 'Create New Folder'}
        </EduButton>,
      ]}
    >
      {isOpenAddModal && <h4>No folders have been created.</h4>}
      <ExtendedInput
        value={folderName}
        onChange={setFolderName}
        visible={isEdit}
        onKeyUp={handleCreateOnKeyPress}
      />
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    folders: getFoldersSelector(state),
    isOpenAddModal: isOpenAddItemsModalSelector(state),
  }),
  {
    createFolderRequest: receiveCreateFolderAction,
    renameFolder: receiveRenameFolderAction,
    addMoveToFolderRequest: receiveCreateFolderAction,
    closeMoveModal: toggleMoveItemsFolderAction,
  }
)(AddModal)
