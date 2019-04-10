import React, { Component } from "react";
import { StyledUploadContainer, StyledUpload, StyledP, StyledImg, StyledIcon, StyledPP, StyledInput } from "./styled";
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
    const { fileUri } = await fileApi.upload({ file });
    this.setState({ file: fileUri });
    const { keyName } = this.props;
    this.props.updateImgUrl(fileUri, keyName);
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
