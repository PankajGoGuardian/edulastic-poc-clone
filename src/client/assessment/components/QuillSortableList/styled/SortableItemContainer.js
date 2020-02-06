import styled from "styled-components";
import { themeColor, inputBorder, dashBorderColor, white } from "@edulastic/colors";

export const SortableItemContainer = styled.div.attrs({
  className: "sortable-item-container"
})`
  width: ${props => (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  font-size: ${props => props.fontSize || "14px"};
  min-height: 40px;
  margin: ${({ styleType }) =>
    styleType === "list" ? "0 0 5px 0" : styleType === "inline" ? "0 5px 10px 0" : "0 0 12px 0"};
  display: inline-flex;
  flex-direction: column;
  background: #f8f8f8;
  border: ${({ styleType }) => (styleType === "list" || styleType === "inline" ? "none" : `1px solid #b9b9b9`)};
  border-radius: 4px;
  padding-right: 12px;
  z-index: 99999;

  .ql-container {
    font-size: ${props => props.fontSize || "14px"};
  }

  &:hover {
    input {
      border-color: #b9b9b9;
    }
  }
  & div.main {
    border-radius: 4px;
    border: 0;
    margin-right: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    margin-right: 0;
  }
  & div.main i.fa-align-justify {
    color: ${props => props.theme.sortableList.dragIconColor};
    font-size: ${props => props.theme.sortableList.dragIconFontSize};
    padding: 12px 15px;
  }
  .ql-editor {
    font-size: 14px;
    font-weight: 500;
    padding-left: 7px;
  }
  input {
    border-color: transparent;
  }
`;

export const DragIcon = styled.div`
  padding: 10px 17px;
`;

export const DragLine = styled.div`
  width: 19px;
  height: 3px;
  background: #878a91;

  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;
