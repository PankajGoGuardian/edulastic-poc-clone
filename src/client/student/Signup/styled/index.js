import styled from "styled-components";
import { Col, Row, Button } from "antd";
import {
  white,
  darkBlue1,
  lightGreen2,
  greenDark1,
  grey,
  themeColor,
  mobileWidthMax,
  greyGraphstroke,
  greenDark3,
  greenDark2,
  tabletWidth
} from "@edulastic/colors";

export const FlexWrapper = styled(Row)`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`;

export const RegistrationWrapper = styled.div`
  background: ${greyGraphstroke} url(${props => props.image});
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0px;
  padding: 0px;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  position: relative;
`;

export const RegistrationHeader = styled(Row)`
  padding: 16px 24px;
  color: white;
  span {
    font-size: 12px;
    margin-right: 20px;
  }
  a {
    padding: 8px 48px;
    text-decoration: none;
    color: white;
    border-radius: 4px;
    background: ${themeColor};
    text-transform: uppercase;

    @media (max-width: ${mobileWidthMax}) {
      padding: 8px 35px;
      font-size: 11px;
    }
  }
`;

export const BannerText = styled(Col)`
  color: white;
  h1 {
    color: white;
    font-size: 46px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
  }
  a {
    font-size: 11px;
    margin-top: 10px;
    font-weight: 600;
    color: white;
  }
  div {
    font-size: 13px;
    margin-top: 10px;
  }

  @media (max-width: ${mobileWidthMax}) {
    h1 {
      font-size: 35px;
      text-align: center;
    }
  }
`;

export const RegistrationBody = styled(Row)`
  min-height: calc(100vh - 120px);
  padding: 30px 0px 65px;
`;

export const Copyright = styled(Row)`
  font-size: 10px;
  color: ${grey};
  text-align: center;
  margin: 25px 0px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const FormWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  z-index: 1;
`;

export const FormHead = styled(Row)`
  background: ${darkBlue1};
  background: ${`-moz-radial-gradient(ellipse at center, ${lightGreen2} 16%, ${greenDark1} 100%)`};
  background: ${`-webkit-radial-gradient(ellipse at center,  ${lightGreen2} 16%, ${greenDark1} 100%)`};
  background: ${`radial-gradient(ellipse at center, ${lightGreen2} 16%, ${greenDark1} 100%)`};
  padding: 15px;
  h3 {
    color: white;
    margin: 5px 0px 15px;
  }
`;

export const ThirdPartyLoginBtn = styled(Col)`
  background: ${white};
  margin-top: 5px;
  border-radius: 4px;
  text-align: center;
  font-size: 10px;
  padding: 8px;
  cursor: pointer;
  img {
    float: left;
    width: 14px;
  }
`;

export const InfoBox = styled(Col)`
  margin-top: 10px;
  font-size: 9px;
  color: white;
`;

export const InfoIcon = styled(Col)`
  color: rgba(0, 0, 0, 0.44);
  text-align: center;
  padding-top: 4px;
  img {
    width: 14px;
    filter: contrast(2);
  }
`;

export const LinkDiv = styled.div`
  a {
    padding-bottom: 2px;
    border-bottom: 2px ${themeColor} solid;
  }
`;

export const FormBody = styled(Row)`
  padding: 15px;
  background: white;
  h5 {
    margin-bottom: 20px;
    margin-top: 5px;
    font-size: 13px;
    font-weight: 600;
  }
  form {
    .ant-form-item {
      margin-bottom: 10px;
    }
    .ant-form-item-label {
      text-align: left;
      line-height: normal;
      margin-bottom: 3px;
      label {
        font-size: 12px;
        font-weight: 600;
        &.ant-form-item-required {
          &:before,
          &:after {
            content: "";
          }
        }
      }
      @media (max-width: ${tabletWidth}) {
        padding: 0px;
      }
    }
    .ant-input:focus {
      border: 1px solid ${greenDark2};
    }
    .has-error {
      .ant-form-explain,
      .ant-form-split {
        font-size: 10px;
      }
    }
    .ant-form-item-children {
      width: 100%;
      float: left;
      label,
      a {
        line-height: normal;
        font-size: 10px;
      }
      label {
        float: left;
      }
    }
  }
  .ant-input-affix-wrapper .ant-input-prefix {
    width: 15px;
  }
`;

export const RegisterButton = styled(Button)`
  width: 100%;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 13px;
  color: white;
  font-weight: 600;
  &:hover,
  &:focus {
    border-color: ${themeColor};
    background: ${themeColor};
  }
`;

export const CircleDiv = styled.div`
  height: ${({ size }) => size || 0}px;
  width: ${({ size }) => size || 0}px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  bottom: ${({ bottom }) => bottom}px;
  right: ${({ right }) => right}px;
  background: ${greenDark3};
  border-radius: 50%;
  position: fixed;
  opacity: 0.6;
  z-index: 0;
`;

export const Description = styled.p`
  text-align: center;
  margin-bottom: 16px;
`;

export const AlreadyhaveAccount = styled.span`
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;

export const MobileViewLinks = styled(Col)`
  margin-top: 20px;
  text-align: center;
  display: none;
  @media (max-width: ${mobileWidthMax}) {
    display: block;
  }
`;

export const DesktopVieLinks = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`;
