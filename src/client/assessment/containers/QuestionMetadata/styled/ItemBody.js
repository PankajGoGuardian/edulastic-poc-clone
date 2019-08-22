import styled from "styled-components";

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

  .ant-select-selection__choice {
    border-radius: 5px;
    border: none;
    background-color: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueBackground};
  }

  .ant-select-selection__choice__content {
    font-size: ${props => props.theme.questionMetadata.antSelectSelectionChoiceContentFontSize};
    font-weight: ${props => props.theme.questionMetadata.antSelectSelectionChoiceContentFontWeight};
    color: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueColor};
    .selected-item-desctiption {
      width: 0;
    }
  }

  .ant-select-selection__choice__remove {
    color: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueColor};
    &:hover {
      color: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueColor};
    }
  }

  .ant-select-selection-selected-value {
    font-size: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueFontSize};
    font-weight: ${props => props.theme.questionMetadata.antSelectSelectionSelectedValueFontWeight};
    letter-spacing: 0.2px;
    color: ${props => props.theme.questionMetadata.antSelectSelectionChoiceContentColor};
  }

  .ant-select-selection__rendered {
    margin-left: 22px;
  }

  .tagsSelect .ant-select-selection__rendered {
    margin-left: 10px;
  }

  .ant-select-arrow-icon {
    color: ${props => props.theme.questionMetadata.antSelectArrowIconColor};
  }
`;
