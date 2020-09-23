import { dashBorderColor, themeColorHoverBlue, themeColor, white, tabletWidth } from "@edulastic/colors";

import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  svg {
    margin: 0px 10px;
    fill: ${white};
    &:hover {
      fill: ${white};
    }
  }
  button.ant-btn {
    border-color: ${dashBorderColor};
    &:hover {
      border-color: ${dashBorderColor};
    }
  }
`;

export const AddNewButton = styled(Button)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 25px;
  height: auto;
  border-radius: 8px;
  background-color: ${themeColor};
  color: ${white};
  font-size: 13px;
  margin: 4px 5px;
  &:hover {
    color: ${white};
    background-color: ${themeColorHoverBlue};
  }
  @media (max-width: ${tabletWidth}) {
    padding: 5px 15px;
  }
`;

export const TextWrapper = styled.span`
  margin-right: 15px;
`;
