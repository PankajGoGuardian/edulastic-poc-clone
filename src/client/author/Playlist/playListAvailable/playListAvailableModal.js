import React from 'react'
import { CustomModalStyled } from '@edulastic/common'

const PlayListAvailableModal = ({ isVisible, closeModal }) => {
  return (
    <CustomModalStyled
      className="sparkMathModaltest"
      centered
      visible={isVisible}
      footer={null}
      onCancel={closeModal}
    >
      <div>playlistAvailableModal</div>
    </CustomModalStyled>
  )
}

export default PlayListAvailableModal
