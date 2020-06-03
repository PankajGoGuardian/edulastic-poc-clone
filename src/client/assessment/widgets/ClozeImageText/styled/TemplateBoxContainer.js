import styled from "styled-components";

export const TemplateBoxContainer = styled.div`
  display: flex;
  height: ${props => (props.smallSize ? "190px" : "100%")};
  margin: ${props => (props.smallSize ? "-30px -40px" : "0px")};
  flex-direction: ${({ flexDirection }) => (!flexDirection ? null : flexDirection)};
  zoom: ${props => props.theme.widgets.clozeImageText.imageZoom};
  ${({ hideInternalOverflow }) =>
    !hideInternalOverflow &&
    `
      max-width: 100%;
      overflow: auto;
      `}
`;
