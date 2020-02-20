import React from "react";
import styled from "styled-components";
import {
  mediumDesktopExactWidth,
  smallDesktopWidth,
  white,
  themeColor,
  greyThemeDark1
} from "@edulastic/colors";
import { IconQuestion } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";

const WidgetTitle = styled.h2`
  background: #f1f1f5;
  color: ${greyThemeDark1};
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin: ${props => props.margin || "0px -20px 20px"};
  font-weight: bold;
  min-height: 50px;
`;

export const SubtitleText = styled.div`
  font-size: ${({ fontSize, theme }) => fontSize || theme.common.subtitleFontSize};
  font-weight: ${props => props.theme.common.subtitleFontWeight};
  font-style: ${props => props.theme.common.subtitleFontStyle};
  font-stretch: ${props => props.theme.common.subtitleFontStretch};
  line-height: 1.36;
  letter-spacing: 0;
  text-align: left;
  color: ${({ color, theme }) => color || theme.common.subtitleColor};
  padding: 0;
  ${({ styles }) => styles};

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${({ theme }) => theme?.common?.titleSecondarySectionFontSize || "18px"};
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${({ theme }) => theme?.common?.titleSectionFontSize || "16px"};
  }
`;

const IconStyle = {
  fill: white,
  width: "16px",
  height: "16px",
  background: themeColor,
  borderRadius: "50%",
  padding: "3px",
  marginLeft: "16px"
};

export const QuestionIcon = ({ id = "", customStyle = {} }) =>
  id && !id.includes("undefined") ? (
    <FlexContainer id={id}>
      <IconQuestion style={{ ...IconStyle, ...customStyle }} />
    </FlexContainer>
  ) : null;

export const Subtitle = ({ id, children, textStyles = {}, showIcon = true, margin }) => (
  <WidgetTitle margin={margin} justifyContent="flex-start" alignItems="baseline">
    <SubtitleText styles={textStyles}>{children}</SubtitleText>
    {showIcon && <QuestionIcon id={id} />}
  </WidgetTitle>
);
