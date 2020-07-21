import styled from "styled-components";

export const StyledDragHandle = styled.div`
  width: ${props => (props.smallSize ? 30 : 32)}px;
  flex: 1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;
