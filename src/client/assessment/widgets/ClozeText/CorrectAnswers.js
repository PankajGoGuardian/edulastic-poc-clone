import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, findIndex } from "lodash";

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
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.correctanswers.setcorrectanswers"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount = () => {
    const { cleanSections } = this.props;

    cleanSections();
  };

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
          onClose={() => {
            onRemoveAltResponses(i);
            this.setState({ value: 0 });
          }}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
          IconPosition="right"
          type="primary"
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
        icon={<IconPlus fill="#fff" />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          onAddAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  updateCorrectValidationAnswers = (answers, id, widthpx) => {
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
    newData.ui_style.responsecontainerindividuals = newData.ui_style.responsecontainerindividuals || [];
    const index = findIndex(newData.ui_style.responsecontainerindividuals, container => container.id === id);
    if (index === -1) {
      const newIndex = findIndex(newData.response_ids, resp => resp.id === id);
      newData.ui_style.responsecontainerindividuals.push({ id, widthpx, index: newIndex });
    } else {
      newData.ui_style.responsecontainerindividuals[index] = {
        ...newData.ui_style.responsecontainerindividuals[index],
        widthpx
      };
    }
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
      options,
      t,
      template,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIds,
      view,
      previewTab
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab
              label={t("component.correctanswers.correct")}
              style={{ borderRadius: validation.alt_responses <= 1 ? "4px" : "4px 0 0 4px" }}
              type="primary"
            />
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
                template={template}
                configureOptions={configureOptions}
                hasGroupResponses={hasGroupResponses}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                responseIds={responseIds}
                view={view}
                previewTab={previewTab}
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
                      responseIds={responseIds}
                      hasGroupResponses={hasGroupResponses}
                      template={template}
                      uiStyle={uiStyle}
                      onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                      onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                      view={view}
                      previewTab={previewTab}
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
  template: PropTypes.string,
  question: PropTypes.object.isRequired,
  hasGroupResponses: PropTypes.bool,
  onRemoveAltResponses: PropTypes.func,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  responseIds: PropTypes.object
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responseIds: {},
  validation: {},
  onRemoveAltResponses: () => {},
  hasGroupResponses: false,
  template: "",
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: ""
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
