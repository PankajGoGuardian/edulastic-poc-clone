import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconPhotoCamera } from "@edulastic/icons";
import { aws } from "@edulastic/constants";
import { Upload, Spin, message } from "antd";
import {
  themeColor,
  white,
  greyishDarker2,
  extraDesktopWidth,
  largeDesktopWidth,
  desktopWidth
} from "@edulastic/colors";
import { uploadToS3 } from "../../../src/utils/upload";
import { beforeUpload } from "@edulastic/common";
import { updateProfileImageAction } from "../../../../student/Login/ducks";

class Photo extends React.Component {
  state = {
    loading: false
  };

  handleChange = async info => {
    const { user, updateProfileImagePath } = this.props;
    try {
      this.setState({ loading: true });
      const { file } = info;
      if (!file.type.match(/image/g)) {
        message.error("Please upload files in image format");
        this.setState({ loading: false });
        return;
      } else if (!beforeUpload(file)) {
        return;
      }
      const imageUrl = await uploadToS3(file, `${aws.s3Folders.USER}`, `${user._id}`);
      updateProfileImagePath({
        data: {
          thumbnail: imageUrl,
          email: user.email,
          districtId: user.districtId
        },
        userId: user._id
      });
      this.setState({
        loading: false
      });
    } catch (e) {
      message.error("Unable to save thumbnail.");
      this.setState({
        loading: false
      });
      console.log(e);
    }
  };

  render() {
    const { height, windowWidth, imageUrl } = this.props;
    const uploadButton = (
      <Container>
        <Image alt="Profile">
          <Backdrop />
        </Image>
        <Camera>
          <IconPhotoCamera color={white} width={16} height={16} />
        </Camera>
      </Container>
    );

    const { loading } = this.state;

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
          <Container>
            <ImageContainer>
              {loading ? (
                <ImageLoading />
              ) : imageUrl ? (
                <Image imgUrl={imageUrl} height={height} windowWidth={windowWidth} />
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
  owner: PropTypes.bool,
  height: PropTypes.number,
  isEditable: PropTypes.bool,
  windowWidth: PropTypes.number.isRequired,
  onChangeField: PropTypes.func
};

Photo.defaultProps = {
  height: 165,
  onChangeField: () => null
};

export default connect(
  state => ({
    imageUrl: state.user.user.thumbnail
  }),
  { updateProfileImagePath: updateProfileImageAction }
)(Photo);

const Container = styled.div`
  height: 250px;
  width: 250px;
  position: relative;
  border-radius: 50%;
  background: #dddddd;

  @media (max-width: ${extraDesktopWidth}) {
    width: 180px;
    height: 180px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-width: 150px;
    max-height: 150px;
  }

  @media (max-width: ${desktopWidth}) {
    max-width: 150px;
    max-height: 150px;
  }
`;

const UploadWrapper = styled.div`
  margin: 10px;
  .ant-upload-select {
    min-width: 100%;
    border: none;
    padding: 0px !important;
    height: 250px;
  }

  @media (max-width: ${extraDesktopWidth}) {
    .ant-upload-select {
      height: 180px;
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    .ant-upload-select {
      height: 150px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    .ant-upload-select {
      height: 150px;
    }
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

const Image = styled.div`
  width: 100%;
  height: ${props => (props.windowWidth > 993 ? props.height + "px" : "100%")};
  border-radius: 50%;
  background: url(${props => (props.imgUrl ? props.imgUrl : props.src)});
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Backdrop = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const Camera = styled.div`
  background: ${themeColor};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  left: 20px;
  bottom: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 50%;
  @media (max-width: ${extraDesktopWidth}) {
    height: 180px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-height: 150px;
  }

  @media (max-width: ${desktopWidth}) {
    max-height: 150px;
  }
`;
