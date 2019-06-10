import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Col, Dropdown, Menu, Icon as AntIcon } from "antd";
import { IconHeader } from "@edulastic/icons";
import { lightGrey4, white, eastBaycolor, mainTextColor } from "@edulastic/colors";
import Profile from "../../../assets/Profile.png";

const Header = ({ userInfo, logout }) => {
  const [isVisible, setVisible] = useState(false);
  const { firstName, middleName, lastName, role } = userInfo;
  const userName = firstName + " " + (middleName ? middleName + " " : "") + (lastName ? lastName : "");

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Sign Out</Menu.Item>
    </Menu>
  );

  const toggleDropdown = () => {
    setVisible(!isVisible);
  };
  return (
    <HeaderWrapper type="flex" align="middle">
      <Col span={12}>
        <Logo />
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
              <img src={Profile} alt="Profile" />
              <UserInfo>
                <UserName>{userName}</UserName>
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

export default Header;

const HeaderWrapper = styled(Row)`
  padding: 16px 24px;
  border-bottom: 1px ${lightGrey4} solid;
  span {
    font-size: 12px;
    margin-right: 20px;
  }
`;
const Logo = styled(IconHeader)`
  width: 119px;
  height: 21px;
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
    width: 180px;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0px 25px 0px 60px;
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
