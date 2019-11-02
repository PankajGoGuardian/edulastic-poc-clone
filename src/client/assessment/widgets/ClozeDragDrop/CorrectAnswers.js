import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import _, { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { Tab, Tabs, TabContainer } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import CorrectAnswer from "./CorrectAnswer";
import AddAlternateAnswerButton from "../../components/AddAlternateAnswerButton";

class CorrectAnswers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
    this.wrapperRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;

    if (!_.isEqual(options, prevProps.options)) {
      const { validation } = this.props;
      const oldValue = validation.validResponse.value;
      const diff = _.difference(prevProps.options, options);
      if (oldValue.some(el => diff.includes(el))) {
        const index = prevProps.options.indexOf(diff[0]);
        const valueIndex = oldValue.indexOf(diff[0]);
        const newAnswers = _.cloneDeep(oldValue);
        newAnswers[valueIndex] = options[index];
        this.updateCorrectValidationAnswers(newAnswers);
      }
    }
  }

  handleTabChange = value => {
    this.setState({ value });
  };

  removeAltResponse = (evt, index) => {
    evt.stopPropagation();
    const { onRemoveAltResponses } = this.props;
    const { value } = this.state;
    if (value === index + 1) {
      this.setState({
        value: index
      });
    }
    onRemoveAltResponses(index);
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
        <Tab
          key={i}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
          close
          onClose={evt => {
            this.removeAltResponse(evt, i);
          }}
          type="primary"
          IconPosition="right"
        />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation, t } = this.props;
    return (
      <AddAlternateAnswerButton
        onClickHandler={() => {
          this.handleTabChange(validation.altResponses.length + 1);
          onAddAltResponses();
        }}
        text={`+${t("component.correctanswers.alternativeAnswer")}`}
      />
    );
  };

  updateCorrectValidationAnswers = answers => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);
    const updatedValidation = {
      ...question.data,
      validResponse: {
        score: question.validation.validResponse.score,
        value: answers
      }
    };
    newData.validation.validResponse = updatedValidation.validResponse;
    setQuestionData(newData);
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    const updatedAltResponses = newData.validation.altResponses;
    updatedAltResponses[tabIndex] = {
      score: newData.validation.altResponses[tabIndex].score,
      value: answers
    };

    newData.validation.altResponses = updatedAltResponses;
    setQuestionData(newData);
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.validResponse.score = points;

    setQuestionData(newData);
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.altResponses[i].score = points;

    setQuestionData(newData);
  };

  render() {
    const {
      validation,
      stimulus,
      options,
      t,
      template,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIDs
    } = this.props;
    const { value } = this.state;
    return (
      <div ref={this.wrapperRef}>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab
              style={{ borderRadius: validation.altResponses <= 1 ? "4px" : "4px 0 0 4px" }}
              label={t("component.correctanswers.correct")}
              type="primary"
            />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                key={options}
                response={validation.validResponse}
                stimulus={stimulus}
                options={options}
                uiStyle={uiStyle}
                configureOptions={configureOptions}
                hasGroupResponses={hasGroupResponses}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                responseIDs={responseIDs}
              />
            </TabContainer>
          )}
          {validation.altResponses &&
            !!validation.altResponses.length &&
            validation.altResponses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    <CorrectAnswer
                      key={options}
                      response={alter}
                      stimulus={stimulus}
                      options={options}
                      configureOptions={configureOptions}
                      hasGroupResponses={hasGroupResponses}
                      uiStyle={uiStyle}
                      onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                      onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                      responseIDs={responseIDs}
                    />
                  </TabContainer>
                );
              }
              return null;
            })}
        </div>
      </div>
    );
  }
}

CorrectAnswers.propTypes = {
  onAddAltResponses: PropTypes.func.isRequired,
  onRemoveAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.object.isRequired,
  hasGroupResponses: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  responseIDs: PropTypes.array
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responseIDs: [],
  validation: {},
  hasGroupResponses: false,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false
  },
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      question: getQuestionDataSelector(state)
    }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(CorrectAnswers);
