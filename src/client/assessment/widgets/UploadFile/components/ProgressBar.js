import React from 'react'
import styled from 'styled-components'
import { Progress } from 'antd'
import PropTypes from 'prop-types'
import { FlexContainer, FileIcon, formatFileSize } from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { greyThemeDark1, greyDarken } from '@edulastic/colors'

const Link = styled.a`
  color: ${greyThemeDark1};
`

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
      <FileIcon
        type={type}
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
            <FileSize>{formatFileSize(size)}</FileSize>
            {!hideDelete && (
              <CloseIcon
                data-cy="removeStudentAttachment"
                aria-label="Remove student attachement"
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
