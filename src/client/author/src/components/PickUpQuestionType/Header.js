import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { mobileWidth, darkBlueSecondary, white } from "@edulastic/colors";
import Breadcrumb from "../Breadcrumb";

const Header = ({ title }) => {
  const breadcrumbData = [
    {
      title: "ITEM LIST",
      to: "/author/items"
    },
    {
      title: "ITEM DETAIL",
      to: `/author/items/${window.location.pathname.split("/")[3]}/item-detail`
    },
    {
      title: "SELECT A QUESTION TYPE",
      to: ""
    }
  ];
  return (
    <Container>
      <FlexContainer alignItems="flex-start">
        <Title>{title}</Title>
      </FlexContainer>
      <Breadcrumb data={breadcrumbData} />
    </Container>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired
};

export default Header;

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  margin-bottom: 70px;
  background: ${darkBlueSecondary};
  padding: 0px 40px;
  height: 62px;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
  }
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: ${white};
`;
