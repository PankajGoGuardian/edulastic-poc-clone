import React from "react";
import PropTypes from "prop-types";

import OptionPDF from "../OptionPDF/OptionPDF";
import OptionScratch from "../OptionScratch/OptionScratch";
import BodyWrapper from "../../../AssignmentCreate/common/BodyWrapper";
import ContainerWrapper from "../../../AssignmentCreate/common/ContainerWrapper";
import FlexWrapper from "../../../AssignmentCreate/common/FlexWrapper";
const CreationOptions = ({ onUploadPDF }) => (
  <ContainerWrapper>
    <BodyWrapper>
      <FlexWrapper>
        <OptionScratch />
        <OptionPDF onClick={onUploadPDF} />
      </FlexWrapper>
    </BodyWrapper>
  </ContainerWrapper>
);

CreationOptions.propTypes = {
  onUploadPDF: PropTypes.func.isRequired
};

export default CreationOptions;
