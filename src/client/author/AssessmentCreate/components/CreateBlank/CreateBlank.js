import { EduButton } from "@edulastic/common";
import { IconNewFile } from "@edulastic/icons";
import PropTypes from "prop-types";
import React from "react";
import CardComponent from "../../../AssignmentCreate/common/CardComponent";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";

const handleDrop = event => {
  // TODO handle drop here
  event.preventDefault();
};

const CreateBlank = ({ onCreate, loading }) => (
  <CardComponent childMarginRight="0" onDrop={handleDrop} blank>
    <IconWrapper>
      <IconNewFile style={{ height: "44px", width: "34px", transform: "scaleY(-1)" }} />
    </IconWrapper>
    <TitleWrapper>Answer Only Assessment</TitleWrapper>
    <TextWrapper style={{ padding: "0 40px" }}>Want to create an assessment with no content?</TextWrapper>
    <EduButton type="primary" width="234px" height="45px" disabled={loading} onClick={onCreate}>
      Continue with blank
    </EduButton>
  </CardComponent>
);

CreateBlank.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default CreateBlank;
