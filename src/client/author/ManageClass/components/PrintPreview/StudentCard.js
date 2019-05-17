import React from "react";
import { white } from "@edulastic/colors";
import PropTypes from "prop-types";
import Title from "./Title";
import { StyledCard, BoldText, ParaP, StudnetName, UserInfo } from "./styled";

const StudentCard = ({ student: { firstName, lastName, email }, code }) => (
  <StyledCard>
    <Title bgColor={white} align="center" />
    <ParaP>
      <BoldText>Student Name</BoldText>
    </ParaP>
    <ParaP>
      <StudnetName>{`${firstName} ${lastName}`} </StudnetName>
    </ParaP>
    <UserInfo>
      <div>
        <BoldText>Username: </BoldText> <span>{email}</span>
      </div>
      <div>
        <BoldText>Password: </BoldText> <span>{code}</span>
      </div>
    </UserInfo>
    <ParaP>
      <a href="https://app.edulastic.com/login">https://app.edulastic.com/login</a>
    </ParaP>
  </StyledCard>
);

StudentCard.propTypes = {
  student: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired
};

export default StudentCard;
