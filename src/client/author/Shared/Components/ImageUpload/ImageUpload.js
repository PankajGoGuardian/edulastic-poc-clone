import React, { Component } from "react";
import { StyledUploadContainer, StyledUpload, StyledP, StyledImg, StyledIcon, StyledPP } from "./styled";
import { message } from "antd";
import { fileApi } from "@edulastic/api";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.imgSrc
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image must smaller then 2MB!");
    } else {
      const { fileUri } = await fileApi.upload({ file });
      this.setState({ file: fileUri });
      const { keyName } = this.props;
      this.props.updateImgUrl(fileUri, keyName);
    }
  }

  clickFileOpen = () => {
    this.inputElement.click();
  };

  render() {
    const { width, height } = this.props;

    return (
      <StyledUploadContainer>
        <StyledUpload isVisible={this.state.file === null} onClick={this.clickFileOpen} width={width} height={height}>
          <StyledIcon type="plus" />
          <StyledP>Upload</StyledP>
          <input
            ref={input => (this.inputElement = input)}
            type="file"
            onChange={this.handleChange}
            accept=".jpg, .png"
          />
          <StyledImg src={this.state.file} />
        </StyledUpload>
        <StyledPP isVisible={this.state.file !== null} onClick={this.clickFileOpen}>
          Change District page background
        </StyledPP>
      </StyledUploadContainer>
    );
  }
}

export default ImageUpload;
