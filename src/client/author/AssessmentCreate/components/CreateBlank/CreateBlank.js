import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";

import { IconBookmark } from "@edulastic/icons";
import { grey } from "@edulastic/colors";

import PaperTitle from "../common/PaperTitle";
import { Description, CreateBlankContainer } from "./styled";

const iconStyles = {
  minWidth: "100%",
  minHeight: "77px",
  fill: grey,
  marginBottom: "20px"
};

const handleDrop = event => event.preventDefault();

const CreateBlank = ({ onCreate }) => (
  <CreateBlankContainer childMarginRight="0" onDrop={handleDrop}>
    <IconBookmark style={iconStyles} />
    <PaperTitle>Answer Only Assessment</PaperTitle>
    <Description>Want to create an assessment with no content?</Description>
    <Button type="primary" onClick={onCreate} block>
      Continue with blank
    </Button>
  </CreateBlankContainer>
);

CreateBlank.propTypes = {
  onCreate: PropTypes.func.isRequired
};

export default CreateBlank;
