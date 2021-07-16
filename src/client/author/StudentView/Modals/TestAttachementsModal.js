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
  FilesViewContainer,
} from '../styled'
import FilesView from '../../../assessment/widgets/UploadFile/components/FilesView'

const TestAttachementsModal = ({
  showAttachmentsModal,
  toggleAttachmentsModal,
  attachmentsList,
  title,
  description,
  utaId,
  studentData,
  attachmentNameLabel = 'Attachment',
  attachmentIndexForPreview = 0,
  isQuestionLevel = false,
  hideDownloadAllButton = false,
}) => {
  const [isZipDownloading, setZipDownloading] = useState(false)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(
    attachmentIndexForPreview || 0
  )

  const footerProps = {
    isZipDownloading,
    handleZipDownload: () => {
      setZipDownloading(true)
      attachmentApi
        .downloadAllAttachments(utaId)
        .then((res) => {
          const url = res.data
          const shadowAnchor = document.createElement('a')
          const fileName = `${studentData.userName}-test-attachments.zip`
          const properties = {
            href: url,
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
    isQuestionLevel,
    hideDownloadAllButton,
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
      pb={!description ? '0px' : '5px'}
    >
      <Description>{description}</Description>

      <InputTitle>
        {attachmentNameLabel}
        {attachmentNameLabel === 'Attachment'
          ? ` (${currentAttachmentIndex + 1}/${attachmentsList.length})`
          : null}
      </InputTitle>
      <FilesViewContainer>
        <FilesView
          files={[attachmentsList[currentAttachmentIndex]]}
          cols={1}
          hideDelete
          disableLink
        />
      </FilesViewContainer>
      <AttachmentSlider
        currentAttachmentIndex={currentAttachmentIndex}
        setCurrentAttachmentIndex={setCurrentAttachmentIndex}
        attachmentsList={attachmentsList}
      />
    </StyledAttachmentModal>
  )
}

export default TestAttachementsModal
