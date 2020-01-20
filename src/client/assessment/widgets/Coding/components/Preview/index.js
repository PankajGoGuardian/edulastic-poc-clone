import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";
import { setQuestionDataAction } from "../../../../../author/QuestionEditor/ducks";
import { PREVIEW } from "../../../../constants/constantsForQuestions";
import DisplayQuestion from "./DisplayQuestion";
import DisplayEditor from "./DisplayEditor";

import { loadModeSpecificfiles } from "../../ace";

import { StyledPreviewContainer, StyledDivider } from "./styled";

class Preview extends React.Component {
  componentDidMount() {
    this.props.question.languages.forEach(lang => {
      loadModeSpecificfiles(lang)
        .then(() => {})
        .catch(() => {});
    });
  }

  handleAddAnswer = (lang, value) => {
    const { saveAnswer, userAnswer } = this.props;
    saveAnswer([
      {
        lang,
        value: value || userAnswer.value
      }
    ]);
  };

  formatCodeStubs = data => {
    const item = cloneDeep(data);
    const { userAnswer, view } = this.props;

    if (view === PREVIEW && !!userAnswer.length) {
      const answer = userAnswer[0];
      const codeStub = item.codeStubs.find(cs => cs.lang === answer.lang);
      if (codeStub) {
        item.codeStubs = item.codeStubs.map(cs => {
          if (cs.lang.toLowerCase() === answer.lang.toLowerCase()) {
            cs.code = answer.value || cs.code;
          }
          return cs;
        });
      } else {
        item.codeStubs.push({ code: answer.value, lang: answer.lang });
      }
    }
    return item;
  };

  render() {
    const {
      question: { stimulus, stimulusBody, layout, ...item },
      setQuestionData
    } = this.props;

    const flexDirection = layout === "left/right" ? "row" : "column";
    return (
      <StyledPreviewContainer flexDirection={flexDirection}>
        <DisplayQuestion stimulus={stimulus} stimulusBody={stimulusBody} layout={flexDirection} />
        <StyledDivider />
        <DisplayEditor
          item={this.formatCodeStubs(item)}
          setQuestionData={setQuestionData}
          onChange={this.handleAddAnswer}
          onChangeLang={this.handleAddAnswer}
          layout={flexDirection}
        />
      </StyledPreviewContainer>
    );
  }
}

const enhance = compose(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(Preview);
