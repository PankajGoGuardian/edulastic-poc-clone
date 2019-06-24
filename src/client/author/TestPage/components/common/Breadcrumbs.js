import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { blue, darkBlue } from "@edulastic/colors";
import { navButtonsTest } from "../TestPageHeader/TestPageHeader";

const getCurrentText = current => {
  const currentItem = navButtonsTest.find(btn => btn.value === current);
  if (currentItem) {
    return currentItem.text;
  }

  return "";
};

const Breadcrumbs = ({ current, style }) => (
  <Title style={style}>
    {"<"} <BackLink to="/author/tests">Test Library</BackLink> / {getCurrentText(current)}
  </Title>
);

Breadcrumbs.propTypes = {
  current: PropTypes.string.isRequired,
  style: PropTypes.object
};

Breadcrumbs.defaultProps = {
  style: {}
};

export default Breadcrumbs;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${blue};
  text-transform: uppercase;
  margin-bottom: 25px;
`;

const BackLink = styled(Link)`
  color: ${blue};
  :hover {
    color: ${darkBlue};
  }
`;
