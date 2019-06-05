import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { Button, Tab, Tabs, TabContainer } from "@edulastic/common";

import { Subtitle } from "../../styled/Subtitle";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import CorrectAnswer from "./CorrectAnswer";
import { IconPlus } from "./styled/IconPlus";

class CorrectAnswers extends Component {
  state = {
    value: 0
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.correctanswers.setcorrectanswers"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  handleTabChange = value => {
    this.setState({ value });
  };

  handleClose = index => () => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);
    newData.validation.alt_responses.splice(index, 1);
    setQuestionData(newData);
    setTimeout(() => {
      this.handleTabChange(index);
    }, 0);
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab
          key={i}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
          close
          onClose={this.handleClose(i)}
          type="primary"
          IconPosition="right"
        />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation } = this.props;

    return (
      <Button
        style={{
          minWidth: 20,
          minHeight: 20,
          width: 20,
          padding: 0,
          marginLeft: 20
        }}
        icon={<IconPlus data-cy="alternate" />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          onAddAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  updateCorrectValidationAnswers = answers => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);
    const updatedValidation = {
      ...question.data,
      valid_response: {
        score: question.validation.valid_response.score,
        value: answers
      }
    };
    newData.validation.valid_response = updatedValidation.valid_response;
    setQuestionData(newData);
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    const updatedAltResponses = newData.validation.alt_responses;
    updatedAltResponses[tabIndex] = {
      score: newData.validation.alt_responses[tabIndex].score,
      value: answers
    };

    newData.validation.alt_responses = updatedAltResponses;
    setQuestionData(newData);
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.valid_response.score = points;

    setQuestionData(newData);
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.alt_responses[i].score = points;

    setQuestionData(newData);
  };

  render() {
    const {
      validation,
      stimulus,
      imageAlterText,
      imageWidth,
      imageHeight,
      options,
      t,
      imageUrl,
      templateMarkUp,
      backgroundColor,
      responses,
      configureOptions,
      uiStyle,
      maxRespCount,
      showDashedBorder,
      maxHeight,
      maxWidth,
      imageOptions
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab
              style={{ borderRadius: validation.alt_responses <= 1 ? "4px" : "4px 0 0 4px" }}
              label={t("component.correctanswers.correct")}
              type="primary"
              IconPosition="right"
            />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                key={options}
                response={validation.valid_response}
                stimulus={stimulus}
                options={options}
                uiStyle={uiStyle}
                responses={responses}
                imageUrl={imageUrl}
                showDashedBorder={showDashedBorder}
                configureOptions={configureOptions}
                imageAlterText={imageAlterText}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                maxRespCount={maxRespCount}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                backgroundColor={backgroundColor}
                imageOptions={imageOptions}
              />
            </TabContainer>
          )}
          {validation.alt_responses &&
            !!validation.alt_responses.length &&
            validation.alt_responses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    <CorrectAnswer
                      maxHeight={maxHeight}
                      maxWidth={maxWidth}
                      key={options}
                      response={alter}
                      stimulus={stimulus}
                      options={options}
                      configureOptions={configureOptions}
                      responses={responses}
                      imageUrl={imageUrl}
                      imageAlterText={imageAlterText}
                      imageWidth={imageWidth}
                      maxRespCount={maxRespCount}
                      templateMarkUp={templateMarkUp}
                      showDashedBorder={showDashedBorder}
                      uiStyle={uiStyle}
                      backgroundColor={backgroundColor}
                      onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                      onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                      imageOptions={imageOptions}
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
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  responses: PropTypes.array,
  templateMarkUp: PropTypes.string,
  question: PropTypes.object.isRequired,
  showDashedBorder: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  imageOptions: PropTypes.object
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responses: [],
  validation: {},
  showDashedBorder: false,
  templateMarkUp: "",
  backgroundColor: "#fff",
  imageUrl: "",
  imageAlterText: "",
  imageWidth: 600,
  maxRespCount: 1,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false
  },
  fillSections: () => {},
  cleanSections: () => {},
  imageOptions: {}
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
