import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { darkBlue, lightBlueSecondary } from "@edulastic/colors";
import { withMathFormula } from "../HOC/withMathFormula";

const MathSpan = withMathFormula(styled.span``);

const MoveLink = ({ onClick, children }) => (
  <Link onClick={onClick}>
    <MathSpan dangerouslySetInnerHTML={{ __html: children }} />
  </Link>
);

MoveLink.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired
};

export default MoveLink;

const Link = styled.a`
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  text-decoration: none;
  color: ${lightBlueSecondary};
  cursor: pointer;

  :hover {
    color: ${darkBlue};
  }

  p {
    font-size: 15px !important;
  }

  span {
    font-size: 15px;
    font-weight: 500;
    max-width: 470px;
  }
  img {
    display: block;
    max-width: 300px;
  }
`;
