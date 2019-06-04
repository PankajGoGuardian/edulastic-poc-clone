import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { Button, Tab, Tabs, TabContainer } from "@edulastic/common";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";

import CorrectAnswer from "./CorrectAnswer";
import { IconPlus } from "./styled/IconPlus";
import ReactDOM from "react-dom";

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

  renderAltResponses = () => {
    const { validation, t, onRemoveAltResponses } = this.props;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab
          close
          key={i}
          onClose={() => onRemoveAltResponses(i)}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
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

  updateResponseBoxWidth = newData => {
    let maxLength = 0;
    newData.validation.valid_response.value.forEach(resp => {
      maxLength = Math.max(maxLength, resp ? resp.length : 0);
    });

    newData.validation.alt_responses.forEach(arr => {
      arr.value.forEach(resp => {
        maxLength = Math.max(maxLength, resp ? resp.length : 0);
      });
    });
    const finalWidth = 40 + maxLength * 7;
    newData.ui_style.width = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
    return newData;
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
    const updatedData = this.updateResponseBoxWidth(newData);
    setQuestionData(updatedData);
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
    const updatedData = this.updateResponseBoxWidth(newData);
    setQuestionData(updatedData);
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
      imagePosition
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab label={t("component.correctanswers.correct")} type="primary" IconPosition="right" />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
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
                maxRespCount={maxRespCount}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                backgroundColor={backgroundColor}
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                imagePosition={imagePosition}
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
                      maxHeight={maxHeight}
                      maxWidth={maxWidth}
                      imagePosition={imagePosition}
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
  onRemoveAltResponses: PropTypes.func.isRequired,
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
  imagePosition: PropTypes.object
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
    width: 0,
    height: 0,
    wordwrap: false
  },
  fillSections: () => {},
  cleanSections: () => {},
  imagePosition: {}
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
