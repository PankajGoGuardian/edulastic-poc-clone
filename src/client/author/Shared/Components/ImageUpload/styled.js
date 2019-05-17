import styled from "styled-components";
import { Icon } from "antd";

export const StyledUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledUpload = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;	
	background-color: #fafafa;
	width: ${props => props.width};	
	height: ${props => props.height};
	overflow: hidden;
	cursor: pointer;
	border: ${props => (props.isVisible ? "1px dashed #d9d9d9" : "none")}
	&:hover {
		border: ${props => (props.isVisible ? "1px dashed #1890ff" : "none")}
	}
	input {
		display: none !important;
	}
`;

export const StyledImg = styled.img`	
	width: 100%:
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

export const StyledIcon = styled(Icon)`
  font-size: 32px;
  color: #999;
`;
