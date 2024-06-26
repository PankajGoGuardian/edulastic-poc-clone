import styled from "styled-components";
import { Row } from "antd";
import { mobileWidth } from "@edulastic/colors";

export const StyledRow = styled(Row)`
  margin: 0 0 27px 0;
  display: flex;
  align-items: flex-end;

  .ant-select-dropdown-menu {
    padding-bottom: 1rem;
  }

  @media (max-width: ${mobileWidth}) {
    margin: 0 0 15px 0;
    display: flex;
    flex-direction: column;

    > div {
      width: 100%;

      &:not(:last-child) {
        margin-bottom: 15px;
      }
    }
  }
`;
