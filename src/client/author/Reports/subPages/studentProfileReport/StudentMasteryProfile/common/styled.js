import styled from "styled-components";
import { Col } from "antd";
import { themeColor, themeColorLight } from "@edulastic/colors";

import { StyledTable as Table } from "../../../../common/styled";

export const StyledTag = styled(Col)`
  flex: 1 1 100px;
  text-align: center;
  border: 1px solid ${props => props.color};
  padding: 6px 10px;
  border-radius: 20px;
  color: ${props => props.color};
  margin: 2px;
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
      tbody {
        tr {
          td:nth-child(3) {
            font-weight: normal;
          }
        }
      }
    }
  }
`;
