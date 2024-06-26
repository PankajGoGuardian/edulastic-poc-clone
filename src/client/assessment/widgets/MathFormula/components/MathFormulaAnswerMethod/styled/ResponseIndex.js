import styled from "styled-components";

export const ResponseIndex = styled.div`
  font-size: ${props => props.theme.widgetOptions.headingFontSize};
  font-weight: ${props => props.theme.widgetOptions.headingFontWeight};
  font-style: ${props => props.theme.widgetOptions.headingFontStyle};
  font-stretch: ${props => props.theme.widgetOptions.headingFontStretch};
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.headingColor};
  margin-bottom: 20px;
`;
