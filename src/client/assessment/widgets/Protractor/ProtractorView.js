import React, { memo, useState } from "react";
import PropTypes from "prop-types";

import { FlexContainer, QuestionNumberLabel } from "@edulastic/common";

import { Wrapper } from "./styled/Wrapper";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import ProtractorImg from "./assets/protractor.svg";
import Rule from "./Rule";
import { CustomStyleBtn } from "../../styled/ButtonStyles";

const ProtractorView = ({ item, smallSize, showQuestionNumber, qIndex }) => {
  const [show, setShow] = useState(false);

  const renderRule = () => {
    if (item.button && !show) {
      return null;
    }
    return <Rule smallSize={smallSize} showRotate={item.rotate} width={item.width} height={item.height} />;
  };

  return (
    <Wrapper smallSize={smallSize}>
      {item.button && (
        <CustomStyleBtn width="auto" onClick={() => setShow(!show)} size="large">
          <FlexContainer>
            <img src={item.image ? item.image : ProtractorImg} alt="" height={16} style={{ marginRight: "10px" }} />
            <QuestionTitleWrapper>
              {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
              <span>{item.label}</span>
            </QuestionTitleWrapper>
          </FlexContainer>
        </CustomStyleBtn>
      )}
      {renderRule()}
    </Wrapper>
  );
};

ProtractorView.propTypes = {
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

ProtractorView.defaultProps = {
  smallSize: false,
  showQuestionNumber: false,
  qIndex: null
};

export default memo(ProtractorView);
