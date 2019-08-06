import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";
import { Button, Tab, Tabs, TabContainer } from "@edulastic/common";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";

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

  renderAltResponses = () => {
    const { validation, t, onRemoveAltResponses } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
        <Tab
          style={{ marginRight: 5, marginBottom: 5 }}
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
      options,
      t,
      imageUrl,
      templateMarkUp,
      backgroundColor,
      responses,
      imagescale,
      configureOptions,
      uiStyle,
      maxRespCount,
      showDashedBorder,
      imageHeight,
      imageOptions,
      item
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
                response={validation.validResponse}
                stimulus={stimulus}
                imagescale={imagescale}
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
                imageHeight={imageHeight}
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
                      imagescale={imagescale}
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
  imagescale: PropTypes.bool,
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
  onRemoveAltResponses: PropTypes.func,
  imageOptions: PropTypes.object
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responses: [],
  imagescale: false,
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
  onRemoveAltResponses: () => {},
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
