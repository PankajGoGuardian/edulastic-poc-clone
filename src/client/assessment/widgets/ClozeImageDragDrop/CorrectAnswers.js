/* eslint-disable react/no-find-dom-node */
import React, { Component } from "react";
import PropTypes from "prop-types";
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

  handleTabChange = value => {
    this.setState({ value });
  };

  handleClose = index => () => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);
    newData.validation.altResponses.splice(index, 1);
    setQuestionData(newData);
    setTimeout(() => {
      this.handleTabChange(index);
    }, 0);
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
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
          this.handleTabChange(validation.altResponses.length + 1);
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
      imageOptions,
      item,
      children
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab
              style={{ borderRadius: validation.altResponses <= 1 ? "4px" : "4px 0 0 4px" }}
              label={t("component.correctanswers.correct")}
              type="primary"
              IconPosition="right"
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
                item={item}
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
                      item={item}
                    />
                  </TabContainer>
                );
              }
              return null;
            })}
        </div>
        {children}
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
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  imageOptions: PropTypes.object,
  item: PropTypes.object
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
  imageHeight: 490,
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
  imageOptions: {},
  item: {}
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
