import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { withMathFormula } from "../HOC/withMathFormula";

const Style = css`
  background: transparent !important;
  font-family: ${props => props.theme.defaultFontFamily} !important;
  font-size: ${props => props.theme.questionTextnormalFontSize} !important;
  color: ${props => props.theme.titleColor} !important;
  font-weight: normal !important;
  font-style: normal !important;
  text-decoration: none;
`;

const MathSpan = withMathFormula(styled.span`
  ${Style}
`);

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
  padding-right: 20px;
  font-weight: 700;
  line-height: 20px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  text-decoration: none;
  color: #333333;
  cursor: pointer;

  :hover {
    color: #333333;
  }

  p {
    font-size: 15px;
  }

  span {
    font-weight: 500;
  }
  img {
    display: block;
    width: 200px;
    max-width: 100%;
  }
`;
