import styled from "styled-components";

export const PointsText = styled.div`
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  text-transform: uppercase;
  margin-bottom: 8px;
`;
