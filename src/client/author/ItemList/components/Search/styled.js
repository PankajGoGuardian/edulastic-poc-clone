import styled from "styled-components";
import {
  themeColor,
  secondaryTextColor,
  lightGrey4,
  smallDesktopWidth,
  greyThemeLighter,
  greyThemeLight,
  title
} from "@edulastic/colors";
import { DatePicker } from "antd";

export const Container = styled.div`
  padding: 0 0 20px;

  .ant-select {
    width: 100%;
    min-width: 100%;
    &.ant-select-lg {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: ${title};
      .ant-select-selection {
        border: 0;
        min-height: 40px;
        background: ${greyThemeLighter};
        border: 1px solid ${greyThemeLight};
        padding-top: 0;
        &.ant-select-selection--multiple {
          .ant-select-selection__rendered {
            margin-left: 8px;
            .ant-select-selection-selected-value {
              font-size: 13px;
              font-weight: 600;
              letter-spacing: 0.2px;
              color: ${secondaryTextColor};
            }
            .ant-select-selection__choice {
              border-radius: 5px;
              border: 0;
              background-color: rgba(23, 115, 240, 0.2);
              height: 23.5px;
              color: ${themeColor};
              .ant-select-selection__choice__content {
                font-size: 10px;
                letter-spacing: 0.2px;
                opacity: 1;
                font-weight: bold;
                color: ${secondaryTextColor};
              }
              .ant-select-remove-icon {
                svg {
                  fill: ${themeColor};
                }
              }
            }
            li {
              height: 24px;
              line-height: 24px;
              margin-top: 8px;
            }
          }
        }
        .ant-select-arrow-icon {
          font-size: 14px;
          svg {
            fill: ${themeColor};
          }
        }
      }
      @media (max-width: ${smallDesktopWidth}) {
        .ant-select-selection {
          min-height: 30px;
          height: 30px;
          .ant-select-selection__rendered {
            line-height: 30px;
            li {
              height: 20px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    margin-top: 10px;
    height: 30px;
    .ant-select-selection {
      min-height: 30px;
    }
  }
`;

export const MainFilterItems = styled.div`
  margin-top: 4px;
`;

export const Item = styled.div`
  margin-top: 10px;
`;

export const ItemRelative = styled(Item)`
  position: relative;
`;

export const IconWrapper = styled.span`
  position: absolute;
  right: 10px;
  top: 35px;
  z-index: 1;
  color: ${lightGrey4};
`;

export const ItemHeader = styled.span`
  display: block;
  font-size: 12px;
  color: ${secondaryTextColor};
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 8px;
`;

export const ItemBody = styled.div`
  margin-top: 11px;
  min-height: 40px;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  input {
    height: 40px;
    border: none;
  }
`;
