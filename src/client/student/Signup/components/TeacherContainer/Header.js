import { eastBaycolor, lightGrey4, mainTextColor, white } from "@edulastic/colors";
import { OnWhiteBgLogo } from "@edulastic/common";
import { Col, Dropdown, Icon as AntIcon, Menu, Row } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { isProxyUser as isProxyUserSelector } from "../../../Login/ducks";

const Header = ({ userInfo, logout, isProxyUser }) => {
  const [isVisible, setVisible] = useState(false);
  const { firstName, middleName, lastName, role } = userInfo;
  const userName = `${firstName} ${middleName || "b"} ${lastName || "c"}`;

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Sign Out</Menu.Item>
    </Menu>
  );

  const toggleDropdown = () => {
    setVisible(!isVisible);
  };

  const getInitials = () => {
    if (firstName && lastName) return `${firstName[0] + lastName[0]}`;
    if (firstName) return `${firstName.substr(0, 2)}`;
    if (lastName) return `${lastName.substr(0, 2)}`;
  };

  return (
    <HeaderWrapper type="flex" align="middle" isProxyUser={isProxyUser}>
      <Col span={12}>
        <OnWhiteBgLogo />
      </Col>
      <Col span={12} align="right">
        <UserInfoButton className="userinfoBtn">
          <Dropdown
            overlay={menu}
            onClick={toggleDropdown}
            className="headerDropdown"
            trigger={["click"]}
            placement="topCenter"
          >
            <div>
              <PseudoDiv>{getInitials()}</PseudoDiv>
              <UserInfo>
                <UserName>{userName || "Anonymous"}</UserName>
                <UserType>{role}</UserType>
              </UserInfo>
              <IconDropdown
                style={{ fontSize: 20, pointerEvents: "none" }}
                className="drop-caret"
                type={isVisible ? "caret-up" : "caret-down"}
              />
            </div>
          </Dropdown>
        </UserInfoButton>
      </Col>
    </HeaderWrapper>
  );
};

Header.propTypes = {
  userInfo: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

export default connect(state => ({
  isProxyUser: isProxyUserSelector(state)
}))(Header);

const HeaderWrapper = styled(Row)`
  padding: 16px 24px;
  border-bottom: 1px ${lightGrey4} solid;
  background: ${white};
  span {
    font-size: 12px;
    margin-right: 20px;
  }
  margin-top: ${props => (props.isProxyUser ? 35 : 0)}px;
`;

const UserInfoButton = styled.div`
  cursor: pointer;

  &.active {
    padding: 0;
    background: transparent;
    border-radius: 50%;
    width: 60px;
    margin: 0 auto;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);

    img {
      box-shadow: none;
    }
  }

  .headerDropdown {
    width: 190px;
    height: 60px;
    display: flex;
    align-items: center;
    padding-right: 25px;
    position: relative;
    font-weight: 600;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    .drop-caret {
      position: absolute;
      right: 10px;
      top: 20px;
    }
  }
  img {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 0;
    border-radius: 50%;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  }
  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: ${white};
  }
`;

const PseudoDiv = styled.div`
  min-width: 50px;
  min-height: 50px;
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 22px;
  font-weight: bold;
  line-height: 50px;
  text-align: center;
  text-transform: uppercase;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 0px 4px;
  color: ${eastBaycolor};
`;

const UserName = styled.div`
  font-size: 14px;
  text-transform: capitalize;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 80px;
`;

const UserType = styled.div`
  font-size: 12px;
  text-transform: capitalize;
`;

const IconDropdown = styled(AntIcon)`
  color: ${mainTextColor};
  position: absolute;
  top: -10px;
`;
