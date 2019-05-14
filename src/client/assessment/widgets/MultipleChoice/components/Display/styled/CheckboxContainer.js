import styled from "styled-components";
import { newBlue, secondaryTextColor } from "@edulastic/colors";

const params = {
  width: 0,
  height: 0,
  padding: 0,
  marginRight: 13,
  fontSize: "14px",
  fontWeight: 500,
  backgroundCheck: "#F8F8F8",
  borderColorCheck: "#E6E6E6",
  borderWidthCheck: 0
};

export const CheckboxContainer = styled.div`
  ${props => {
    if (props.styleType === "primary") {
      params.width = 16;
      params.height = 16;
      params.fontSize = 0;
      params.fontWeight = 500;
      params.backgroundCheck = "#fff";
      params.borderWidthCheck = 1;
      params.marginRight = 36;
    } else if (props.smallSize) {
      params.width = 22;
      params.height = 22;
      params.fontSize = props.theme.widgets.multipleChoice.checkboxContainerSmallFontSize;
    } else {
      params.width = 40;
      params.height = 40;
      params.fontSize = props.theme.widgets.multipleChoice.checkboxContainerFontSize;
    }

    return `
      width: ${params.width}px;
      height: ${params.height}px;
      padding: ${params.padding};
      border-radius: 50%;
      box-sizing: border-box;
      margin-right: ${params.marginRight}px;
      align-self: flex-start;
      
      + div {
        font-size: 14px;
        font-weight: ${params.fontWeight};
        color: ${secondaryTextColor};
      }
      & input {
        opacity: 0;
        display: none;
      }
    
      & div {
        width: 100%;
        height: 100%;
        display: block;
        line-height: 1;
        -webkit-transition: all 0.6s;
        transition: all 0.6s;
      }
    
      & span {
        width: 100%;
        height: 100%;
        display: ${props.smallSize ? "block" : "flex"};
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: ${params.backgroundCheck};
        border: ${params.borderWidthCheck}px solid ${params.borderColorCheck};
        -webkit-transition: all 0.6s;
        transition: all 0.6s;
        text-align: center;
        font-size: ${params.fontSize};
        font-weight: ${params.fontWeight};
        color: #444444;
      }
    
      & div {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: ${props.smallSize ? "block" : "none"};
        background-color: ${props.theme.widgets.multipleChoice.checkboxContainerBgColor};
      }
    
      & input:checked + span {
        color: ${props.theme.widgets.multipleChoice.checkboxContainerCheckedColor};
        background-color: ${newBlue};
        border-color: ${newBlue};
      }
    
      & input:checked + span + div {
        background-color: ${props.theme.widgets.multipleChoice.checkboxContainerCheckedBgColor};
        display: none;
      }
    `;
  }}
`;

CheckboxContainer.displayName = "MCQCheckboxContainer";
