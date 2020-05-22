import styled from "styled-components";
import { themeColor, extraDesktopWidthMax } from "@edulastic/colors";

export const ItemBody = styled.div`
  margin-top: 11px;

  .label {
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .select-label {
    margin-bottom: 10px;
  }

  .ant-btn {
    min-height: 40px;
  }

  .ant-select-selection,
  .ant-input {
    min-height: 40px;
    background: ${props => props.theme.questionMetadata.antSelectSelectionBgColor};
    padding-top: 4px;
  }

  .ant-select-selection {
    &__choice {
      border-radius: 5px;
      display: flex;
      align-items: center;
      background: ${themeColor}20;
      color: ${themeColor};
      font-weight: 600;
      &__content {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.2px;
        color: ${themeColor};
        font-weight: bold;
        height: 24px;
        display: flex;
        align-items: center;
      }
      .ant-select-remove-icon svg {
        fill: ${themeColor};
        width: 12px;
        height: 12px;
      }
    }
  }

  .ant-select-selection-selected-value {
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueFontWeight};
    letter-spacing: 0.2px;
    color: ${props => props.theme.questionMetadata.antSelectSelectionChoiceContentColor};

    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueFontSize};
    }
  }

  .tagsSelect .ant-select-selection__rendered {
    margin-left: 10px;
  }

  .ant-select-arrow-icon {
    color: ${props => props.theme.questionMetadata.antSelectArrowIconColor};
  }
`;
