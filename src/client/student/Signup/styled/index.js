import styled from 'styled-components'
import { Col, Row, Button } from 'antd'
import {
  white,
  darkBlue1,
  lightGreen2,
  greenDark1,
  grey,
  themeColor,
  mobileWidthMax,
  greyGraphstroke,
  greenDark2,
  tabletWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  smallDesktopWidth,
  largeDesktopWidth,
} from '@edulastic/colors'

export const FlexWrapper = styled(Row)`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`

export const RegistrationWrapper = styled.div`
  background: ${greyGraphstroke} url(${(props) => props.image});
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
`

export const RegistrationHeader = styled(Row)`
  padding: 16px 24px;
  color: white;
  span {
    font-size: 12px;
    margin-right: 20px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 13px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 14px;
    }
  }
  a {
    padding: 8px 48px;
    text-decoration: none;
    color: white;
    border-radius: 4px;
    background: ${themeColor};
    text-transform: uppercase;
    font-size: 9px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 11px;
    }
    @media (max-width: ${mobileWidthMax}) {
      padding: 8px 35px;
    }
  }
`

export const BannerText = styled(Col)`
  color: white;
  h1 {
    color: white;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
    @media (min-width: ${smallDesktopWidth}) {
      font-size: 26px;
    }
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 40px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 60px;
    }
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
`

export const RegistrationBody = styled(Row)`
  min-height: calc(100vh - 120px);
  padding: 15px;
  @media (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`

export const Copyright = styled(Row)`
  color: ${grey};
  text-align: center;
  margin: 20px 0px;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 10px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
`

export const FormWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  z-index: 1;
`

export const FormHead = styled(Row)`
  background: ${darkBlue1};
  background: ${`-moz-radial-gradient(ellipse at center, ${lightGreen2} 16%, ${greenDark1} 100%)`};
  background: ${`-webkit-radial-gradient(ellipse at center,  ${lightGreen2} 16%, ${greenDark1} 100%)`};
  background: ${`radial-gradient(ellipse at center, ${lightGreen2} 16%, ${greenDark1} 100%)`};
  padding: 15px;
  h3 {
    color: white;
    margin: 5px 0px 15px;
    font-size: 18px;

    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 22px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 26px;
    }
  }
`

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

  @media (min-width: ${smallDesktopWidth}) {
    font-size: 10px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
`

export const InfoBox = styled(Col)`
  margin-top: 10px;
  font-size: 9px;
  color: white;

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
  }
`

export const InfoIcon = styled(Col)`
  color: rgba(0, 0, 0, 0.44);
  text-align: center;
  padding-top: 4px;
  img {
    width: 14px;
    filter: contrast(2);
  }
`

export const LinkDiv = styled.div`
  a {
    border-bottom: 2px ${themeColor} solid;
    font-size: 14px;
  }
`

export const FormBody = styled(Row)`
  padding: 15px;
  background: white;
  h5 {
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 13px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 14px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 18px;
    }
  }
  form {
    .ant-form-item {
      margin-bottom: 5px;
    }
    .ant-form-item-label {
      text-align: left;
      line-height: normal;
      margin-bottom: 3px;
      label {
        font-size: 11px;
        font-weight: 600;
        &.ant-form-item-required {
          &:before,
          &:after {
            content: '';
          }
        }
        @media (min-width: ${mediumDesktopExactWidth}) {
          font-size: 12px;
        }
        @media (min-width: ${extraDesktopWidthMax}) {
          font-size: 14px;
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

  @media (min-width: ${extraDesktopWidthMax}) {
    h5 {
      font-size: 18px;
    }
    form .ant-form-item-label label {
      font-size: 14px;
    }
  }
`

export const RegisterButton = styled(Button)`
  width: 100%;
  background: ${themeColor};
  border-color: ${themeColor};
  color: white;
  font-weight: 600;
  font-size: 10px;
  &:hover,
  &:focus {
    border-color: ${themeColor};
    background: ${themeColor};
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
`

export const CircleDiv = styled.div`
  height: ${({ size }) => size || 0}px;
  width: ${({ size }) => size || 0}px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  bottom: ${({ bottom }) => bottom}px;
  right: ${({ right }) => right}px;
  background: transparent linear-gradient(38deg, #00b0ff 0%, #1fe3a1 100%) 0% 0%
    no-repeat padding-box;
  border-radius: 50%;
  position: fixed;
  opacity: 0.6;
  z-index: 0;
`

export const Description = styled.p`
  text-align: center;
  margin-bottom: 16px;
  font-family: Open Sans, SemiBold;
`

export const AlreadyhaveAccount = styled.span`
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

export const MobileViewLinks = styled(Col)`
  margin-top: 20px;
  text-align: center;
  display: none;
  @media (max-width: ${mobileWidthMax}) {
    display: block;
  }
`

export const DesktopVieLinks = styled.div`
  font-family: Open Sans;
  font-weight: 600;
  a {
    font-size: 10px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 12px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 14px;
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

export const DesktopViewCopyright = styled(Row)`
  width: 50%;
  text-align: start;
  color: ${grey};
  margin: 25px 0px;
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 10px;
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
`
export const TermsPrivacy = styled.p`
  margin-top: 4px;
  line-height: 1.8;
  font-size: 9px;
  text-align: ${(props) => (props.align ? props.align : 'center')};
  @media (min-width: ${largeDesktopWidth}) {
    min-width: ${({ minWidth }) => minWidth || ' '}};
  }
`

export const ContainerForButtonAtEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0px;
  width: ${(props) => props.containerWidth || 'auto'};
  padding-right: ${(props) => props.pR || '0px'};
  margin-top: ${(props) => props.mT || '0px'};
  margin-bottom: ${(props) => props.mB || '0px'};
`
