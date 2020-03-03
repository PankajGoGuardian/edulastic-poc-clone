import React from "react";
import { Link } from "react-router-dom";

import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import ButtonComponent from "../../../AssignmentCreate/common/ButtonComponent";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";

import { SnapQuiz } from "./styled";
import { EduButton } from "@edulastic/common";

const descriptionBottom = `
  Upload your assessment in PDF format and proceed to create an Edulastic Assessment
`;

const OptionPDF = () => (
  <CardComponent ml="25px">
    <IconWrapper>
      <SnapQuiz>
        <span>Snap</span>Quiz
      </SnapQuiz>
    </IconWrapper>
    <TitleWrapper>Create from PDF</TitleWrapper>

    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to="/author/tests/snapquiz">
      <EduButton isGhost width="234px">
        UPLOAD PDF
      </EduButton>
    </Link>
  </CardComponent>
);

export default OptionPDF;
