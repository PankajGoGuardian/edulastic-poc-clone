import React, { useState } from 'react'
import { Modal } from 'antd'
import { EduElse, EduIf, EduThen, Stimulus } from '@edulastic/common'
import { StyledViewButton } from './styled-components'

const Notes = ({ comment }) => {
  const [showNotesModal, setShowNotesModal] = useState(false)

  return (
    <>
      <Modal
        visible={showNotesModal}
        title="Notes"
        onCancel={() => setShowNotesModal(false)}
        onOk={() => setShowNotesModal(false)}
        width="70%"
        destroyOnClose
        footer={null}
        closable
        maskClosable
        centered
      >
        <Stimulus dangerouslySetInnerHTML={{ __html: comment }} />
      </Modal>
      <EduIf condition={comment?.length > 0}>
        <EduThen>
          <StyledViewButton onClick={() => setShowNotesModal(true)}>
            VIEW
          </StyledViewButton>
        </EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </>
  )
}

export default Notes
