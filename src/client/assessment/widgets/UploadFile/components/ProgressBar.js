import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Progress } from 'antd'
import PropTypes from 'prop-types'
import { round } from 'lodash'
import { FlexContainer } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { greyThemeDark1, greyDarken } from '@edulastic/colors'

import CustomImage from './CustomImage'
import docIcon from '../icons/doc.svg'
import jpgIcon from '../icons/jpg.svg'
import gifIcon from '../icons/gif.svg'
import pdfIcon from '../icons/pdf.svg'
import pngIcon from '../icons/png.svg'
import xlsIcon from '../icons/xls.svg'
import htmlIcon from '../icons/html.svg'
import mp3Icon from '../icons/mp3.svg'
import mp4Icon from '../icons/mp4.svg'
import pptIcon from '../icons/ppt.svg'
import swfICon from '../icons/swf.svg'
import zipIcon from '../icons/zip.svg'
import {
  JPEG,
  PNG,
  GIF,
  DOC,
  DOCX,
  PDF,
  XLS,
  XLSX,
  HTML,
  MP3,
  MP4,
  PPT,
  PPTX,
  SWF,
  ZIP,
} from './constants'

const Link = styled.a`
  color: ${greyThemeDark1};
`

const getFileSize = (size) => {
  if (size < 1024) {
    return `${size} Byte`
  }
  if (size >= 1024 && size < 1024 * 1024) {
    return `${round(size / 1024, 2)} KB`
  }
  if (size >= 1024 * 1024) {
    return `${round(size / 1024 / 1024, 2)} MB`
  }
  return `${round(size / 1024 / 1024 / 1024, 2)} GB`
}

const ProgressBar = ({
  index,
  cols = 2,
  hidebar,
  hideDelete,
  data,
  onCancel,
  disableLink,
  openAttachmentViewModal = false,
}) => {
  if (!data) {
    return null
  }
  const { type, size, name, percent, source } = data

  const icon = useMemo(() => {
    switch (type) {
      case JPEG:
        return jpgIcon
      case PNG:
        return pngIcon
      case GIF:
        return pdfIcon
      case PDF:
        return gifIcon
      case DOC:
      case DOCX:
        return docIcon
      case XLS:
      case XLSX:
        return xlsIcon
      case HTML:
        return htmlIcon
      case MP3:
        return mp3Icon
      case MP4:
        return mp4Icon
      case PPT:
      case PPTX:
        return pptIcon
      case SWF:
        return swfICon
      case ZIP:
        return zipIcon
      default:
        break
    }
  }, [type])

  const handleCancel = () => {
    if (onCancel) {
      onCancel(index)
    }
  }

  const NameWrapper = Link
  const linkProps =
    hideDelete && !disableLink ? { href: source, target: '_blank' } : {}

  return (
    <FlexContainer
      data-cy="studentAttachment"
      marginBottom="20px"
      width={`calc(${100 / cols}% - 18px)`}
      marginLeft={index % cols !== 0 ? '18px' : null}
      justifyContent="space-between"
    >
      <CustomImage
        src={icon}
        role="presentation"
        onClick={() =>
          openAttachmentViewModal && openAttachmentViewModal(index)
        }
      />
      <FlexContainer
        marginLeft="16px"
        flexDirection="column"
        width="calc(100% - 40px)"
      >
        <FlexContainer justifyContent="space-between" alignItems="center">
          <FileName
            onClick={() =>
              openAttachmentViewModal && openAttachmentViewModal(index)
            }
          >
            <NameWrapper {...linkProps}>{name}</NameWrapper>
          </FileName>

          <FlexContainer alignItems="center">
            <FileSize>{getFileSize(size)}</FileSize>
            {!hideDelete && (
              <CloseIcon
                data-cy="removeStudentAttachment"
                onClick={handleCancel}
              />
            )}
          </FlexContainer>
        </FlexContainer>
        {!hidebar && (
          <ProgressBarWrapper>
            <Progress
              strokeColor="#1AB395"
              percent={percent}
              size="small"
              showInfo={false}
            />
          </ProgressBarWrapper>
        )}
      </FlexContainer>
    </FlexContainer>
  )
}

ProgressBar.propTypes = {
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  cols: PropTypes.number,
  hidebar: PropTypes.bool,
  hideDelete: PropTypes.bool,
}

ProgressBar.defaultProps = {
  cols: 2,
  onCancel: () => null,
  hidebar: false,
  hideDelete: false,
}

export default ProgressBar

const ProgressBarWrapper = styled.div`
  width: 100%;
`

const CloseIcon = styled(IconClose)`
  fill: ${greyThemeDark1};
  width: 10px;
  height: 10px;
  margin-left: 12px;
`

const FileName = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 600;
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${greyThemeDark1};
`

const FileSize = styled.div`
  color: ${greyDarken};
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
`
