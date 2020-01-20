import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";

import ComposeQuestion from "./ComposeQuestion";
import TestCases from "./TestCases";
import LanguageSection from "./LanguageSection";
import CodeStub from "./CodeStub";

const Authoring = ({ t, item, setQuestionData, fillSections, cleanSections, fontSize }) => {
  return (
    <div>
      <PaddingDiv bottom={0}>
        <ComposeQuestion
          item={item}
          fillSections={fillSections}
          setQuestionData={setQuestionData}
          cleanSections={cleanSections}
          fontSize={fontSize}
        />
        <TestCases
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
          setQuestionData={setQuestionData}
          fontSize={fontSize}
        />
        <LanguageSection
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
          setQuestionData={setQuestionData}
          fontSize={fontSize}
        />
        <CodeStub
          item={item}
          fillSections={fillSections}
          cleanSections={cleanSections}
          setQuestionData={setQuestionData}
          fontSize={fontSize}
        />
      </PaddingDiv>
    </div>
  );
};

Authoring.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Authoring.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Authoring);
