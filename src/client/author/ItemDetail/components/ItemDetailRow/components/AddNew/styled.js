import { secondaryTextColor, dashBorderColor, cardBg } from "@edulastic/colors";

import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  svg {
    margin: 0px 10px;
    fill: ${secondaryTextColor};
    &:hover {
      fill: ${secondaryTextColor};
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
  background-color: ${cardBg};
  color: ${secondaryTextColor};
  font-size: 13px;
  &:hover {
    color: ${secondaryTextColor};
  }
`;

export const TextWrapper = styled.span`
  margin-right: 15px;
`;
