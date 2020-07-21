import { greyThemeLight, greyThemeLighter, mediumDesktopExactWidth } from "@edulastic/colors";
import styled from "styled-components";

export const SortableItemContainer = styled.div.attrs({
  className: "sortable-item-container"
})`
  width: ${props => (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  font-size: ${props => props.fontSize || "14px"};
  margin: ${({ styleType }) =>
    styleType === "list" ? "0 0 5px 0" : styleType === "inline" ? "0 5px 10px 0" : "0 0 4px 0"};
  display: inline-flex;
  flex-direction: column;
  border-radius: 4px;
  z-index: 99999;

  &:last-child {
    margin-bottom: 0px;
  }

  .ql-container {
    font-size: ${props => props.fontSize || "14px"};
  }

  &:hover {
    input {
      border-color: ${greyThemeLight};
    }
  }
  & div.main {
    border-radius: 4px;
    border: 0;
    margin-right: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: stretch;
    background: ${greyThemeLighter};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    margin-right: 0;
    min-height: 34px;
    max-width: 100%;
    border: ${({ styleType }) =>
      styleType === "list" || styleType === "inline" ? "none" : `1px solid ${greyThemeLight}`};

    .froala-wrapper {
      padding: 8px 0px;
    }
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

  .froala-wrapper {
    width: calc(100% - 65px); /* 65px is the combined width of hamburger and delete icons  */
  }
`;

export const DragIcon = styled.div`
  padding: 0px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const DragLine = styled.div`
  width: 19px;
  height: 3px;
  background: #878a91;

  &:not(:last-child) {
    margin-bottom: 3px;
  }
`;

export const SortableListContainer = styled.div`
  font-size: 13px;
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 14px;
  }
`;
