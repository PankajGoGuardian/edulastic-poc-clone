import styled from "styled-components";
import { Table } from "antd";
import { white, cardTitleColor, themeColorBlue, greyThemeLight, greyThemeLighter } from "@edulastic/colors";

export const EduTableStyled = styled(Table)`
  width: ${props => props.width || "auto"};
  .ant-table-body,
  .ant-table-body-inner,
  .ant-table-fixed {
    .ant-table-thead,
    .ant-table-tbody {
      & > tr {
        &:hover {
          cursor: pointer;
          &:not(.ant-table-expanded-row) > td {
            background: #f2f3f2;
          }
        }
        td,
        th {
          &.ant-table-selection-column {
            .ant-checkbox-wrapper {
              .ant-checkbox {
                .ant-checkbox-inner {
                  border-color: ${greyThemeLight};
                  background: ${greyThemeLighter};
                }
                &.ant-checkbox-indeterminate .ant-checkbox-inner {
                  &:after {
                    background: ${themeColorBlue};
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
    .ant-table-thead {
      & > tr {
        & > th {
          font-size: 10px;
          background: ${white};
          text-align: ${props => props.align || "center"};
          padding: 5px 0px 15px;
          border-bottom: none;
          font-weight: bold;
          text-transform: uppercase;
          color: ${cardTitleColor};
          white-space: ${props => props.wrap || "nowrap"};

          &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
          & .ant-table-header-column .ant-table-column-sorters::before {
            background: ${white};
          }
          &.ant-table-column-has-actions.ant-table-column-has-filters,
          &.ant-table-column-has-actions.ant-table-column-has-sorters {
            text-align: center;
          }
          .ant-table-column-sorters {
            display: flex;
            justify-content: center;

            .ant-table-column-sorter-inner {
              &.ant-table-column-sorter-inner-full {
                margin-top: 0em;
              }
              .ant-table-column-sorter {
                &-up,
                &-down {
                  font-size: 10px;
                }
              }
            }
          }
        }
      }
    }
    .ant-table-tbody {
      text-align: ${props => props.align || "center"};
      & > tr {
        & > td {
          padding: 5px 0;
          font-weight: 600;
          border-bottom: 1px solid #f2f3f2;
          font-size: ${props => props.theme.linkFontSize};
        }
        &:hover {
          &:not(.ant-table-expanded-row) > td {
            background: #f2f3f2;
          }
        }
      }
    }
  }

  .ant-spin-nested-loading,
  .ant-spin-container {
    position: static;
  }
  .ant-pagination {
    margin-bottom: 0;
    position: absolute;
    right: 15px;
    bottom: 15px;
    top: auto;
  }
  .ant-table-row-expand-icon {
    display: none;
  }
`;
