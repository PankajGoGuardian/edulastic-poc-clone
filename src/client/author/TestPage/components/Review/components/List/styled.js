import styled from "styled-components";
import { Button, Input, Checkbox } from "antd";

import { grey, themeColor, lightGreySecondary, secondaryTextColor } from "@edulastic/colors";

export const TestItemWrapper = styled.div`
  border-bottom: 1px solid ${grey};
  margin-bottom: 40px;

  :last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

export const PreviewButton = styled(Button)`
  width: 100px;
  height: 40px;
  font-size: 11px;
  font-weight: 600;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: 0 2px 4px 0 rgba(201, 208, 219, 0.5);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 25px;
`;

export const PointsLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  margin-right: 0;
  margin-bottom: 8px;
`;

export const PointsInput = styled(Input)`
  width: 100px;
  height: 40px;
  border: none;
  background: ${lightGreySecondary};
  font-size: 16px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  padding-left: 20px;
`;

export const QuestionIndex = styled.span`
  display: block;
  margin-right: 0;
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  cursor: grab;
`;

export const QuestionCheckbox = styled(Checkbox)`
  display: block;
  margin-top: 10px;

  .ant-checkbox-inner {
    width: 18px;
    height: 18px;
  }
`;
