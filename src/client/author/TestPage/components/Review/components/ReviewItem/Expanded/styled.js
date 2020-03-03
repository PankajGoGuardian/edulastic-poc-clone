import styled from "styled-components";
import { Checkbox } from "antd";
import { secondaryTextColor } from "@edulastic/colors";

export const PointsLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  margin-right: 0;
  margin-bottom: 8px;
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
