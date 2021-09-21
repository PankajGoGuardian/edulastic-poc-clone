import { fileTypes } from '@edulastic/constants'

export const MAX_SIZE = 1024 * 1024 // 1 MB per file

export const MAX_COUNT = 3 // 3 files per question

export const allowedFiles = [
  fileTypes.IMAGES,
  fileTypes.DOC,
  fileTypes.DOCX,
  fileTypes.PDF,
  fileTypes.XLS,
  fileTypes.XLSX,
  fileTypes.JPEG,
  fileTypes.PNG,
  fileTypes.GIF,
  fileTypes.HTML,
  fileTypes.MP3,
  fileTypes.MP4,
  fileTypes.PPT,
  fileTypes.PPTX,
  fileTypes.SWF,
  fileTypes.ZIP,
]
