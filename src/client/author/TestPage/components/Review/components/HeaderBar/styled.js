import styled from "styled-components";
import { Checkbox, Button } from "antd";

import { FlexContainer } from "@edulastic/common";
import { secondaryTextColor, themeColor } from "@edulastic/colors";

export const Item = styled(FlexContainer)`
  cursor: pointer;
  margin-right: 20px;
  color: ${themeColor};
  position: relative;
`;

export const Container = styled(FlexContainer)`
  justify-content: space-between;
  padding-bottom: 22px;
  margin-top: ${props => (props.windowWidth > 468 ? "0px" : "15px")};
`;

export const SelectAllCheckbox = styled(Checkbox)`
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-transform: uppercase;

  .ant-checkbox {
    margin-right: 13px;
  }

  .ant-checkbox-inner {
    width: 18px;
    height: 18px;
  }
`;

export const ActionButton = styled(Button)`
  padding: 0;
  border: 1px solid ${themeColor};
  border-radius: 4px;

  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px !important;

    button {
      flex-direction: column;
      margin: 0 auto;
    }
  }
`;
