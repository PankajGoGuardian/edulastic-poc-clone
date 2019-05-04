import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Route, Switch } from "react-router-dom";
import Sider from "./Common/Sider";
import { LogoCompact, Logo, Button, MainDiv } from "./Common/StyledComponents";
import CleverSearch from "./Containers/CleverSearch";
import ProxyUser from "./Components/ProxyUser";

export default function Admin({ match, history }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider role="navigation">
        {([state, toggleState]) => {
          return (
            <div>
              <Button
                aria-label={`${state ? "Open" : "Close"} sidebar`}
                onClick={() => toggleState(val => !val)}
                noStyle
                style={{ minHeight: "60px" }}
              >
                {state ? <LogoCompact /> : <Logo />}
              </Button>
              <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
                {siderMenuData.map(item => (
                  <Menu.Item
                    onClick={() => {
                      toggleState(false);
                      if (item.href) {
                        history.push(item.href);
                      }
                    }}
                    key={item.id}
                  >
                    <Icon title={item.label} type={item.icon} />
                    <span>{item.label}</span>
                  </Menu.Item>
                ))}
              </Menu>
            </div>
          );
        }}
      </Sider>
      <MainDiv>
        <Switch>
          <Route path={`${match.url}/search`} component={CleverSearch} />
          <Route path={`${match.url}/proxyUser`} component={ProxyUser} />
        </Switch>
      </MainDiv>
    </Layout>
  );
}

export const siderMenuData = [
  {
    icon: "pie-chart",
    id: "pie-chart",
    label: "clever search",
    href: "/admin/search"
  },
  {
    icon: "team",
    id: "team",
    label: "proxy",
    href: "/admin/proxyUser"
  }
];
