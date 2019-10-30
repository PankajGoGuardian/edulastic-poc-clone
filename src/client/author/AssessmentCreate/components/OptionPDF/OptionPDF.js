import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import ButtonComponent from "../../../AssignmentCreate/common/ButtonComponent";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";

import { SnapQuiz } from "./styled";

const descriptionBottom = `
  Upload your assessment in PDF format and proceed to create an Edulastic Assessment
`;

const OptionPDF = ({ onClick }) => (
  <CardComponent>
    <IconWrapper>
      <SnapQuiz>
        <span>Snap</span>Quiz
      </SnapQuiz>
    </IconWrapper>
    <TitleWrapper>Create from PDF</TitleWrapper>

    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to={"/author/tests/snapquiz"}>
      <ButtonComponent type="primary" block>
        Upload PDF
      </ButtonComponent>
    </Link>
  </CardComponent>
);

OptionPDF.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default OptionPDF;
