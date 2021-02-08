import React from 'react'
import { CustomModalStyled } from '@edulastic/common'

const ManageLicensesModal = ({ isVisible, onCancel }) => {
  return (
    <CustomModalStyled
      visible={isVisible}
      title="Manage Licenses"
      onCancel={onCancel}
      centered
      footer={null}
    />
  )
}

export default ManageLicensesModal
