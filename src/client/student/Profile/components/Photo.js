import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconPhotoCamera } from "@edulastic/icons";
import { aws } from "@edulastic/constants";
import { Upload, Spin } from "antd";
import { themeColor, white, greyishDarker2, largeDesktopWidth } from "@edulastic/colors";
import { beforeUpload,notification } from "@edulastic/common";
import { uploadToS3 } from "../../../author/src/utils/upload";
import ProfileImage from "../../assets/Profile.png";
import { updateProfileImageAction } from "../../Login/ducks";

const defaultImage = ProfileImage;

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
        notification({ messageKey:"pleaseUploadFileInImageFormat"});
        this.setState({ loading: false });
        return;
      } if (!beforeUpload(file)) {
        this.setState({ loading: false });
        return;
      }
      const imageUrl = await uploadToS3(file, `${aws.s3Folders.USER}`, `${user._id}`);
      // for student to updated profile image any one districtId is fine to pass
      // any district id will be enough to find the user
      updateProfileImagePath({
        data: {
          thumbnail: imageUrl,
          email: user.email,
          districtId: user.districtIds?.[0]
        },
        userId: user._id
      });
      this.setState({
        loading: false
      });
    } catch (e) {
      notification({ messageKey:"unableTOsaveThumbnail"});
      this.setState({
        loading: false
      });
      console.log(e);
    }
  };

  render() {
    const { height = 250, windowWidth = 250, imageUrl, mode = "" } = this.props;
    const uploadButton = (
      <Container height={height} width={windowWidth}>
        <Image alt="Profile">
          <Backdrop />
        </Image>
        <Camera mode={mode}>
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
      <UploadWrapper height={height}>
        <Upload {...props}>
          <Container height={height} width={windowWidth}>
            <ImageContainer height={height}>
              {loading ? (
                <ImageLoading />
              ) : imageUrl ? (
                <Image imgUrl={imageUrl} height={height} windowWidth={windowWidth} />
              ) : (
                uploadButton
              )}
            </ImageContainer>
            <Camera mode={mode}>
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
  owner: PropTypes.bool,
  height: PropTypes.number,
  isEditable: PropTypes.bool,
  windowWidth: PropTypes.number.isRequired,
  onChangeField: PropTypes.func
};

Photo.defaultProps = {
  url: defaultImage,
  height: 165,
  onChangeField: () => null
};

export default connect(
  state => ({
    user: state.user.user,
    imageUrl: state.user.user.thumbnail
  }),
  { updateProfileImagePath: updateProfileImageAction }
)(Photo);

const Container = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
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
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border: none;
    padding: 0px !important;
  }
  .ant-upload {
    padding: 0 !important;
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
  height: ${props => (props.windowWidth > 993 ? `${props.height  }px` : "100%")};
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
  ${props =>
    props.mode == "small"
      ? ` right: 0px;
    left: auto;
    bottom: 0px;`
      : ""}
  @media (max-width:${largeDesktopWidth}){
    left: 5px;
  }
  
`;

const ImageContainer = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  overflow: hidden;
  border-radius: 50%;

  @media (max-width: ${largeDesktopWidth}) {
    height: 150px;
  }
`;
