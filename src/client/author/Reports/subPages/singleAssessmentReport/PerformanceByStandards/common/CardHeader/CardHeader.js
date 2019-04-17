import styled from "styled-components";
import { Select, Button } from "antd";

import { secondaryTextColor } from "@edulastic/colors";

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const CardDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  color: ${secondaryTextColor};
  font-weight: 600;
`;

export const GroupingTitle = styled.p`
  display: inline-block;
  margin: 0;
  padding: 0 10px;
  font-size: 14px;
  color: ${secondaryTextColor};
`;

export const GroupingSelect = styled(Select)`
  width: 200px;
`;

export const ResetButton = styled(Button)`
  border: none;
`;

export const MasteryLevelWrapper = styled.div`
  display: inline-block;
  margin-left: 40px;
`;

export const MasteryLevel = styled.span`
  display: inline-block;
`;

export const MasteryLevelIndicator = styled.span`
  display: inline-block;
  width: 20px;
  height: 13px;
  background: ${props => props.background};
`;

export const MasteryLevelTitle = styled.span`
  display: inline-block;
  font-size: 12px;
  padding-left: 10px;
  margin-right: 20px;
`;

export default CardHeader;
