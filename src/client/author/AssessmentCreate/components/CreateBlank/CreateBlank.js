import React from "react";
import PropTypes from "prop-types";

import { IconNewFile } from "@edulastic/icons";

import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import ButtonComponent from "../../../AssignmentCreate/common/ButtonComponent";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";

const handleDrop = event => {
  //TODO handle drop here
  event.preventDefault();
};

const CreateBlank = ({ onCreate, loading }) => (
  <CardComponent childMarginRight="0" onDrop={handleDrop} blank>
    <IconWrapper>
      <IconNewFile style={{ height: "44px", width: "34px", transform: "scaleY(-1)" }} />
    </IconWrapper>
    <TitleWrapper>Answer Only Assessment</TitleWrapper>
    <TextWrapper style={{ padding: "0 40px" }}>Want to create an assessment with no content?</TextWrapper>
    <ButtonComponent type="primary" disabled={loading} onClick={onCreate} block>
      Continue with blank
    </ButtonComponent>
  </CardComponent>
);

CreateBlank.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default CreateBlank;
