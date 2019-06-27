import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { uploadToS3 } from "../../../src/utils/upload";
import { aws } from "@edulastic/constants";
import { setImageUploadingStatusAction } from "../../ducks";

import {
  StyledUploadContainer,
  StyledUpload,
  StyledImg,
  StyledIcon,
  StyledChangeLog,
  StyledPRequired,
  StyledHoverDiv
} from "./styled";

import { message } from "antd";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRequired: false
    };
  }

  handleChange = async event => {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image must smaller then 2MB!");
    } else {
      this.props.setUploadingStatus(true);
      const fileUri = await uploadToS3(file, aws.s3Folders.DEFAULT);
      this.setState({ file: fileUri, visibleRequired: false });
      const { keyName } = this.props;
      this.props.updateImgUrl(fileUri, keyName);
      this.props.setUploadingStatus(false);
    }
  };

  clickFileOpen = () => {
    this.inputElement.click();
  };

  setRequiredStatus = () => {
    const { imgSrc } = this.props;
    if (imgSrc == null || imgSrc.length == 0) {
      this.setState({ visibleRequired: true });
    }
  };

  render() {
    const { visibleRequired } = this.state;
    const { width, height, labelStr, imgSrc } = this.props;
    const isImageEmpty = imgSrc == null || imgSrc.length == 0 ? true : false;

    return (
      <StyledUploadContainer>
        <StyledUpload isVisible={isImageEmpty} onClick={this.clickFileOpen} width={width} height={height}>
          <input
            ref={input => (this.inputElement = input)}
            type="file"
            onChange={this.handleChange}
            onClick={e => {
              e.target.value = null;
            }}
            accept=".jpg, .png"
          />
          <StyledImg src={imgSrc} />
          <StyledHoverDiv />
          <StyledIcon type="plus" />
        </StyledUpload>
        {visibleRequired ? (
          <StyledPRequired>Please select {labelStr}</StyledPRequired>
        ) : (
          <StyledChangeLog onClick={this.clickFileOpen}>Change District {labelStr}</StyledChangeLog>
        )}
      </StyledUploadContainer>
    );
  }
}

const enhance = compose(
  connect(
    state => ({}),
    {
      setUploadingStatus: setImageUploadingStatusAction
    }
  )
);
export default enhance(ImageUpload);
