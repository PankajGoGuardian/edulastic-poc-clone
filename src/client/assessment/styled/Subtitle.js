import React from "react";
import styled from "styled-components";
import { mediumDesktopExactWidth, greyThemeDark1, extraDesktopWidthMax } from "@edulastic/colors";
import { IconQuestion } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";

const WidgetTitle = styled.h2`
  color: ${greyThemeDark1};
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin: ${props => props.margin || "0px 0px 16px"};
  font-weight: bold;
  ${({ titleStyle }) => titleStyle};
`;

export const SubtitleText = styled.div`
  font-size: ${({ theme }) => theme?.common?.titleSectionFontSize || "16px"};
  font-weight: ${props => props.theme.common.subtitleFontWeight};
  font-style: ${props => props.theme.common.subtitleFontStyle};
  font-stretch: ${props => props.theme.common.subtitleFontStretch};
  line-height: 1.36;
  letter-spacing: 0;
  text-align: left;
  color: ${({ color, theme }) => color || theme.common.subtitleColor};
  padding: 0;
  ${({ styles }) => styles};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${({ theme }) => theme?.common?.titleSecondarySectionFontSize || "18px"};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${({ fontSize, theme }) => fontSize || theme.common.subtitleFontSize};
  }
`;

const IconStyle = {
  fill: "#fff",
  width: "16px",
  height: "16px",
  background: "#878A91",
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

export const Subtitle = ({ id, children, titleStyle = {}, textStyles = {}, showIcon = true, margin }) => (
  <WidgetTitle titleStyle={titleStyle} margin={margin} justifyContent="flex-start" alignItems="baseline">
    <SubtitleText styles={textStyles}>{children}</SubtitleText>
    {showIcon && <QuestionIcon id={id} />}
  </WidgetTitle>
);
