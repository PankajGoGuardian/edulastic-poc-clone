import styled from "styled-components";
import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  backgrounds,
  textColor,
  fadedGrey,
  themeColor,
  white
} from "@edulastic/colors";
import { Button, Upload } from "antd";
import TextWrapper from "../../AssignmentCreate/common/TextWrapper";

export const uploadIconStyle = {
  height: "80px",
  width: "80px",
  marginBottom: "15px",
  fill: textColor
};

export const StyledButton = styled(Button)`
  background: ${themeColor};
  color: ${white};
  &:hover,
  &:active,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }
  padding: 0px 60px;
  text-transform: uppercase;
  font-size: 11px;
  position: ${({ position = "" }) => position};
  bottom: ${({ bottom = "" }) => bottom};
`;

export const StyledContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 40px;
  background: ${({ status }) => (status === "STANDBY" ? backgrounds.default : white)};
  min-height: calc(100vh - 60px - 41px - 30px);
  @media screen and (min-width: ${mediumDesktopExactWidth}) {
    min-height: calc(100vh - 76px - 41px - 30px);
  }
  @media screen and (min-width: ${extraDesktopWidthMax}) {
    min-height: calc(100vh - 96px - 41px - 30px);
  }
  border-radius: 10px;
  border: ${({ status }) => (status === "STANDBY" ? `1px solid ${fadedGrey}` : null)};
`;

export const ContentWrapper = styled.div`
  padding: 0px 30px;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${({ flexDirection = "" }) => flexDirection};
  align-items: ${({ alignItems = "" }) => alignItems};
  justify-content: ${({ justifyContent = "" }) => justifyContent};
  width: ${({ width = "" }) => width};
`;

export const UploadTitle = styled(TextWrapper)`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const UploadDescription = styled(TextWrapper)`
  font-size: 10px;
`;

export const StyledUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
  }
`;
