import styled, { css } from "styled-components";
import { white, themeColor, themeColorLight, greyDarken } from "@edulastic/colors";
import { Button } from "antd";
import { IconManage } from "@edulastic/icons";
import { Paper, FlexContainer } from "@edulastic/common";

export const StyledFlexContainer = styled(FlexContainer)``;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};
`;

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 14px;
  border-radius: 25px;
  height: 40px;
  display: flex;
`;

export const SaveClassBtn = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  color: ${white};
  background: ${themeColorLight};
  margin-left: 20px;
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColorLight};
  }
`;

export const CancelClassBtn = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  color: ${themeColor};
  background: ${white};
  &:hover,
  &:focus {
    color: ${themeColor};
    background: ${white};
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;

// main content

export const Container = styled(Paper)`
  margin: 25px auto 0 auto;
  border-radius: 0px;
  width: 80%;
`;

export const FormTitle = styled(Title)`
  color: ${greyDarken};
  font-weight: 500;
  font-size: 20px;
  line-height: 1;
`;

export const MainContainer = styled.div``;

export const LeftContainer = styled.div`
  flex: 1;
`;

export const RightContainer = styled.div`
  flex: 2;
`;
