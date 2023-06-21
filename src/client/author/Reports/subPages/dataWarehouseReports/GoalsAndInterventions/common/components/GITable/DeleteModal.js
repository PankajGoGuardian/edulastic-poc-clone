import React from 'react'
import Modal from 'antd/lib/modal'
import { connect } from 'react-redux'
import { IconClose } from '@edulastic/icons'
import { actions } from '../../../ducks/actionReducers'
import { GROUP } from '../../../ducks/constants'

const DeleteModal = ({
  type,
  showModal,
  setShowModal,
  GIData,
  deleteGI,
  deleteGroup,
}) => {
  const handleConfirmGIDelete = () => {
    const { _id } = GIData
    setShowModal(false)
    if (type === GROUP) {
      deleteGroup({ id: _id })
    } else {
      deleteGI({ type, id: _id })
    }
  }

  return (
    <Modal
      className="delete-popup"
      title="Confirm"
      centered
      width={300}
      visible={showModal}
      closeIcon={<IconClose />}
      onOk={handleConfirmGIDelete}
      onCancel={() => setShowModal(false)}
      okText="DELETE"
      cancelText="CANCEL"
    >
      <p>Are you sure you’d like to delete this {type.toLowerCase()}?</p>
    </Modal>
  )
}

export default connect(null, {
  deleteGI: actions.deleteGI,
  deleteGroup: actions.deleteGroup,
})(DeleteModal)
