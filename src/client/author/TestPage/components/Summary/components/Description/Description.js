import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ChromePicker } from "react-color";

import { MainTitle } from "../Sidebar/styled";
import { SummaryTextArea, SummaryDiv, ColorBox, SummaryButton } from "../../common/SummaryForm";
import { Col } from "antd";
import { ColorPickerContainer } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerContainer";
import { ColorPickerWrapper } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerWrapper";
import SummaryHeader from "../SummaryHeader/SummaryHeader";

const Description = ({
  windowWidth,
  description,
  createdBy,
  thumbnail,
  onChangeField,
  textColor,
  backgroundColor,
  onChangeColor,
  isPlaylist,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible
}) => (
  <Container windowWidth={windowWidth}>
    <SummaryHeader
      createdBy={createdBy}
      thumbnail={thumbnail}
      windowWidth={windowWidth}
      onChangeField={onChangeField}
    />
    {isPlaylist && (
      <Col span={windowWidth > 993 ? 12 : 24}>
        <MainTitle>Text Color</MainTitle>
        <SummaryDiv>
          <ColorBox data-cy="image-text-box-color-picker" background={textColor} />
          <SummaryButton onClick={() => onChangeColor("isTextColorPickerVisible", true)}>CHOOSE</SummaryButton>
          {isTextColorPickerVisible && (
            <ColorPickerContainer data-cy="image-text-box-color-panel">
              <ColorPickerWrapper onClick={() => onChangeColor("isTextColorPickerVisible", false)} />
              <ChromePicker color={textColor} onChangeComplete={color => onChangeColor("textColor", color.hex)} />
            </ColorPickerContainer>
          )}
        </SummaryDiv>
      </Col>
    )}
    {isPlaylist && (
      <Col span={windowWidth > 993 ? 12 : 24}>
        <MainTitle>Background Color</MainTitle>
        <SummaryDiv>
          <ColorBox data-cy="image-text-box-color-picker" background={backgroundColor} />
          <SummaryButton onClick={() => onChangeColor("isBackgroundColorPickerVisible", true)}>CHOOSE</SummaryButton>
          {isBackgroundColorPickerVisible && (
            <ColorPickerContainer data-cy="image-text-box-color-panel">
              <ColorPickerWrapper onClick={() => onChangeColor("isBackgroundColorPickerVisible", false)} />
              <ChromePicker
                color={backgroundColor}
                onChangeComplete={color => onChangeColor("backgroundColor", color.hex)}
              />
            </ColorPickerContainer>
          )}
        </SummaryDiv>
      </Col>
    )}
    <MainTitle>Description</MainTitle>
    <SummaryTextArea
      value={description}
      onChange={e => onChangeField("description", e.target.value)}
      size="large"
      placeholder="Enter a description"
      isplaylist={isPlaylist}
    />
  </Container>
);

Description.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  onChangeField: PropTypes.func.isRequired
};

export default Description;

const Container = styled.div`
  .ant-table-body {
    font-size: 13px;
    font-weight: 600;
  }
`;
