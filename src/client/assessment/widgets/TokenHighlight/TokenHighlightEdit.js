import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { Paper, Tabs, Tab, CustomQuillComponent } from "@edulastic/common";

import { WORD_MODE, PARAGRAPH_MODE, SENTENCE_MODE, EDIT } from "../../constants/constantsForQuestions";

import withPoints from "../../components/HOC/withPoints";
import QuestionTextArea from "../../components/QuestionTextArea";
import CorrectAnswers from "../../components/CorrectAnswers";
import { Subtitle } from "../../styled/Subtitle";

import TokenHighlightPreview from "./TokenHighlightPreview";
import { Container } from "./styled/Container";
import { ModeButton } from "./styled/ModeButton";
import AdvancedOptions from "../SortList/components/AdvancedOptions";

const OptionsList = withPoints(TokenHighlightPreview);

const TokenHighlightEdit = ({ item, setQuestionData, t }) => {
  const [correctTab, setCorrectTab] = useState(0);

  const [templateTab, setTemplateTab] = useState(0);

  const mode = item.tokenization;

  const initialArray = item.template.replace(/(<p>|<\/p>)*/g, "").split('<p class="newline_section"><br>');

  const paragraphsArray = initialArray.map(el => ({
    value: `${el}<br/>`,
    active: true
  }));

  const sentencesArray = initialArray
    .join("<br/>")
    .split(".")
    .map(el => ({ value: `${el}.`, active: true }))
    .filter(el => el.value !== "." && el.value.trim() && el.value !== "<br/>.");

  const wordsArray = initialArray
    .join("<br/> ")
    .split(" ")
    .map(el => ({ value: `${el}`, active: true }));

  const [template, setTemplate] = useState();

  useEffect(() => {
    const newItem = cloneDeep(item);
    if (template || newItem.templeWithTokens.length === 0) {
      let resultArray = "";
      if (mode === WORD_MODE) {
        resultArray = wordsArray;
      } else if (mode === PARAGRAPH_MODE) {
        resultArray = paragraphsArray;
      } else {
        resultArray = sentencesArray;
      }

      newItem.templeWithTokens = resultArray;

      setTemplate(resultArray);
    } else {
      newItem.templeWithTokens = item.templeWithTokens;
      setTemplate(cloneDeep(item.templeWithTokens));
    }
    setQuestionData(newItem);
  }, [mode]);

  const handleItemChangeChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    if (prop === "template") {
      let resultArray = "";
      if (mode === WORD_MODE) {
        resultArray = cloneDeep(wordsArray);
      } else if (mode === PARAGRAPH_MODE) {
        resultArray = cloneDeep(paragraphsArray);
      } else {
        resultArray = cloneDeep(sentencesArray);
      }
      setTemplate(resultArray);
    }

    newItem[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleTemplateClick = i => () => {
    const newTemplate = cloneDeep(template);
    const newItem = cloneDeep(item);

    newTemplate[i].active = !newTemplate[i].active;

    newItem.templeWithTokens = newTemplate;

    setTemplate(newTemplate);
    setQuestionData(newItem);
  };

  const handleUiStyleChange = (prop, uiStyle) => {
    const newItem = cloneDeep(item);

    newItem.ui_style[prop] = uiStyle;
    setQuestionData(newItem);
  };

  const handleAddAnswer = () => {
    const newItem = cloneDeep(item);

    if (!newItem.validation.alt_responses) {
      newItem.validation.alt_responses = [];
    }
    newItem.validation.alt_responses.push({
      score: 1,
      value: newItem.validation.valid_response.value
    });

    setQuestionData(newItem);
    setCorrectTab(correctTab + 1);
  };

  const handlePointsChange = val => {
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.score = val;
    } else {
      newItem.validation.alt_responses[correctTab - 1].score = val;
    }

    setQuestionData(newItem);
  };

  const handleAnswerChange = ans => {
    const newItem = cloneDeep(item);

    if (correctTab === 0) {
      newItem.validation.valid_response.value = ans;
    } else {
      newItem.validation.alt_responses[correctTab - 1].value = ans;
    }

    setQuestionData(newItem);
  };

  const handleCloseTab = tabIndex => {
    const newItem = cloneDeep(item);
    newItem.validation.alt_responses.splice(tabIndex, 1);

    setCorrectTab(0);
    setQuestionData(newItem);
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={
        correctTab === 0 ? item.validation.valid_response.value : item.validation.alt_responses[correctTab - 1].value
      }
      view={EDIT}
    />
  );

  return (
    <Fragment>
      <Paper style={{ marginBottom: 30 }}>
        <Subtitle>{t("component.tokenHighlight.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.tokenHighlight.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
        />

        <Subtitle>{t("component.tokenHighlight.templateTitle")}</Subtitle>
        <Tabs style={{ marginBottom: 15 }} value={templateTab} onChange={setTemplateTab}>
          <Tab label={t("component.tokenHighlight.editTemplateTab")} />
          <Tab label={t("component.tokenHighlight.editTokenTab")} />
        </Tabs>

        {templateTab === 0 && (
          <CustomQuillComponent
            firstFocus={item.firstMount === undefined}
            toolbarId="template"
            onChange={val => handleItemChangeChange("template", val)}
            showResponseBtn={false}
            value={item.template}
          />
        )}

        {templateTab === 1 && (
          <Fragment>
            <Container>
              <ModeButton
                active={mode === PARAGRAPH_MODE}
                onClick={() => handleItemChangeChange("tokenization", PARAGRAPH_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.paragraph")}
              </ModeButton>
              <ModeButton
                active={mode === SENTENCE_MODE}
                onClick={() => handleItemChangeChange("tokenization", SENTENCE_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.sentence")}
              </ModeButton>
              <ModeButton
                active={mode === WORD_MODE}
                onClick={() => handleItemChangeChange("tokenization", WORD_MODE)}
                type="button"
              >
                {t("component.tokenHighlight.word")}
              </ModeButton>
            </Container>
            {template.map((el, i) => (
              <span
                onClick={handleTemplateClick(i)}
                dangerouslySetInnerHTML={{ __html: el.value }}
                key={i}
                className={el.active ? "active-word token" : "token"}
              />
            ))}
          </Fragment>
        )}

        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
        />
      </Paper>

      <AdvancedOptions onUiChange={handleUiStyleChange} />
    </Fragment>
  );
};

TokenHighlightEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(TokenHighlightEdit);
