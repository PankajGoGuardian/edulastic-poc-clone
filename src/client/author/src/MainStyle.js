import {
  greyThemeLight,
  greyThemeLighter,
  mainBgColor,
  secondaryTextColor,
  tabletWidth,
  themeColor,
  title,
  themeColorBlue
} from "@edulastic/colors";
import styled from "styled-components";

export const MainContainer = styled.div`
  .ant-layout {
    background: ${mainBgColor};
  }
  padding-left: ${props => {
    if (props.isPrintPreview) {
      return "0";
    }
    return "70px";
  }};
  width: 100%;

  @media (max-width: ${tabletWidth}) {
    padding-left: 0px;
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
        border-color: ${greyThemeLight};
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
      border-color: ${greyThemeLight};
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

  button.ant-switch {
    min-width: 34px;
    height: 16px;
    &:after {
      width: 12px;
      height: 12px;
    }
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
      border: 1px solid ${greyThemeLight};
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
        line-height: 30px;
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
          border: 1px solid ${themeColor};
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

  .ant-table-body,
  .ant-table-body-inner,
  .ant-table-fixed {
    .ant-table-thead,
    .ant-table-tbody {
      & > tr {
        th,
        td {
          &.ant-table-selection-column {
            width: 35px;
            max-width: 35px;
            .ant-checkbox-wrapper {
              .ant-checkbox {
                .ant-checkbox-inner {
                  width: 18px;
                  height: 18px;
                  border-color: ${greyThemeLight};
                  background: ${greyThemeLighter};
                  &:after {
                    left: 30%;
                  }
                }
                &.ant-checkbox-indeterminate .ant-checkbox-inner {
                  &:after {
                    background: ${themeColorBlue};
                    left: 50%;
                  }
                }
                &.ant-checkbox-checked {
                  &:after {
                    border-color: ${themeColorBlue};
                  }
                  .ant-checkbox-inner {
                    border-color: ${themeColorBlue};
                    background: ${themeColorBlue};
                    &:after {
                      top: 45%;
                    }
                  }
                }
                &.ant-checkbox-disabled {
                  &:after {
                    border-color: ${greyThemeLight};
                  }
                  .ant-checkbox-inner {
                    border-color: ${greyThemeLight};
                    background: ${greyThemeLight};
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .ant-select-tree-checkbox {
    .ant-select-tree-checkbox-inner {
      border-color: ${greyThemeLight};
      background: ${greyThemeLighter};
      width: 18px;
      height: 18px;
      &:after {
        left: 28%;
      }
    }
    &.ant-select-tree-checkbox-checked {
      &:after {
        border-color: ${themeColor};
      }
      .ant-select-tree-checkbox-inner {
        border-color: ${themeColor};
        background: ${themeColor};
      }
    }
  }
`;
