import styled from 'styled-components';

export const SortableItemContainer = styled.div`
  width: ${props =>
    (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  min-height: 50px;
  margin: 10px 0;
  display: inline-flex;
  align-items: center;

  & div.main {
    border-radius: 4px;
    border: solid 1px #dfdfdf;
    margin-right: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }
  & div.main i.fa-align-justify {
    color: #1fe3a1;
    font-size: 16px;
    padding: 15px;
  }
  & i.fa-trash-o {
    color: #ee1658;
    font-size: 22px;
    padding: 15px;
    cursor: pointer;
  }
`;
