import React, { memo, useState } from "react";
import PropTypes from "prop-types";

import { EduButton, FlexContainer, QuestionTitle } from "@edulastic/common";

import { Wrapper } from "./styled/Wrapper";
import ProtractorImg from "./assets/protractor.svg";
import Rule from "./Rule";

const ProtractorView = ({ item, smallSize, showQuestionNumber }) => {
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
        <EduButton onClick={() => setShow(!show)} size="large">
          <FlexContainer>
            <img src={item.image ? item.image : ProtractorImg} alt="" width={16} height={16} />
            <QuestionTitle show={showQuestionNumber} label={item.qLabel} stimulus={item.label} />
          </FlexContainer>
        </EduButton>
      )}
      {renderRule()}
    </Wrapper>
  );
};

ProtractorView.propTypes = {
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  showQuestionNumber: PropTypes.bool
};

ProtractorView.defaultProps = {
  smallSize: false,
  showQuestionNumber: false
};

export default memo(ProtractorView);
