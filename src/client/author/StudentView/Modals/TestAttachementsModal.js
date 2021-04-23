import React, { useState } from 'react'
import { Modal } from 'antd'
import { IconClose } from '@edulastic/icons'
import AttachmentSlider from '../Attachments/AttachmentSlider'
import Footer from '../Attachments/Footer'
import {
  Title,
  Description,
  ModalInput,
  AttachmentSliderContainer,
} from '../styled'

const TestAttachementsModal = ({
  showAttachmentsModal,
  toggleAttachmentsModal,
  attachmentsList,
  title,
  description,
}) => {
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)

  return (
    <Modal
      visible={showAttachmentsModal}
      width={550}
      title={<Title>{title}</Title>}
      onOk={toggleAttachmentsModal}
      onCancel={toggleAttachmentsModal}
      footer={null}
      closeIcon={<IconClose />}
    >
      <Description>{description}</Description>
      <ModalInput
        disabled
        value={attachmentsList[currentAttachmentIndex].name}
      />
      <AttachmentSliderContainer>
        <AttachmentSlider
          currentAttachmentIndex={currentAttachmentIndex}
          setCurrentAttachmentIndex={setCurrentAttachmentIndex}
          attachmentsList={attachmentsList}
        />
      </AttachmentSliderContainer>
      <Footer downloadLink={attachmentsList[currentAttachmentIndex].source} />
    </Modal>
  )
}

export default TestAttachementsModal
