import React, { memo, Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { mobileWidth, desktopWidth, mediumDesktopWidth } from "@edulastic/colors";
import { Affix } from "antd";
import DragScroll, { UPWARDS, DOWNWARDS } from "@edulastic/common/src/components/DragScroll";
import ScrollContext from "@edulastic/common/src/contexts/ScrollContext";

class HeaderWrapper extends Component {
  render = () => {
    const { children, type, justify } = this.props;

    return (
      <HeaderContainer type={type}>
        <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
          <Container justify={justify} type={type}>
            {children}
          </Container>
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
  }

  @media (max-width: ${mediumDesktopWidth}) {
    padding-top: 60px;
  }

  @media print {
    padding-top: 0px;
  }
`;

const Container = styled.div`
  height: 96px;
  padding: 0px 30px;
  background: ${props => props.theme.header.headerBgColor};
  display: flex;
  justify-content: ${({ justify }) => justify || "space-between"};
  align-items: center;

  @media (max-width: ${mediumDesktopWidth}) {
    height: 60px;
  }

  @media (max-width: ${desktopWidth}) {
    padding: 0px 20px;
  }
`;
