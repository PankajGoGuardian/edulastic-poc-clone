import styled from "styled-components";
import { darkBlue } from "@edulastic/colors";

export const SelectContainer = styled.div`
  position: relative;
  width: 200px;
  display: flex;
  align-items: center;
  border: none;

  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle}
  }

  .ant-select {
    height: 40px;
    width: 100%;
    &::selection {
      background: ${props => props.theme.widgets.clozeImageDropDown.antSelectSelectionBgColor};
    }
  }
  .ant-select-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
    border: 1px solid;
    border-color: ${props => props.theme.widgets.clozeImageDropDown.antSelectSelectionBorderColor};
    background: ${props => props.backgroundColor};
    &:hover {
      border: 1px solid;
      border-color: ${props => props.theme.widgets.clozeImageDropDown.antSelectSelectionBorderColor};
    }
  }

  .ant-select-selection__rendered {
    width: 100%;
    margin: 0;
  }

  .ant-select-arrow {
    right: 5px;
  }

  .ant-select-selection-selected-value {
    font-size: ${props => props.fontSize || props.theme.widgets.clozeImageDropDown.antSelectSelectionFontSize};
    font-weight: ${props => props.theme.widgets.clozeImageDropDown.antSelectSelectionFontWeight};
    letter-spacing: 0.2px;
    color: ${props => props.theme.widgets.clozeImageDropDown.antSelectSelectionColor};
    max-width: calc(100% - 20px);
    text-overflow: clip;
    ${({isPrintPreview}) => isPrintPreview ? {color: darkBlue} : {}};
  }
  .anticon-down {
    svg {
      fill: ${props => props.theme.widgets.clozeImageDropDown.antIconDownColor};
    }
  }
  @media (max-width: 760px) {
    height: 52px;
    width: 188px;
  }
`;
