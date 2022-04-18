import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { aws, roleuser } from '@edulastic/constants'
import { beforeUpload, notification } from '@edulastic/common'
import { IconPhotoCamera } from '@edulastic/icons'
import { white } from '@edulastic/colors'
import { message } from 'antd'
import { setImageUploadingStatusAction } from '../../ducks'

import {
  StyledUploadContainer,
  StyledUpload,
  StyledImg,
  Camera,
  ImageUploadButton,
} from './styled'

import { uploadToS3 } from '../../../src/utils/upload'
import { getUserRole } from '../../../src/selectors/user'

class ImageUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleRequired: false,
    }
  }

  handleChange = async (event) => {
    const file = event.target.files[0]
    if (!file.type.match(/image/g)) {
      notification({ messageKey: 'pleaseUploadFilesInImageFormat' })
      return
    }
    if (!beforeUpload(file)) {
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      notification({ messageKey: 'imageMustBeSmallerThan2mb' })
    } else {
      this.props.setUploadingStatus(true)
      const fileUri = await uploadToS3(file, aws.s3Folders.DEFAULT)
      this.setState({ file: fileUri, visibleRequired: false })
      const { keyName } = this.props
      this.props.updateImgUrl(fileUri, keyName)
      this.props.setUploadingStatus(false)
    }
  }

  clickFileOpen = () => {
    this.inputElement.click()
  }

  setRequiredStatus = () => {
    const { imgSrc, requiredStatus } = this.props
    if ((imgSrc == null || imgSrc.length == 0) && requiredStatus) {
      this.setState({ visibleRequired: true })
    }
  }

  render() {
    const {
      width,
      height,
      labelStr,
      imgSrc,
      keyName,
      isInputEnabled,
      role,
    } = this.props
    const isImageEmpty = !!(imgSrc == null || imgSrc.length == 0)
    const isDA = role === roleuser.DISTRICT_ADMIN
    return (
      <>
        <StyledUploadContainer keyName={keyName}>
          <StyledUpload
            isVisible={isImageEmpty}
            onClick={this.clickFileOpen}
            width={width}
            height={height}
            keyName={keyName}
          >
            <input
              ref={(input) => (this.inputElement = input)}
              type="file"
              disabled={!isInputEnabled} // edit state
              onChange={this.handleChange}
              onClick={(e) => {
                e.target.value = null
              }}
              accept=".jpg, .png"
            />
            <StyledImg src={imgSrc} />
          </StyledUpload>
        </StyledUploadContainer>
        {keyName === 'pageBackground' && isInputEnabled ? (
          <Camera onClick={this.clickFileOpen}>
            <IconPhotoCamera color={white} width="20px" />
          </Camera>
        ) : isInputEnabled ? (
          <ImageUploadButton type="primary" onClick={this.clickFileOpen}>
            {isDA ? `Change District ${labelStr}` : `Change School ${labelStr}`}
          </ImageUploadButton>
        ) : null}
      </>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      role: getUserRole(state),
    }),
    {
      setUploadingStatus: setImageUploadingStatusAction,
    },
    null,
    { withRef: true }
  )
)
export default enhance(ImageUpload)
