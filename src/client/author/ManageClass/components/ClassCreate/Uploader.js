import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { IconPhotoCamera } from "@edulastic/icons";
import { Upload, message } from "antd";
import { white } from "@edulastic/colors";
import { API_CONFIG } from "@edulastic/api";

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

class Uploader extends React.Component {
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
    const { height, windowWidth, defaultImage } = this.props;

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
        authorization: localStorage.getItem("access_token")
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

Uploader.propTypes = {
  defaultImage: PropTypes.string,
  height: PropTypes.number,
  windowWidth: PropTypes.number,
  uploadTestImage: PropTypes.func.isRequired
};

Uploader.defaultProps = {
  defaultImage: "",
  height: 150,
  windowWidth: 800
};

export default Uploader;

const Container = styled.div`
  height: ${props => props.height}px;
  width: 100%;
  position: relative;
`;

const UploadWrapper = styled.div`
  .ant-upload-select {
    min-width: 100%;
    border: none;
    height: 104px;
    margin: 0px;
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
  background: #00000040;
  width: 100%;
  height: 40px;
  position: absolute;
  right: 0px;
  bottom: 0px;
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
