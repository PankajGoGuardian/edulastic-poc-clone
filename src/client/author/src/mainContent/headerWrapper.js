import React, { memo, Component, createRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { newBlue, mobileWidth, extraDesktopWidthMax } from "@edulastic/colors";
import { Affix } from "antd";

class HeaderWrapper extends Component {
  containerRef = createRef();

  dragToScrollUp = () => {
    window.scrollBy(0, -1);
  };

  componentDidMount() {
    /** @type {HTMLElement} */
    const containerEl = this.containerRef.current;
    containerEl.addEventListener("dragover", this.dragToScrollUp);
  }

  componentWillUnmount() {
    /** @type {HTMLElement} */
    const containerEl = this.containerRef.current;
    containerEl.removeEventListener("dragover", this.dragToScrollUp);
  }

  render = () => {
    const { children, type } = this.props;

    return (
      <HeaderContainer innerRef={this.containerRef} type={type}>
        <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
          <Container type={type}>{children}</Container>
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
`;

const Container = styled.div`
  height: 96px;
  padding: 0px 20px;
  background: ${newBlue};
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
