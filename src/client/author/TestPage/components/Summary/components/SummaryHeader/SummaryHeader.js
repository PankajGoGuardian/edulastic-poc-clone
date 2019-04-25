import React from "react";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";

import { Photo } from "../../../common";
import { Container, Avatar, AvatarContainer, CreatedByTitle, CreatedByValue } from "./styled";

const SummaryHeader = ({ createdBy, windowWidth }) => {
  const avatar = createdBy && createdBy.firstName ? createdBy.firstName[0] : "E";
  return (
    <Container>
      <Photo height={windowWidth > 993 ? 240 : 100} windowWidth={windowWidth} />
      <AvatarContainer>
        <FlexContainer alignItems="center">
          <Avatar>{avatar}</Avatar>
          <FlexContainer flexDirection="column" justifyContent="space-between" alignItems="flex-start">
            <CreatedByTitle style={{ marginRight: 0 }}>Created by:</CreatedByTitle>
            <CreatedByValue>
              {createdBy && createdBy.firstName} {createdBy && createdBy.lastName}
            </CreatedByValue>
          </FlexContainer>
        </FlexContainer>
      </AvatarContainer>
    </Container>
  );
};

SummaryHeader.propTypes = {
  createdBy: PropTypes.shape({
    firstName: PropTypes.array
  }).isRequired,
  windowWidth: PropTypes.number.isRequired
};

export default SummaryHeader;
