import React from "react";
import { connect } from "react-redux";
import { Layout, Menu, Icon } from "antd";
import { ThemeProvider } from "styled-components";
import { ErrorHandler } from "@edulastic/common";
import { Route, Switch, Redirect } from "react-router-dom";
import { themes } from "../theme";
import Sider from "./Common/Sider";
import { LogoCompact, Logo, Button, MainDiv } from "./Common/StyledComponents";
import CleverSearch from "./Containers/CleverSearch";
import ProxyUser from "./Components/ProxyUser";
import UpgradeUser from "./Containers/UpgradeUser";
import { logoutAction } from "../author/src/actions/auth";
import Logout from "./Common/Logout";
import ApiForm from "./Containers/ApiForm";

const siderMenuData = [
  {
    icon: "pie-chart",
    label: "clever search",
    href: "/admin/search"
  },
  {
    icon: "team",
    label: "proxy",
    href: "/admin/proxyUser"
  },
  {
    icon: "team",
    label: "Upgrade Plan",
    href: "/admin/upgrade"
  },
  {
    icon: "team",
    label: "Api Forms",
    href: "/admin/apiForms"
  }
];

function Admin({ match, history, logoutAction, location }) {
  return (
    <ThemeProvider theme={themes.default}>
      <Layout style={{ minHeight: "100vh" }}>
        <Logout logoutAction={logoutAction} />
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
                <Menu theme="light" defaultSelectedKeys={[location.pathname]} mode="inline">
                  {siderMenuData.map(item => (
                    <Menu.Item
                      onClick={() => {
                        toggleState(false);
                        if (item.href) {
                          history.push(item.href);
                        }
                      }}
                      key={item.href}
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
          <ErrorHandler>
            <Switch>
              <Redirect exact path={match.path} to={`${match.path}/search`} />
              <Route path={`${match.path}/search`} component={CleverSearch} />
              <Route path={`${match.path}/proxyUser`} component={ProxyUser} />
              <Route path={`${match.path}/upgrade`} component={UpgradeUser} />
              <Route path={`${match.path}/apiForms`} component={ApiForm} />
            </Switch>
          </ErrorHandler>
        </MainDiv>
      </Layout>
    </ThemeProvider>
  );
}

const withConnect = connect(
  null,
  {
    logoutAction
  }
)(Admin);

export default withConnect;
