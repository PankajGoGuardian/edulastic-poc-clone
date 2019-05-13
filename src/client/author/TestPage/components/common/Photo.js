import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconPhotoCamera } from "@edulastic/icons";
import { aws } from "@edulastic/constants";
import { Upload, Spin, message } from "antd";
import { blue, white, greyishDarker2 } from "@edulastic/colors";
import { uploadToS3 } from "../../../src/utils/upload";
import { uploadTestImageAction } from "../../../src/actions/uploadTestImage";

const defaultImage = "https://fakeimg.pl/1000x300/";

class Photo extends React.Component {
  state = {
    loading: false
  };

  handleChange = async info => {
    try {
      this.setState({ loading: true });
      const { file } = info;
      if (!file.type.match(/image/g)) {
        message.error("Please upload files in image format");
        this.setState({ loading: false });
        return;
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.COURSE);
      const { onChangeField } = this.props;
      this.setState(
        {
          imageUrl,
          loading: false
        },
        () => onChangeField("thumbnail", imageUrl)
      );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { height, windowWidth, url } = this.props;

    const uploadButton = (
      <Container height={height}>
        <Image src={url || defaultImage} alt="Test" />
        <Camera>
          <IconPhotoCamera color={white} width={16} height={16} />
        </Camera>
      </Container>
    );

    const { imageUrl, loading } = this.state;

    const props = {
      beforeUpload: () => false,
      onChange: this.handleChange,
      accept: "image/*",
      multiple: false,
      showUploadList: false
    };

    return (
      <UploadWrapper>
        <Upload {...props}>
          <Container height={height}>
            <ImageContainer height={height}>
              {loading ? (
                <ImageLoading />
              ) : imageUrl ? (
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
    );
  }
}

Photo.propTypes = {
  url: PropTypes.string,
  height: PropTypes.number,
  windowWidth: PropTypes.number.isRequired,
  onChangeField: PropTypes.func
};

Photo.defaultProps = {
  url: defaultImage,
  height: 240,
  onChangeField: () => null
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

const ImageLoading = styled(Spin)`
  background: ${greyishDarker2};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
