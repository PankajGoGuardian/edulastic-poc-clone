import styled from "styled-components";

export const TemplateBoxContainer = styled.div`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || null};
  height: ${props => (props.smallSize ? "190px" : "max-content")};
  margin: ${props => (props.smallSize ? "-30px -40px" : "0px")};
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
`;
