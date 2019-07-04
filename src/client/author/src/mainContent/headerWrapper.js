import React, { memo, Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { mobileWidth, extraDesktopWidthMax } from "@edulastic/colors";
import { Affix } from "antd";
import DragScroll, { UPWARDS, DOWNWARDS } from "@edulastic/common/src/components/DragScroll";
import ScrollContext from "@edulastic/common/src/contexts/ScrollContext";

class HeaderWrapper extends Component {
  render = () => {
    const { children, type } = this.props;

    return (
      <HeaderContainer type={type}>
        <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
          <Container type={type}>{children}</Container>
          <ScrollContext.Consumer>
            {context => (
              <Fragment>
                <DragScroll
                  context={context}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                  }}
                  direction={UPWARDS}
                />
                <DragScroll
                  context={context}
                  style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 50
                  }}
                  direction={DOWNWARDS}
                />
              </Fragment>
            )}
          </ScrollContext.Consumer>
        </Affix>
      </HeaderContainer>
    );
  };
}

HeaderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string
};

HeaderWrapper.defaultProps = {
  type: "default"
};

export default memo(HeaderWrapper);

const HeaderContainer = styled.div`
  padding-top: 96px;

  @media (max-width: ${mobileWidth}) {
    padding-top: ${props => (props.type === "standard" ? "121px" : "62px")};
    margin-bottom: ${props => (props.type === "standard" ? "26px" : "33px")};
  }

  @media print {
    padding-top: 0px;
  }
`;

const Container = styled.div`
  height: 96px;
  padding: 0px 20px;
  background: ${props => props.theme.header.headerBgColor};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 0px 45px;
  }

  @media (max-width: ${mobileWidth}) {
    height: ${props => (props.type === "standard" ? "auto" : "61px")};
    padding: 16px 26px;
  }
`;
