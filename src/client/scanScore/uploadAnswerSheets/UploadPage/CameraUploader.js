import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import {
  themeColor,
  greyThemeLight,
  title,
  dragDropUploadText,
  notStarted,
  white,
  cardBg,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { IconQRCode } from '@edulastic/icons'

const CameraUploader = ({ history }) => {
  const initCameraUpload = () =>
    history.push({
      pathname: '/uploadAnswerSheets/cameraScan',
      search: window.location.search,
    })

  return (
    <CameraUploaderWrapper>
      <IconWrapper>
        <IconQRCode />
      </IconWrapper>
      <Title>Start Using Camera</Title>
      <SubTitle>
        Scan bubble sheet responses using desktop/laptop camera
      </SubTitle>
      <EduButton width="180px" isGhost onClick={initCameraUpload}>
        START
      </EduButton>
    </CameraUploaderWrapper>
  )
}

export default withRouter(CameraUploader)

const CameraUploaderWrapper = styled.div`
  width: 450px;
  height: 500px;
  background: ${cardBg} 0% 0% no-repeat padding-box;
  border-radius: 6px;
  margin: 40px auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 120px 50px;
  border: 1px dashed ${greyThemeLight};

  &:hover {
    border: 1px dashed ${themeColor};
  }
`

const Title = styled.h3`
  text-align: center;
  font: normal normal bold 18px Open Sans;
  letter-spacing: -0.9px;
  color: ${title};
  opacity: 1;
  margin-bottom: -20px;
`

const SubTitle = styled.p`
  text-align: center;
  font: normal normal bold 13px Open Sans;
  letter-spacing: 0px;
  color: ${dragDropUploadText};
  opacity: 1;
  line-height: 20px;
`

const IconWrapper = styled.div`
  background: ${notStarted};
  padding: 16px 16px 10px 16px;
  border-radius: 100px;

  svg {
    width: 32px;
    height: 32px;
    fill: ${white};
  }
`
