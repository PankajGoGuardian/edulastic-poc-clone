import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { IconLogout } from "@edulastic/icons";

const LogoutButton = styled(Button)`
  position: fixed;
  right: 20px;
  top: 20px;
  span {
    margin-left: 5px;
  }
`;

export default function Logout({ logoutAction }) {
  return (
    <LogoutButton size="large" onClick={logoutAction}>
      <IconLogout />
      <span>Log out</span>
    </LogoutButton>
  );
}
