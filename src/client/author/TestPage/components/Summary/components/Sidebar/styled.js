import styled from "styled-components";

import { FlexContainer } from "@edulastic/common";
import { secondaryTextColor } from "@edulastic/colors";

export const Block = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: 0;

  :last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const MainTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${secondaryTextColor};
  letter-spacing: 0.2px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #4aac8b;
  margin-right: 3px;
`;

export const TitleContent = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;

export const MetaTitle = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #bbbfc4;
  margin-left: 5px;
`;

export const AnalyticsContainer = styled(FlexContainer)`
  margin-top: 0px;
`;

export const AnalyticsItem = styled(FlexContainer)`
  margin-left: 20px;
`;

export const ErrorWrapper = styled.div`
  color: red;
  margin-top: -6px;
  margin-bottom: 15px;
`;
