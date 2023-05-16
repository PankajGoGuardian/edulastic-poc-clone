import React from 'react'
import styled from 'styled-components'
import {
  mediumDesktopExactWidth,
  greyThemeDark1,
  themeColor,
  extraDesktopWidthMax,
  white,
} from '@edulastic/colors'
import { IconQuestion } from '@edulastic/icons'
import { FlexContainer, EduIf } from '@edulastic/common'

const WidgetTitle = styled.h2`
  color: ${greyThemeDark1};
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin: ${(props) => props.margin || '0px 0px 26px'};
  font-weight: bold;
  ${({ titleStyle }) => titleStyle};
`

export const SubtitleText = styled.div`
  font-size: ${({ theme }) => theme?.common?.titleSectionFontSize || '16px'};
  font-weight: ${(props) => props.theme.common.subtitleFontWeight};
  font-style: ${(props) => props.theme.common.subtitleFontStyle};
  font-stretch: ${(props) => props.theme.common.subtitleFontStretch};
  line-height: 1.36;
  letter-spacing: 0;
  text-align: left;
  color: ${({ color, theme }) => color || theme.common.subtitleColor};
  padding: 0;
  ${({ styles }) => styles};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${({ theme }) =>
      theme?.common?.titleSecondarySectionFontSize || '18px'};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${({ fontSize, theme }) =>
      fontSize || theme.common.subtitleFontSize};
  }
`

const StyledQuestionIcon = styled(IconQuestion)`
  fill: ${white};
  background: ${themeColor};
  border-radius: 50%;
  padding: 3px;
  opacity: 0.01;
  margin-left: 16px;
  &:hover {
    fill: ${white};
  }
`

export const QuestionIcon = ({ id = '', customStyle = {} }) => (
  <EduIf condition={id && !id.includes('undefined')}>
    <FlexContainer id={id}>
      <StyledQuestionIcon width={14} height={14} style={customStyle} />
    </FlexContainer>
  </EduIf>
)

export const Subtitle = ({
  id,
  children,
  titleStyle = {},
  textStyles = {},
  showIcon = true,
  margin,
}) => (
  <WidgetTitle
    titleStyle={titleStyle}
    margin={margin}
    justifyContent="flex-start"
    alignItems="baseline"
  >
    <SubtitleText styles={textStyles} data-cy="headingOnPreview">
      {children}
    </SubtitleText>
    <EduIf condition={!!showIcon}>
      <QuestionIcon id={id} />
    </EduIf>
  </WidgetTitle>
)
