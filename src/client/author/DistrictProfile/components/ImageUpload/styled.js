import styled from "styled-components";
import { Icon } from "antd";

export const StyledUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledUpload = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fafafa;
  width: ${props => props.width};
  height: ${props => props.height};
  overflow: hidden;
  cursor: pointer;
  border: ${props => (props.isVisible ? "1px dashed #d9d9d9" : "none")} input {
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
`;

export const StyledImg = styled.img`
  width: 100%;
  height: 100%;
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
