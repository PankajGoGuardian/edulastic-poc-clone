import React from "react";
import PropTypes from "prop-types";

import snapwizQuiz from "../../../src/assets/snap-quiz.png";
import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import ButtonComponent from "../../../AssignmentCreate/common/ButtonComponent";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";
const descriptionBottom = `
  Upload your assessment in PDF format and proceed to create an Edulastic Assessment
`;

const OptionPDF = ({ onClick }) => (
  <CardComponent>
    <IconWrapper>
      <img src={snapwizQuiz} />
    </IconWrapper>
    <TitleWrapper>Create from PDF</TitleWrapper>

    <TextWrapper>{descriptionBottom}</TextWrapper>
    <ButtonComponent type="primary" onClick={onClick} block>
      Upload PDF
    </ButtonComponent>
  </CardComponent>
);

OptionPDF.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default OptionPDF;
