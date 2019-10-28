import React from "react";
import PropTypes from "prop-types";

import { IconBookmark } from "@edulastic/icons";

import PaperTitle from "../common/PaperTitle";
import { Container } from "./styled";
import { UploadDescription } from "../CreateUpload/styled";
import { Button } from "antd";

const handleDrop = event => {
  //TODO handle drop here
  event.preventDefault();
};

const CreateBlank = ({ onCreate, loading }) => (
  <Container childMarginRight="0" onDrop={handleDrop} blank>
    <IconBookmark width="45px" height="45px" />
    <PaperTitle>Answer Only Assessment</PaperTitle>
    <UploadDescription>Want to create an assessment with no content?</UploadDescription>
    <Button type="primary" disabled={loading} onClick={onCreate}>
      Continue with blank
    </Button>
  </Container>
);

CreateBlank.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default CreateBlank;
