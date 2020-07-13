import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { Tab, TabContainer, Tabs, FlexContainer, ItemLevelContext, getFormattedAttrId } from "@edulastic/common";
import _, { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";
import { PointsInput } from "../../styled/CorrectAnswerHeader";
import CorrectAnswer from "./CorrectAnswer";
import { AlternateAnswerLink } from "../../styled/ButtonStyles";

class CorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  static contextType = ItemLevelContext;

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

  updateCorrectValidationAnswers = answers => {
    const { item, setQuestionData } = this.props;
    const newData = cloneDeep(item);
    const updatedValidation = {
      ...item.data,
      validResponse: {
        score: item.validation.validResponse.score,
        value: answers
      }
    };
    newData.validation.validResponse = updatedValidation.validResponse;
    setQuestionData(newData);
  };

  addAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        const response = {
          score: 1,
          value: new Array(draft.responseIds.length).fill(null)
        };

        draft.validation.altResponses = draft.validation.altResponses || [];
        draft.validation.altResponses.push(response);
      })
    );
    this.setState({
      currentTab: currentTab + 1
    });
  };

  removeAltResponses = index => e => {
    e?.stopPropagation();
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.validation && draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.splice(index, 1);
        }
      })
    );
    this.setState({
      currentTab: 0
    });
  };

  tabChange = value => {
    this.setState({ currentTab: value });
  };

  renderAltResponsesTabs = () => {
    const { validation, t } = this.props;
    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
        <Tab
          IconPosition="right"
          key={i}
          close
          type="primary"
          onClose={this.removeAltResponses(i)}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
        />
      ));
    }
    return null;
  };

  updateScore = e => {
    if (!(e.target.value > 0)) {
      return;
    }
    const points = parseFloat(e.target.value, 10);
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points;
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].score = points;
        }
      })
    );
  };

  updateAnswers = answers => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(item, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.value = answers;
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].value = answers;
        }
      })
    );
  };

  get response() {
    const { validation } = this.props;
    const { currentTab } = this.state;
    if (currentTab === 0) {
      return validation.validResponse;
    }
    return validation.altResponses[currentTab - 1];
  }

  get tabs() {
    const { validation } = this.props;
    return validation?.altResponses?.length || 0;
  }

  render() {
    const { stimulus, options, t, hasGroupResponses, configureOptions, uiStyle, responseIDs, item } = this.props;
    const { currentTab } = this.state;
    const itemLevelScoring = this.context;
    const title = currentTab === 0 ? "correct" : "alternative";
    const { response } = this;

    return (
      <Fragment>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}>
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <FlexContainer alignItems="flex-end" marginBottom="16px">
          {itemLevelScoring || (
            <FlexContainer flex={1} flexDirection="column" alignItems="flex-start">
              <Label>{t("component.correctanswers.points")}</Label>
              <PointsInput
                id={getFormattedAttrId(`${title}-${t("component.correctanswers.points")}`)}
                type="number"
                data-cy="points"
                value={response.score}
                onChange={this.updateScore}
                onBlur={this.updateScore}
                disabled={false}
                min={0}
                step={0.5}
              />
            </FlexContainer>
          )}
          <FlexContainer flex={1}>
            <AlternateAnswerLink onClick={this.addAltResponses} variant="extendedFab" data-cy="alternate">
              {`+ ${t("component.correctanswers.alternativeAnswer")}`}
            </AlternateAnswerLink>
          </FlexContainer>
        </FlexContainer>

        {this.tabs >= 1 && (
          <Tabs value={currentTab} onChange={this.tabChange} mb="16px">
            <Tab type="primary" data_cy="correct" label={t("component.correctanswers.correct")} />
            {this.renderAltResponsesTabs()}
          </Tabs>
        )}
        <TabContainer padding="0px">
          <CorrectAnswer
            response={response}
            stimulus={stimulus}
            options={options}
            uiStyle={uiStyle}
            configureOptions={configureOptions}
            hasGroupResponses={hasGroupResponses}
            onUpdateValidationValue={this.updateAnswers}
            responseIDs={responseIDs}
            item={item}
          />
        </TabContainer>
      </Fragment>
    );
  }
}

CorrectAnswers.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  hasGroupResponses: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  responseIDs: PropTypes.array,
  item: PropTypes.object.isRequired
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
  }
};

export default withNamespaces("assessment")(CorrectAnswers);
