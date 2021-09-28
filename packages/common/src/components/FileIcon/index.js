import React, { useMemo } from 'react'
import { fileTypes } from '@edulastic/constants'

import CustomImage from './CustomImage'
import docIcon from './icons/doc.svg'
import jpgIcon from './icons/jpg.svg'
import gifIcon from './icons/gif.svg'
import pdfIcon from './icons/pdf.svg'
import pngIcon from './icons/png.svg'
import xlsIcon from './icons/xls.svg'
import htmlIcon from './icons/html.svg'
import mp3Icon from './icons/mp3.svg'
import mp4Icon from './icons/mp4.svg'
import pptIcon from './icons/ppt.svg'
import swfICon from './icons/swf.svg'
import zipIcon from './icons/zip.svg'

const FileIcon = ({ type, onClick }) => {
  const icon = useMemo(() => {
    switch (type) {
      case fileTypes.JPEG:
      case fileTypes.JPG:
        return jpgIcon
      case fileTypes.PNG:
        return pngIcon
      case fileTypes.PDF:
        return pdfIcon
      case fileTypes.GIF:
        return gifIcon
      case fileTypes.DOC:
      case fileTypes.DOCX:
        return docIcon
      case fileTypes.XLS:
      case fileTypes.XLSX:
        return xlsIcon
      case fileTypes.HTML:
        return htmlIcon
      case fileTypes.MP3:
        return mp3Icon
      case fileTypes.MP4:
        return mp4Icon
      case fileTypes.PPT:
      case fileTypes.PPTX:
        return pptIcon
      case fileTypes.SWF:
        return swfICon
      case fileTypes.ZIP:
        return zipIcon
      default:
        break
    }
  }, [type])
  if (!icon) {
    return null
  }
  return <CustomImage src={icon} role="presentation" onClick={onClick} />
}

export default FileIcon
