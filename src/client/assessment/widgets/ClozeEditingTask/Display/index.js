import PropTypes from "prop-types";
import React, { Component } from "react";
import produce from "immer";
import { isUndefined, mapValues, cloneDeep, findIndex, find, orderBy } from "lodash";
import { withTheme } from "styled-components";
import JsxParser from "react-jsx-parser";

import {
  helpers,
  Stimulus,
  DragDrop,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionContentWrapper,
  QuestionSubLabel
} from "@edulastic/common";

import ChoiceBoxLayout from "./ChoiceBoxLayout";
import CorrectAnswerBoxLayout from "./CorrectAnswerBoxLayout";
import CheckboxTemplateBoxLayout from "./CheckboxTemplateBoxLayout";
import DragDropValues from "./ChoiceBoxLayout/DragDrop/DragDropValues";

import DisplayOptions from "../../ClozeImageDropDown/QuestionOptions";
import { getFontSize } from "../../../utils/helpers";
import { withCheckAnswerButton } from "../../../components/HOC/withCheckAnswerButton";
import MathSpanWrapper from "../../../components/MathSpanWrapper";
import Instructions from "../../../components/Instructions";
import { ContentWrapper } from "../styled/ContentWrapper";
import { QuestionTitleWrapper } from "../styled/QuestionTitleWrapper";
import { EDIT } from "../../../constants/constantsForQuestions";
import { displayStyles } from "../constants";

const { DragPreview } = DragDrop;
class EditingTypeDisplay extends Component {
  state = {
    parsedTemplate: ""
  };

  static getDerivedStateFromProps({ stimulus }) {
    return { parsedTemplate: helpers.parseTemplate(stimulus) };
  }

  componentDidMount() {
    const { stimulus } = this.props;
    this.setState({ parsedTemplate: helpers.parseTemplate(stimulus) });
  }

  selectChange = (value, index, id) => {
    const {
      onChange: changeAnswers,
      userSelections,
      item: { responseIds }
    } = this.props;
    changeAnswers(
      produce(userSelections, draft => {
        // answers are null for all the lower indices if a higher index is answered
        // TODO fix the way answers are stored
        const changedIndex = findIndex(draft, (answer = {}) => answer?.id === id);
        draft[index] = value;
        if (changedIndex !== -1) {
          draft[changedIndex] = { value, index, id };
        } else {
          const response = find(responseIds, res => res.id === id);
          draft[response.index] = { value, index, id };
        }
      })
    );
  };

  shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  shuffleGroup = data =>
    mapValues(data, (value, key) => {
      if (!isUndefined(value)) {
        data[key] = this.shuffle(value);
      }
      data[key] = value;
      return data[key];
    });

  getBtnStyle = () => {
    const { uiStyle } = this.props;
    const btnStyle = {
      width: uiStyle.widthpx !== 0 ? uiStyle.widthpx : "auto",
      height: uiStyle.heightpx !== 0 ? uiStyle.heightpx : "auto"
    };

    return { btnStyle };
  };

  get evaluation() {
    const { item, evaluation } = this.props;

    return item?.activity?.evaluation || evaluation;
  }

  get userSelections() {
    const { item, userSelections } = this.props;
    return item?.activity?.userResponse || userSelections;
  }

  get hasAltAnswers() {
    const { item } = this.props;
    return item?.validation?.altResponses?.length;
  }

  get checkedAnswers() {
    const { showAnswer, checkAnswer, isPrint, isPrintPreview } = this.props;
    return showAnswer || checkAnswer || isPrint || isPrintPreview;
  }

  render() {
    const {
      qIndex,
      smallSize,
      question,
      preview,
      options,
      uiStyle,
      showAnswer,
      item,
      disableResponse,
      showQuestionNumber,
      isReviewTab,
      isExpressGrader,
      theme,
      previewTab,
      changePreviewTab,
      view,
      isPrint,
      isPrintPreview
    } = this.props;

    const { parsedTemplate } = this.state;
    const { shuffleOptions, responseIds, displayStyle } = item;
    let responses = cloneDeep(options);
    if (preview && shuffleOptions) {
      responses = this.shuffleGroup(responses);
    }
    // Layout Options
    const fontSize = theme.fontSize || getFontSize(uiStyle.fontsize, true);
    const { stemNumeration } = uiStyle;
    const { btnStyle } = this.getBtnStyle();

    const resProps = {
      item,
      uiStyle,
      btnStyle,
      options: responses,
      onChange: this.selectChange,
      disableResponse,
      isReviewTab,
      showAnswer,
      isPrint,
      isPrintPreview,
      previewTab,
      changePreviewTab,
      userSelections: this.userSelections,
      evaluation: this.evaluation
    };

    const displayOptions = orderBy(responseIds, ["index"]).map(option => options[option.id]);

    const dragDropValues = displayStyle?.type === displayStyles.DRAG_DROP && (
      <div style={{ width: "100%", marginTop: 8 }}>
        <DragDropValues choices={displayOptions} />
        <DragPreview />
      </div>
    );

    const questionContent = (
      <ContentWrapper view={view} fontSize={fontSize}>
        <JsxParser
          disableKeyGeneration
          bindings={{ resProps }}
          components={{
            response: this.checkedAnswers ? CheckboxTemplateBoxLayout : ChoiceBoxLayout,
            mathspan: MathSpanWrapper
          }}
          jsx={parsedTemplate}
        />
      </ContentWrapper>
    );

    return (
      <FlexContainer justifyContent="flex-start" alignItems="baseline" width="100%">
        <QuestionLabelWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
          {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
        </QuestionLabelWrapper>

        <QuestionContentWrapper>
          <QuestionTitleWrapper>
            {!!question && (
              <Stimulus qIndex={qIndex} smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
            )}
            {!question && questionContent}
          </QuestionTitleWrapper>
          {question && questionContent}
          {(isPrint || isPrintPreview) && <DisplayOptions options={displayOptions} style={{ marginTop: "50px" }} />}
          {view !== EDIT && <Instructions item={item} />}
          {(showAnswer || isExpressGrader) && (
            <React.Fragment>
              <CorrectAnswerBoxLayout
                fontSize={fontSize}
                groupResponses={options}
                userAnswers={item.validation.validResponse && item.validation.validResponse.value}
                responseIds={item.responseIds}
                stemNumeration={stemNumeration}
              />
              {this.hasAltAnswers ? (
                <CorrectAnswerBoxLayout
                  fontSize={fontSize}
                  groupResponses={options}
                  altResponses={item.validation.altResponses}
                  responseIds={item.responseIds}
                  stemNumeration={stemNumeration}
                />
              ) : null}
            </React.Fragment>
          )}
          {dragDropValues}
        </QuestionContentWrapper>
      </FlexContainer>
    );
  }
}

EditingTypeDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  isPrint: PropTypes.bool,
  stimulus: PropTypes.string,
  question: PropTypes.string.isRequired,
  evaluation: PropTypes.array,
  uiStyle: PropTypes.object,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool,
  qIndex: PropTypes.number,
  isExpressGrader: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  theme: PropTypes.object,
  view: PropTypes.string.isRequired
};

EditingTypeDisplay.defaultProps = {
  options: {},
  theme: {},
  onChange: () => {},
  preview: true,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  isPrint: false,
  stimulus: "",
  disableResponse: false,
  smallSize: false,
  uiStyle: {
    fontsize: "normal",
    stemNumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    placeholder: null,
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  isReviewTab: false,
  isExpressGrader: false,
  qIndex: null
};

export default withTheme(withCheckAnswerButton(EditingTypeDisplay));
