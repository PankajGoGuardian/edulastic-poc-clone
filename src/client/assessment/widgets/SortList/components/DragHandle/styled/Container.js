import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.widgets.sortList.dragHandleContainerColor};
  font-size: ${props =>
    props.smallSize
      ? props.theme.widgets.sortList.dragHandleContainerSmallFontSize
      : props.theme.widgets.sortList.dragHandleContainerFontSize};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.widgets.sortList.dragHandleContainerHoverColor};
  }

  svg {
    width: 14px;
    height: 13px;
  }
`;
