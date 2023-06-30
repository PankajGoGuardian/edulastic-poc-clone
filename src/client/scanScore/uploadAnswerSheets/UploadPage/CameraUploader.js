import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Tag } from 'antd'

import {
  themeColor,
  greyThemeLight,
  title,
  dragDropUploadText,
  notStarted,
  white,
  cardBg,
  themeColorBlue,
} from '@edulastic/colors'
import { EduButton, notification } from '@edulastic/common'
import { IconQRCode } from '@edulastic/icons'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { selector } from '../ducks'

const CameraUploader = ({ history, hasNonMcq }) => {
  const initCameraUpload = () => {
    if (hasNonMcq) {
      notification({
        type: 'warn',
        msg:
          'The sheet contains non MCQ questions, please use PDF upload mode to scan',
        exact: true,
      })
      return
    }
    history.push({
      pathname: '/uploadAnswerSheets/cameraScan',
      search: window.location.search,
    })
  }

  return (
    <CameraUploaderWrapper>
      <IconWrapper>
        <IconQRCode />
      </IconWrapper>
      <Title>
        Scan Using Camera <StyledTag alignItems="left">BETA</StyledTag>
      </Title>
      <SubTitle>Scan bubble sheet forms using desktop/laptop camera</SubTitle>
      <EduButton
        data-cy="startCameraButton"
        width="180px"
        isGhost
        onClick={initCameraUpload}
      >
        START
      </EduButton>
    </CameraUploaderWrapper>
  )
}

const enhance = compose(
  withRouter,
  connect((state) => ({ ...selector(state) }), null)
)
export default enhance(CameraUploader)

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
const StyledTag = styled(Tag)`
  position: relative;
  top: -15px;
  border-color: ${themeColorBlue};
  color: ${themeColorBlue};
`
