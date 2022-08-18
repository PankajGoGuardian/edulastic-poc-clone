import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { IconPhotoCamera } from '@edulastic/icons'
import { aws } from '@edulastic/constants'
import { withWindowSizes, beforeUpload } from '@edulastic/common'
import { Upload } from 'antd'
import { white, themeColorBlue } from '@edulastic/colors'
import { uploadToS3 } from '../../../src/utils/upload'
import { uploadTestImageAction } from '../../../src/actions/uploadTestImage'

class Uploader extends React.Component {
  state = {}

  handleChange = async (info) => {
    try {
      const { file } = info
      if (!beforeUpload(file)) {
        return
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT)
      const { setThumbnailUrl } = this.props
      this.setState(
        {
          imageUrl,
        },
        () => setThumbnailUrl(imageUrl)
      )
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { windowWidth, url } = this.props
    const uploadButton = (
      <Container>
        <Image src={url} alt="Test" />
        <Camera>
          <IconPhotoCamera color={white} width={16} height={16} />
        </Camera>
      </Container>
    )

    const { imageUrl } = this.state

    const props = {
      beforeUpload: () => false,
      onChange: this.handleChange,
      showUploadList: false,
    }

    return (
      <UploadWrapper>
        <Upload {...props}>
          <Container>
            <ImageContainer data-cy="imageContainer">
              {imageUrl ? (
                <Image src={imageUrl} windowWidth={windowWidth} alt="test" />
              ) : (
                uploadButton
              )}
            </ImageContainer>
            <Camera>
              <IconPhotoCamera color={white} width="20px" />
            </Camera>
          </Container>
        </Upload>
      </UploadWrapper>
    )
  }
}

Uploader.propTypes = {
  url: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setThumbnailUrl: PropTypes.func.isRequired,
}

const enhance = compose(
  withWindowSizes,
  connect(null, { uploadTestImage: uploadTestImageAction })
)

export default enhance(Uploader)

const Container = styled.div`
  min-height: 207px;
  width: 100%;
  position: relative;
`

const UploadWrapper = styled.div`
  .ant-upload-select {
    min-width: 100%;
    border: none;
    padding: 0px !important;
    height: 104px;
  }

  .ant-upload {
    padding: 0 !important;
  }
`

const Image = styled.img`
  width: 100%;
  height: 207px;
  border-radius: 5px;
`

const Camera = styled.div`
  background: ${themeColorBlue};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 20px;
  bottom: -17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

const ImageContainer = styled.div`
  width: 100%;
  min-height: 207px;
  overflow: hidden;
  border-radius: 5px;
`
