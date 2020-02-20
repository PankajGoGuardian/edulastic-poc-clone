import styled from "styled-components";
import { Col } from "antd";
import { themeColor, themeColorLight, greyThemeDark1 } from "@edulastic/colors";
import { StyledTable as Table, StyledTag } from "../../../../common/styled";

export const ReStyledTag = styled(StyledTag)`
  cursor: ${props => props.cursor || "default"};
  &:hover {
    color: #ffffff;
  }
`;

export const StyledSpan = styled.span`
  cursor: ${props => props.cursor || "default"};
  font: 12px/17px Open Sans;
  font-weight: 600;
  letter-spacing: 0px;
  color: ${greyThemeDark1};
  text-align: ${props => props.alignment || "left"};
  &:hover {
    color: ${props => props.hoverColor || greyThemeDark1};
  }
`;

export const OnClick = styled.span`
  color: ${themeColor};
  cursor: pointer;
  &:hover {
    color: ${themeColorLight};
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            background: white;
            font: Bold 10px/10px Open Sans;
            .ant-table-column-sorters {
              .ant-table-column-sorter {
                .ant-table-column-sorter-inner {
                  .ant-icon {
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
      }
      tbody {
        tr.ant-table-expanded-row {
          background-color: white;
        }
        tr {
          td:nth-child(3) {
            font-weight: normal;
          }
        }
      }
    }
  }
`;
