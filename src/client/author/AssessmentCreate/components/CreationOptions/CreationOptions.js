import React from "react";
import PropTypes from "prop-types";

import OptionPDF from "../OptionPDF/OptionPDF";
import OptionScratch from "../OptionScratch/OptionScratch";
import BodyWrapper from "../../../AssignmentCreate/common/BodyWrapper";
import FlexWrapper from "../../../AssignmentCreate/common/FlexWrapper";
const CreationOptions = ({ onUploadPDF }) => (
  <BodyWrapper>
    <FlexWrapper>
      <OptionScratch />
      <OptionPDF onClick={onUploadPDF} />
    </FlexWrapper>
  </BodyWrapper>
);

CreationOptions.propTypes = {
  onUploadPDF: PropTypes.func.isRequired
};

export default CreationOptions;
