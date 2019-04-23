import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { newBlue, mobileWidth } from "@edulastic/colors";
import { Affix } from "antd";

const HeaderWrapper = ({ children, type }) => (
  <HeaderContainer type={type}>
    <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
      <Container type={type}>{children}</Container>
    </Affix>
  </HeaderContainer>
);

HeaderWrapper.propTypes = {
  children: PropTypes.array.isRequired,
  type: PropTypes.string
};

HeaderWrapper.defaultProps = {
  type: "default"
};

export default memo(HeaderWrapper);

const HeaderContainer = styled.div`
  padding-top: 96px;

  @media (max-width: ${mobileWidth}) {
    padding-top: ${props => (props.type === "questionEditing" ? "138px" : "62px")};
    margin-bottom: ${props => (props.type === "questionEditing" ? "26px" : "33px")};
  }
`;

const Container = styled.div`
  height: 96px;
  padding: 0px 45px;
  background: ${newBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${mobileWidth}) {
    height: ${props => (props.type === "questionEditing" ? "138px" : "61px")};
    padding: 16px 26px;
  }
`;
