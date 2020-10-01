import React from 'react'
import { connect } from 'react-redux'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { receiveDeleteFolderAction } from '../../actions/folder'

const ConfirmDeleteFolder = ({
  folder,
  folderType,
  closeModal,
  deleteFolder,
}) => {
  const handleProceed = () => {
    if (deleteFolder) {
      deleteFolder({ folderId: folder._id, delFolderName: folder.folderName })
    }
    closeModal()
  }

  let conentName = 'tests'
  if (folderType === 'ITEM') {
    conentName = 'items'
  }

  return (
    <CustomModalStyled
      visible
      title="Delete Folder"
      onCancel={closeModal}
      footer={[
        <EduButton data-cy="cancel" isGhost key="back" onClick={closeModal}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="submit" key="submit" onClick={handleProceed}>
          PROCEED
        </EduButton>,
      ]}
    >
      <p style={{ textAlign: 'center' }}>
        {folder && (
          <>
            <b>{folder?.folderName}</b> will get deleted but all {conentName}{' '}
            will remain untouched. The {conentName} can still be accessed from{' '}
            {folderType === 'ASSIGNMENT' ? 'All Assignments' : 'Entire Library'}
            .
          </>
        )}
      </p>
    </CustomModalStyled>
  )
}

export default connect(null, {
  deleteFolder: receiveDeleteFolderAction,
})(ConfirmDeleteFolder)
