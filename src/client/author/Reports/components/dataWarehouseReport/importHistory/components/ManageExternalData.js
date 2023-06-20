import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import { getManageExternalDataColumns } from '../utils'
import ConfirmationPopup from './Modal/ConfirmationPopup'
import Modal from './Modal'
import Table from './Table'
import { DATA_WAREHOUSE_MODAL_MODES } from '../../contants'

const ManageExternalData = ({
  uploadsStatusList = [],
  termsMap,
  uploadResponse,
  uploadProgress,
  uploading,
  uploadFile,
  deleteFile,
  handleUploadProgress,
  setCancelUpload,
  abortUpload,
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState({})
  const [editFile, setEditFile] = useState(null)

  const handleEditClick = (record) => {
    setShowEditModal(true)
    setSelectedRecord(record)
  }

  const handleDeleteClick = (record) => {
    setShowDeleteModal(true)
    setSelectedRecord(record)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setSelectedRecord({})
    setEditFile(null)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedRecord({})
  }

  const handleEditFileUpload = () => {
    const {
      _id,
      feedId,
      reportType,
      termId,
      testName,
      versionYear,
    } = selectedRecord
    uploadFile({
      file: editFile,
      reportType,
      handleUploadProgress,
      setCancelUpload,
      termId,
      testName,
      versionYear,
      feedId,
      _id,
    })
  }

  const handleDeleteFile = () => {
    const { feedId } = selectedRecord
    deleteFile({ feedId })
    setShowConfirmationPopup(false)
    closeDeleteModal()
  }

  const handleEditAbortUpload = () => {
    abortUpload()
    closeEditModal()
  }

  useEffect(() => {
    if (!isEmpty(uploadResponse)) {
      closeEditModal()
    }
  }, [uploadResponse])

  const columns = getManageExternalDataColumns(
    termsMap,
    handleEditClick,
    handleDeleteClick
  )

  return (
    <>
      <Modal
        isVisible={showEditModal}
        closeModal={closeEditModal}
        data={selectedRecord}
        file={editFile}
        setFile={setEditFile}
        handleFileUpload={handleEditFileUpload}
        handleAbortUpload={handleEditAbortUpload}
        termsMap={termsMap}
        uploading={uploading}
        uploadProgress={uploadProgress}
        mode={DATA_WAREHOUSE_MODAL_MODES.EDIT}
      />
      <Modal
        isVisible={showDeleteModal}
        closeModal={closeDeleteModal}
        setShowConfirmationPopup={setShowConfirmationPopup}
        data={selectedRecord}
        termsMap={termsMap}
        mode={DATA_WAREHOUSE_MODAL_MODES.DELETE}
      />
      <ConfirmationPopup
        handleDeleteFile={handleDeleteFile}
        isVisible={showConfirmationPopup}
        closeModal={() => {
          setShowConfirmationPopup(false)
        }}
      />
      <Table data={uploadsStatusList} columns={columns} />
    </>
  )
}

export default ManageExternalData
