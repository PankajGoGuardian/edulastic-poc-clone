import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { IconNewFile } from "@edulastic/icons";

import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import ButtonComponent from "../../../AssignmentCreate/common/ButtonComponent";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";

const descriptionBottom = `
  Select questions from the library or author your own.
`;

const OptionScratch = () => (
  <CardComponent>
    <IconWrapper>
      <IconNewFile style={{ height: "60px", width: "50px" }} />
    </IconWrapper>
    <TitleWrapper>Create from Scratch</TitleWrapper>
    <TextWrapper>{descriptionBottom}</TextWrapper>
    <Link to="/author/tests/create">
      <ButtonComponent type="primary" block>
        CREATE TEST
      </ButtonComponent>
    </Link>
  </CardComponent>
);

OptionScratch.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default OptionScratch;
