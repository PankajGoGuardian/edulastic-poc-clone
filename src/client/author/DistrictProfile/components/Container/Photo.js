import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconPhotoCamera } from "@edulastic/icons";
import { aws } from "@edulastic/constants";
import { Upload, Spin } from "antd";
import { themeColorBlue, white, greyishDarker2, largeDesktopWidth } from "@edulastic/colors";
import { beforeUpload, notification } from "@edulastic/common";
import { uploadToS3 } from "../../../src/utils/upload";
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
        notification({ messageKey: "pleaseUploadFilesInImageFormat" });
        this.setState({ loading: false });
        return;
      }
      if (!beforeUpload(file)) {
        this.setState({ loading: false });
        return;
      }
      const imageUrl = await uploadToS3(file, `${aws.s3Folders.USER}`, `${user._id}`);
      updateProfileImagePath({
        data: {
          thumbnail: imageUrl,
          email: user.email,
          districtId: user?.districtIds?.[0]
        },
        userId: user._id
      });
      this.setState({
        loading: false
      });
    } catch (e) {
      notification({ messageKey: "unableTOsaveThumbnail" });
      this.setState({
        loading: false
      });
      console.log(e);
    }
  };

  render() {
    const { height, windowWidth, imageUrl, isProfile } = this.props;
    const uploadButton = (
      <Container>
        <Image alt="Profile">
          <Backdrop />
        </Image>
        <Camera className={isProfile && "profile-btn"}>
          {isProfile ? "CHANGE IMAGE" : <IconPhotoCamera color={white} width={16} height={16} />}
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
            <Camera className={isProfile && "profile-btn"}>
              {isProfile ? "CHANGE IMAGE" : <IconPhotoCamera color={white} width="20px" />}
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
  width: 200px;
  height: 200px;
  position: relative;
  border-radius: 50%;
  background: ${greyishDarker2};

  @media (max-width: ${largeDesktopWidth}) {
    width: 150px;
    height: 150px;
  }
`;

const UploadWrapper = styled.div`
  .ant-upload-select {
    width: 200px;
    height: 200px;
    border: none;
    padding: 0px !important;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 150px;
    height: 150px;
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
  height: ${props => (props.windowWidth > 993 ? `${props.height}px` : "100%")};
  border-radius: 50%;
  background: url(${props => (props.imgUrl ? props.imgUrl : props.src)});
  background-position: center center;
  background-size: cover;
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
  background: ${themeColorBlue};
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
  &.profile-btn {
    position: relative;
    margin: 40px auto 0px;
    width: 190px;
    left: 0;
    border-radius: 4px;
    height: 32px;
    background: white;
    border: 1px solid ${themeColorBlue};
    font-size: 10px;
    color: ${themeColorBlue};
    font-weight: 600;
    &:hover {
      background: ${themeColorBlue};
      color: white;
    }
  }
  @media (max-width: ${largeDesktopWidth}) {
    left: 5px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;

  @media (max-width: ${largeDesktopWidth}) {
    height: 150px;
  }
`;
