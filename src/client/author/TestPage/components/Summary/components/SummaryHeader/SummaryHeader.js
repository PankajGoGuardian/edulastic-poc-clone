import React from "react";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";

import { Photo } from "../../../common";
import { Container, Avatar, AvatarContainer, CreatedByTitle, CreatedByValue } from "./styled";

const SummaryHeader = ({ createdBy, windowWidth, onChangeField, thumbnail }) => {
  const avatar = createdBy && createdBy.firstName ? createdBy.firstName[0] : "E";
  return (
    <Container>
      <Photo
        height={windowWidth > 993 ? 165 : 120}
        windowWidth={windowWidth}
        onChangeField={onChangeField}
        url={thumbnail}
      />
    </Container>
  );
};

SummaryHeader.propTypes = {
  createdBy: PropTypes.shape({
    firstName: PropTypes.string
  }).isRequired,
  windowWidth: PropTypes.number.isRequired,
  onChangeField: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired
};

export default SummaryHeader;
