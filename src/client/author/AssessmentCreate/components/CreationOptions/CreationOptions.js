import React from "react";
import PropTypes from "prop-types";

import OptionPDF from "../OptionPDF/OptionPDF";
import OptionScratch from "../OptionScratch/OptionScratch";
import BodyWrapper from "../../../AssignmentCreate/common/BodyWrapper";
import FlexWrapper from "../../../AssignmentCreate/common/FlexWrapper";
import OptionQti from "../OptionQTI/OptionQTI";

const CreationOptions = ({ onUploadPDF }) => (
  <BodyWrapper>
    <FlexWrapper marginBottom="0px">
      <OptionScratch />
      <OptionPDF onClick={onUploadPDF} />
      {/* <OptionQti /> */}
    </FlexWrapper>
  </BodyWrapper>
);

CreationOptions.propTypes = {
  onUploadPDF: PropTypes.func.isRequired
};

export default CreationOptions;
