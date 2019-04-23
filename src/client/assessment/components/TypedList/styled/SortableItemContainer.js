import styled from "styled-components";

export const SortableItemContainer = styled.div`
  width: ${props => (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  min-height: 40px;
  margin: 0 0 17px 0;
  display: inline-flex;
  align-items: center;

  & div.main {
    border-radius: 4px;
    border: 0;
    margin-right: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    background: #fff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  }
  & div.main i.fa-align-justify {
    color: ${props => props.theme.typedList.dragIconColor};
    font-size: ${props => props.theme.typedList.dragIconFontSize};
    padding: 12px 15px;
  }
`;
