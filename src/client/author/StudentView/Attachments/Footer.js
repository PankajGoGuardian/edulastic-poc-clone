import { EduButton } from '@edulastic/common'
import React from 'react'
import { AttachmentFooter, SingleDownloadButton } from '../styled'

const Footer = ({
  downloadLink,
  isZipDownloading,
  handleZipDownload,
  isQuestionLevel = false,
}) => {
  return (
    <AttachmentFooter>
      <SingleDownloadButton
        data-cy="downloadSingleAttachmentButton"
        href={downloadLink}
        target="_blank"
        isGhost={!isQuestionLevel}
      >
        Download this attachment
      </SingleDownloadButton>
      {!isQuestionLevel && (
        <EduButton
          data-cy="downloadAllAttachmentsButton"
          loading={isZipDownloading}
          disabled={isZipDownloading}
          onClick={handleZipDownload}
        >
          Download All attachments
        </EduButton>
      )}
    </AttachmentFooter>
  )
}

export default Footer
