import React from 'react'
import PropTypes from 'prop-types'
import { Progress } from 'antd'
import { lightGreen11 } from '@edulastic/colors'
import { IconBlackUpload } from '@edulastic/icons'
import {
  StyledContainer,
  StyledUploadingContainer,
  StyledText,
} from '../styledComponents/AudioRecorder'
import useUploadProgress from '../hooks/useUploadProgress'

const UploadProgress = ({ i18translate }) => {
  const { uploadProgressPercent } = useUploadProgress()
  return (
    <StyledUploadingContainer>
      <StyledContainer>
        <IconBlackUpload />
      </StyledContainer>
      <StyledText isTextBlack>
        {i18translate('component.audioResponse.uploading')}
      </StyledText>
      <StyledContainer width="170px">
        <Progress
          percent={uploadProgressPercent}
          size="small"
          strokeColor={lightGreen11}
          showInfo={false}
        />
      </StyledContainer>
    </StyledUploadingContainer>
  )
}

UploadProgress.propTypes = {
  i18translate: PropTypes.func.isRequired,
}

UploadProgress.defaultProps = {}

export default UploadProgress
