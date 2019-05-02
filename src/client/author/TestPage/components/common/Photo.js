import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconPhotoCamera } from "@edulastic/icons";
import { Upload, message } from "antd";
import { blue, white } from "@edulastic/colors";
import { API_CONFIG } from "@edulastic/api";
import { uploadTestImageAction } from "../../../src/actions/uploadTestImage";
import { TokenStorage } from "@edulastic/api";

const defaultImage = "https://fakeimg.pl/1000x300/";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  if (!isJPG) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJPG && isLt2M;
}

class Photo extends React.Component {
  state = {};

  handleChange = info => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const { uploadTestImage } = this.props;
      getBase64(info.file.originFileObj, imageUrl => {
        uploadTestImage(info.file.response.result.fileUri);
        this.setState({
          imageUrl
        });
      });
    }
  };

  render() {
    const { height, windowWidth } = this.props;

    const uploadButton = (
      <Container height={height}>
        <Image src={defaultImage} alt="Test" />
        <Camera>
          <IconPhotoCamera color={white} width={16} height={16} />
        </Camera>
      </Container>
    );

    const { imageUrl } = this.state;
    const uploadProps = {
      name: "file",
      listType: "picture-card",
      className: "avatar-uploader",
      showUploadList: false,
      action: `${API_CONFIG.api}/file/upload`,
      onChange: this.handleChange,
      beforeUpload,
      headers: {
        "X-Requested-With": null,
        authorization: TokenStorage.getAccessToken()
      }
    };
    return (
      <UploadWrapper>
        <Upload {...uploadProps}>
          <Container height={height}>
            <ImageContainer height={height}>
              {imageUrl ? <Image src={imageUrl} windowWidth={windowWidth} alt="test" /> : uploadButton}
            </ImageContainer>
            <Camera>
              <IconPhotoCamera color={white} width="20px" />
            </Camera>
          </Container>
        </Upload>
      </UploadWrapper>
    );
  }
}

Photo.propTypes = {
  url: PropTypes.string,
  height: PropTypes.number,
  windowWidth: PropTypes.number.isRequired
};

Photo.defaultProps = {
  url: defaultImage,
  height: 240
};

export default connect(
  null,
  { uploadTestImage: uploadTestImageAction }
)(Photo);

const Container = styled.div`
  height: ${props => props.height}px;
  width: 100%;
  position: relative;
`;

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
`;

const Image = styled.img`
  width: 100%;
  height: ${props => (props.windowWidth > 993 ? "unset" : "100%")};
  border-radius: 5px;
`;

const Camera = styled.div`
  background: ${blue};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 40px;
  bottom: -20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  overflow: hidden;
  border-radius: 5px;
`;
