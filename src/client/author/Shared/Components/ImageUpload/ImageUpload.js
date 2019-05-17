import React, { Component } from "react";
import { uploadToS3 } from "../../../src/utils/upload";
import { aws } from "@edulastic/constants";
import { StyledUploadContainer, StyledUpload, StyledImg, StyledIcon, StyledChangeLog, StyledPRequired } from "./styled";
import { message } from "antd";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRequired: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image must smaller then 2MB!");
    } else {
      const fileUri = await uploadToS3(file, aws.s3Folders.COURSE);
      this.setState({ file: fileUri, visibleRequired: false });
      const { keyName } = this.props;
      this.props.updateImgUrl(fileUri, keyName);
    }
  }

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
    const { visibleRequired, imgSrc } = this.state;
    const { width, height, labelStr } = this.props;

    return (
      <StyledUploadContainer>
        <StyledUpload isVisible={imgSrc === null} onClick={this.clickFileOpen} width={width} height={height}>
          <StyledIcon type="plus" />
          <input
            ref={input => (this.inputElement = input)}
            type="file"
            onChange={this.handleChange}
            accept=".jpg, .png"
          />
          <StyledImg src={this.props.imgSrc} />
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

export default ImageUpload;
