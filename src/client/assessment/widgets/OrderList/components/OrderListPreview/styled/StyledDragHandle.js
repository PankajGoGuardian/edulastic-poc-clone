import styled from "styled-components";

export const StyledDragHandle = styled.div`
  width: ${props => (props.smallSize ? 30 : 50)}px;
  flex: 1;
  border-top: ${props =>
    props.styleType === "button" ? `1px solid ${props.theme.widgets.orderList.dragHandleBorderColor}` : "none"};
  border-bottom: ${props =>
    props.styleType === "button" ? `1px solid ${props.theme.widgets.orderList.dragHandleBorderColor}` : "none"};
  border-left: ${props =>
    props.styleType === "button" ? `1px solid ${props.theme.widgets.orderList.dragHandleBorderColor}` : "none"};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
