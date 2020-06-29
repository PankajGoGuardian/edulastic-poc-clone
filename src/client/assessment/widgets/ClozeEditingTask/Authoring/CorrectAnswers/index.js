import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";
import { Tab, Tabs, TabContainer } from "@edulastic/common";
import { Subtitle } from "../../../../styled/Subtitle";

import CorrectAnswer from "./CorrectAnswer";
import AnswerOptions from "./AnswerOptions";
import Question from "../../../../components/Question";
import AddAlternateAnswerButton from "../../../../components/AddAlternateAnswerButton";
import { AddAlternative } from "../../../../styled/ButtonStyles";

class CorrectAnswers extends Component {
  state = {
    value: 0
  };

  handleTabChange = value => {
    this.setState({ value });
  };

  addAltResponses = () => {
    const { item, setQuestionData, validation } = this.props;
    this.handleTabChange(validation.altResponses.length + 1);

    const validAnswers = get(item, "validation.validResponse.value", {});

    // storing alternate anwer based on valid answer
    const alternateAnswers = {};
    Object.keys(validAnswers).forEach(key => {
      alternateAnswers[key] = "";
    });

    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.push({
          score: 1,
          value: alternateAnswers
        });
      })
    );
  };

  handleRemoveAltResponses = (event, deletedTabIndex) => {
    event?.stopPropagation();
    const { setQuestionData, item } = this.props;
    this.handleTabChange(0);
    setQuestionData(
      produce(item, draft => {
        if (get(draft, "validation.altResponses", null)) {
          draft.validation.altResponses.splice(deletedTabIndex, 1);
        }
      })
    );
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;
    return get(validation, "altResponses", []).map((res, i) => (
      <Tab
        close
        key={i}
        onClose={event => this.handleRemoveAltResponses(event, i)}
        label={`${t("component.correctanswers.alternate")} ${i + 1}`}
        IconPosition="right"
        type="primary"
      />
    ));
  };

  renderPlusButton = () => {
    const { t } = this.props;
    return (
      <AddAlternateAnswerButton
        onClickHandler={this.addAltResponses}
        text={`+${t("component.correctanswers.alternativeAnswer")}`}
      />
    );
  };

  updateCorrectValidationAnswers = answers => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse = {
          score: item.validation.validResponse.score,
          value: answers
        };
      })
    );
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses[tabIndex] = {
          ...draft.validation.altResponses[tabIndex],
          value: answers
        };
      })
    );
  };

  handleUpdateCorrectScore = points => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.score = points;
      })
    );
  };

  handleUpdateAltValidationScore = i => points => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses[i].score = points;
      })
    );
  };

  render() {
    const {
      t,
      item,
      uiStyle,
      options,
      stimulus,
      validation,
      hasGroupResponses,
      fillSections,
      cleanSections,
      setQuestionData
    } = this.props;
    const { value } = this.state;
    return (
      <Question
        position="unset"
        section="main"
        label={t("component.correctanswers.setcorrectanswers")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}>
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <AddAlternative>
          {this.renderPlusButton()}
          <Tabs value={value} onChange={this.handleTabChange} style={{ marginBottom: 10, marginTop: 20 }}>
            <Tab
              style={{ borderRadius: validation.altResponses <= 1 ? "4px" : "4px 0 0 4px" }}
              label={t("component.correctanswers.correct")}
              type="primary"
            />
            {this.renderAltResponses()}
          </Tabs>
        </AddAlternative>
        {value === 0 && (
          <TabContainer>
            <CorrectAnswer
              key={options}
              response={validation.validResponse}
              stimulus={stimulus}
              options={options}
              uiStyle={uiStyle}
              item={item}
              hasGroupResponses={hasGroupResponses}
              onUpdateValidationValue={this.updateCorrectValidationAnswers}
              onUpdatePoints={this.handleUpdateCorrectScore}
            />
          </TabContainer>
        )}
        {get(validation, "altResponses", []).map((alter, i) => {
          if (i + 1 === value) {
            return (
              <TabContainer key={i}>
                <CorrectAnswer
                  key={options}
                  response={alter}
                  stimulus={stimulus}
                  options={options}
                  item={item}
                  hasGroupResponses={hasGroupResponses}
                  uiStyle={uiStyle}
                  onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                  onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                />
              </TabContainer>
            );
          }
          return null;
        })}

        <AnswerOptions t={t} setQuestionData={setQuestionData} item={item} />
      </Question>
    );
  }
}

CorrectAnswers.propTypes = {
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  hasGroupResponses: PropTypes.bool,
  item: PropTypes.object.isRequired,
  uiStyle: PropTypes.object
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  validation: {},
  hasGroupResponses: false,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: ""
  }
};

export default withNamespaces("assessment")(CorrectAnswers);
