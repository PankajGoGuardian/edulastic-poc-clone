import styled from "styled-components";
import { tabletWidth, secondaryTextColor, title, themeColor, smallDesktopWidth } from "@edulastic/colors";

export const MainContainer = styled.div`
  padding-left: ${props => {
    if (props.isPrintPreview) {
      return "0";
    }
    return "100px";
  }};
  width: 100%;
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 100px;
    z-index: 999;
  }
  @media (max-width: ${tabletWidth}) {
    padding-left: 0px;
    .fixed-header {
      left: 0;
      background: #00ad50;
    }
  }

  .ant-btn {
    border-color: ${props => props.theme.themeColor};
    &:hover,
    &:focus,
    &:active {
      border-color: ${props => props.theme.themeColor};
    }
  }
  .ant-btn-primary {
    background-color: ${props => props.theme.themeColor};
    border-color: ${props => props.theme.themeColor};
    &:hover,
    &:focus,
    &:active {
      background-color: ${props => props.theme.themeColor};
      border-color: ${props => props.theme.themeColor};
    }
  }

  .ant-select-open,
  .ant-select-focused {
    .ant-select-selection {
      border-color: ${props => props.theme.themeColor};
      &:hover,
      &:focus {
        border-color: ${props => props.theme.themeColor};
      }
    }
  }
  .ant-select {
    .ant-select-selection {
      &:hover,
      &:focus {
        border-color: #b9b9b9;
      }
      .ant-select-arrow-icon {
        svg {
          fill: ${props => props.theme.themeColor};
        }
      }
    }
  }

  .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
    border-color: ${props => props.theme.themeColor};
  }

  .ant-input {
    &:hover,
    &:focus {
      border-color: #b9b9b9;
    }
  }

  .ant-dropdown-menu {
    .ant-dropdown-menu-item {
      &:hover {
        background-color: ${props => props.theme.themeColor};
      }
    }
  }

  .ant-switch-checked {
    background-color: ${props => props.theme.themeColor};
  }

  .ant-pagination {
    display: flex;
    justify-content: flex-end;
    .ant-pagination-total-text {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      font-family: "Open Sans";
      color: ${secondaryTextColor};
      letter-spacing: normal;
    }
    li {
      box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
      border: none;
    }
    .ant-pagination {
      &-prev,
      &-next {
        .ant-pagination-item-link {
          border: none;
        }
        &:hover {
          .ant-pagination-item-link {
            color: ${themeColor};
          }
        }
      }
      &-item {
        box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
        border: none;
        line-height: 35px;
        background: white;
        a {
          color: ${title};
        }
        &:hover,
        &:focus {
          background: ${props => props.theme.themeColor};
          border-color: ${props => props.theme.themeColor};
          a {
            color: white;
          }
        }
        &-active {
          border: none;
          opacity: 0.75;
          background: ${props => props.theme.themeColor};
          border-color: ${props => props.theme.themeColor};
          a {
            color: white;
          }
          &:hover,
          &:focus {
            background: ${props => props.theme.themeColor};
            a {
              color: white;
            }
          }
        }
      }
    }
    .ant-pagination-jump {
      &-prev,
      &-next {
        .ant-pagination-item-container {
          .ant-pagination-item-link-icon {
            color: ${props => props.theme.themeColor};
          }
        }
      }
    }
  }

  .ant-table-thead > tr > th.ant-table-selection-column,
  .ant-table-tbody > tr > td.ant-table-selection-column {
    width: 50px;
    max-width: 50px;
  }

  .ant-select-disabled .ant-select-selection--multiple .ant-select-selection__choice {
    background: ${themeColor}20;
  }

  .ant-select-selection {
    &__rendered {
      // margin-left: 0;
    }
    &__choice {
      height: 24px !important;
      border-radius: 5px;
      display: flex;
      align-items: center;
      background: ${themeColor}20;
      color: ${themeColor};
      font-weight: 600;
      margin: 8px 5px 0px 3px !important;
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

      @media (max-width: ${smallDesktopWidth}) {
        margin: 10px 5px 0px 3px !important;
        height: 20px !important;
        &__content {
          height: 20px;
        }
      }
    }
  }
`;
