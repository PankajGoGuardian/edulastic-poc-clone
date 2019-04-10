import styled from "styled-components";
import { white } from "@edulastic/colors";
import { Link } from "react-router-dom";
import { props } from "bluebird";

export const AdminHeaderContent = styled.div`
	height: 63px;
	padding: 0px 3%;
	// background: #1774F0;	
	display: flex;
  // justify-content: space-between;	
  justify-content:flex-start
  align-items: center;
  border-bottom: 2px solid #cacaca;
`;

export const StyledTitle = styled.h1`
  // color: ${white};
  color: gray;
	font-size: 22px;
	font-weight: bold;
	margin: 0;
	padding: 0;
`;

export const AnchorLink = styled(Link)`
  color: #69727e;
`;

export const StyledTabs = styled.div`
  width: 72%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 100px;
`;

export const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: ${props => (props.isActive ? "gray" : "#cbcbcb")};
  font-weight: bold;
  height: 100%;
  border-bottom: ${props => (props.isActive ? "3px solid #1774F0" : "none")}
  text-decoration: none !important;
`;

export const StyledSubTabs = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 3%;
`;

export const StyledLinkA = styled(Link)`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: gray;
  font-weight: bold;
  padding: 0 40px;
  border-right: 1px solid #cacaca;
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    border-right: 0;
  }
  color: ${props => (props.isActive ? "#1774F0" : "#cbcbcb")};
  text-decoration: none !important;
`;
