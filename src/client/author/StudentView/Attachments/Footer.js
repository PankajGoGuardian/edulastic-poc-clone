import React from 'react'
import { AttachmentFooter, SingleDownloadButton } from '../styled'

const Footer = ({ downloadLink }) => {
  return (
    <AttachmentFooter>
      <SingleDownloadButton href={downloadLink} target="_blank" isGhost>
        Download this attachment
      </SingleDownloadButton>
    </AttachmentFooter>
  )
}

export default Footer
