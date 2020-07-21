import styled from "styled-components";

export const StyledDragHandle = styled.div`
  width: ${props => (props.smallSize ? 30 : 38)}px;
  display: flex;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;
