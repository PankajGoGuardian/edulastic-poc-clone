import { EduButton } from "@edulastic/common";
import React from "react";
import { Link } from "react-router-dom";
import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import { SnapQuiz } from "./styled";

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
