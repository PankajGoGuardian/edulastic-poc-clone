import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Route, Switch } from "react-router-dom";
import Sider from "./Common/Sider";
import { LogoCompact, Logo, Button } from "./Common/Styled-Components";
import CleverSearch from "./Containers/CleverSearch";
import { siderMenuData } from "./Data";

export default function Admin({ match }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider role="navigation">
        {([state, toggleState]) => {
          return (
            <div onClick={() => toggleState(val => !val)}>
              <Button aria-label={`${state ? "Open" : "Close"} sidebar`} noStyle style={{ minHeight: "60px" }}>
                {state ? <LogoCompact /> : <Logo />}
              </Button>
              <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
                {siderMenuData.map(item => (
                  <Menu.Item key={item.id}>
                    <Icon title={item.label} type={item.icon} />
                    <span>{item.label}</span>
                  </Menu.Item>
                ))}
              </Menu>
            </div>
          );
        }}
      </Sider>
      <div>
        <Switch>
          <Route path={`${match.url}/search`} component={CleverSearch} />
        </Switch>
      </div>
    </Layout>
  );
}
