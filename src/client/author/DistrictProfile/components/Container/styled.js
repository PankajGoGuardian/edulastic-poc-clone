import styled from "styled-components";
import { Layout, Spin, Button, Typography } from "antd";

import { white, largeDesktopWidth, mobileWidthMax, green } from "@edulastic/colors";

const { Content, Header } = Layout;

const { Text } = Typography;

export const DistrictProfileHeader = styled(Header)`
  height: 76px;
  @media (min-width: 1600px) {
    height: 96px;
  }
`;

export const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 30px 30px 30px;
`;

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(68, 68, 68, 0.1);
  z-index: 999;
  border-radius: 10px;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;

export const ProfileImgWrapper = styled.div`
  width: 350px;
  height: 350px;
  position: relative;
  background-color: ${white};
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: ${largeDesktopWidth}) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

export const RightContainer = styled.div`
  width: calc(100% - 370px);

  @media (max-width: ${largeDesktopWidth}) {
    width: calc(100% - 270px);
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`;

export const FormContent = styled(Content)`
  background-color: ${white};
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

export const TwoColumnFormContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 30px;
`;

export const Spacer = styled.span`
  flex-grow: 1;
`;

export const StyledButton = styled(Button)`
  margin-left: 5px;
`;

export const ButtonText = styled(Text)`
  color: ${green};
`;
