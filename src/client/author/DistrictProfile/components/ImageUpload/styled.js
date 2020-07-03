import { greyThemeLight, greyThemeLighter, largeDesktopWidth, themeColorBlue } from "@edulastic/colors";
import { Button, Icon } from "antd";
import styled from "styled-components";

export const StyledUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ keyName }) => (keyName === "pageBackground" ? "100%" : "")};
`;

export const StyledUpload = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${greyThemeLighter};
  width: ${({ keyName, width }) => (keyName === "pageBackground" ? "100%" : width || "")};
  height: ${props => props.height};
  overflow: hidden;
  cursor: pointer;
  border: ${props => (props.isVisible ? `1px dashed ${greyThemeLight}` : "none")};
  input {
    display: none !important;
  }

  .anticon-plus {
    display: ${props => (props.isVisible ? "block" : "none")};
  }

  img {
    display: ${props => (props.isVisible ? "none" : "block")};
  }

  &:hover {
    border: ${props => (props.isVisible ? "1px dashed #1890ff" : "none")} div {
      display: block;
    }
    .anticon-plus {
      display: block;
    }
  }
  border-radius: ${({ keyName }) => (keyName === "logo" ? "50%" : "")}; // logo image
`;

export const StyledImg = styled.div`
  width: 100%;
  height: ${({ height }) => (height ? "180px" : "100%")};
  background: url(${props => (props.imgUrl ? props.imgUrl : props.src)});
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
`;

export const StyledP = styled.p`
  text-align: center;
  margin-top: 8px;
  color: #666;
  font-size: 14px;
`;

export const StyledChangeLog = styled.p`
  color: #096dd9;
  text-align: center;
  margin-top: 5px;
  font-size: 14px;
  cursor: pointer;
`;

export const StyledPRequired = styled.p`
	text-align: center;
	margin-top: 5px;
	color: #f5222d
	font-size: 14px;	
`;

export const StyledHoverDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: none;
`;

export const StyledIcon = styled(Icon)`
  font-size: 48px;
  color: #999;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const Camera = styled.div`
  background: ${themeColorBlue};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 20px;
  bottom: -20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
  @media (max-width: ${largeDesktopWidth}) {
    right: 5px;
    bottom: -20px;
  }
`;

export const ImageUploadButton = styled(Button)`
  height: 36px;
  text-transform: uppercase;
`;
