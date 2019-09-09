import { Progress, Tag } from "antd";
import styled from "styled-components";
import { mobileWidthLarge, themeColor } from "@edulastic/colors";

export const StyledProgress = styled(Progress)`
  margin: 0 30px 15px 30px;
  .ant-progress-text {
    color: #434b5d;
    font-size: 35px;
    margin-top: -7px !important;
    font-weight: bold;
  }
`;

export const StyledDiv = styled.div`
  display: flex;

  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`;

export const StyledDivF = styled.div``;

export const StyledProgressDiv = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
`;

export const GraphDescription = styled.span`
  text-align: center;
  font-weight: 600;
  font-size: 11px;
  color: #b1b1b1;
  margin: 3px 0 0 0;
  padding: 0;
  text-transform: uppercase;
  position: absolute;
  width: 100%;
  top: 57%;
`;

export const GraphInfo = styled.div`
  text-align: center;
  color: #434b5d;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 17px;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
`;

export const ProgressBarContainer = styled.div`
  width: 200px;

  @media (max-width: ${mobileWidthLarge}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

export const AssignmentTitle = styled(Tag)`
  color: ${themeColor};
  text-align: center;
  width: 100%;
  overflow: hidden;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
