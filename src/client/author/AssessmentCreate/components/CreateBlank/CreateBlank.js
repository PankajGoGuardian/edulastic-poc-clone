import React from "react";
import PropTypes from "prop-types";
import { IconNewFile } from "@edulastic/icons";
import { Button } from "antd";
import { Container } from "./styled";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";

const handleDrop = event => {
  //TODO handle drop here
  event.preventDefault();
};

const CreateBlank = ({ onCreate, loading }) => (
  <Container childMarginRight="0" onDrop={handleDrop} blank>
    <IconWrapper>
      <IconNewFile style={{ height: "44px", width: "34px", transform: "scaleY(-1)" }} />
    </IconWrapper>
    <TitleWrapper>Answer Only Assessment</TitleWrapper>
    <TextWrapper>
      Want to create an assessment with <br /> no content?
    </TextWrapper>
    <Button type="primary" disabled={loading} onClick={onCreate}>
      Continue with blank
    </Button>
  </Container>
);

CreateBlank.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default CreateBlank;
