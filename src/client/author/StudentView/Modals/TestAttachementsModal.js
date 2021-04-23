import React, { useState } from 'react'
import { IconClose } from '@edulastic/icons'
import { attchmentApi as attachmentApi } from '@edulastic/api'
import AttachmentSlider from '../Attachments/AttachmentSlider'
import Footer from '../Attachments/Footer'
import {
  StyledAttachmentModal,
  InputTitle,
  Title,
  Description,
  ModalInput,
} from '../styled'

const TestAttachementsModal = ({
  showAttachmentsModal,
  toggleAttachmentsModal,
  attachmentsList,
  title,
  description,
  utaId,
  studentData,
}) => {
  const [isZipDownloading, setZipDownloading] = useState(false)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)

  const footerProps = {
    isZipDownloading,
    handleZipDownload: () => {
      setZipDownloading(true)
      attachmentApi
        .downloadAllAttachments(utaId)
        .then((res) => new Blob([res.data], { type: 'application/zip' }))
        .then((blob) => {
          const dynamicDownloadUrl = window.URL.createObjectURL(blob)
          const shadowAnchor = document.createElement('a')
          const fileName = `${studentData.userName}-test-attachments.zip`
          const properties = {
            href: dynamicDownloadUrl,
            target: '_blank',
            download: fileName,
          }
          Object.assign(shadowAnchor, properties)
          shadowAnchor.click()
        })
        .catch((e) =>
          console.warn('Error while downloading attachments zip...', e)
        )
        .finally(() => setZipDownloading(false))
    },
    downloadLink: attachmentsList[currentAttachmentIndex].source,
  }

  return (
    <StyledAttachmentModal
      visible={showAttachmentsModal}
      width={530}
      title={<Title>{title}</Title>}
      onOk={toggleAttachmentsModal}
      onCancel={toggleAttachmentsModal}
      footer={<Footer {...footerProps} />}
      closeIcon={<IconClose />}
    >
      <Description>{description}</Description>

      <InputTitle>Attachment Name</InputTitle>
      <ModalInput
        disabled
        value={attachmentsList[currentAttachmentIndex].name}
      />
      <AttachmentSlider
        currentAttachmentIndex={currentAttachmentIndex}
        setCurrentAttachmentIndex={setCurrentAttachmentIndex}
        attachmentsList={attachmentsList}
      />
    </StyledAttachmentModal>
  )
}

export default TestAttachementsModal
