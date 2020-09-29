import { eastBaycolor, lightGrey4, mainTextColor, white } from "@edulastic/colors";
import { OnWhiteBgLogo } from "@edulastic/common";
import { Col, Dropdown, Icon as AntIcon, Menu, Row } from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const menu = (
  <Menu>
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
  </Menu>
);
const Header = ({ user }) => {
  const [isVisible, setVisible] = useState(false);
  const toggleDropdown = () => {
    setVisible(!isVisible);
  };
  const userInfo = get(user, "user", {});
  const { firstName, lastName, middleName, role } = userInfo;
  const userName = `${firstName} ${middleName || "b"} ${lastName || "c"}`;

  const getInitials = () => {
    if (firstName && lastName) return `${firstName[0] + lastName[0]}`;
    if (firstName) return `${firstName.substr(0, 2)}`;
    if (lastName) return `${lastName.substr(0, 2)}`;
  };

  return (
    <HeaderWrapper type="flex" align="middle">
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

export default connect(
  state => ({
    user: state.user
  })
)(Header);

const HeaderWrapper = styled(Row)`
  padding: 16px 24px;
  border-bottom: 1px ${lightGrey4} solid;
  span {
    font-size: 12px;
    margin-right: 20px;
  }
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
`;

const UserType = styled.div`
  font-size: 12px;
`;

const IconDropdown = styled(AntIcon)`
  color: ${mainTextColor};
  position: absolute;
  top: -10px;
`;
