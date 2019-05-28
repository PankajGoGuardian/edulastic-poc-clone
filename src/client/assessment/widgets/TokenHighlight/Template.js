import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { cloneDeep } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { Tabs, Tab } from "@edulastic/common";

import { WORD_MODE, PARAGRAPH_MODE, SENTENCE_MODE } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";
import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { Container } from "./styled/Container";
import { ModeButton } from "./styled/ModeButton";

class Template extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.tokenHighlight.templateTitle"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, template, setTemplate, templateTab, setTemplateTab, t } = this.props;

    const mode = item.tokenization;

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
          if (prop === "template") {
            let resultArray = "";
            const initialArray = uiStyle.replace(/(<p>|<\/p>)*/g, "").split('<p class="newline_section"><br>');

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
            if (mode === WORD_MODE) {
              resultArray = cloneDeep(wordsArray);
            } else if (mode === PARAGRAPH_MODE) {
              resultArray = cloneDeep(paragraphsArray);
            } else {
              resultArray = cloneDeep(sentencesArray);
            }
            setTemplate(resultArray);
          }

          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    const handleTemplateClick = i => () => {
      const newTemplate = cloneDeep(template);
      setQuestionData(
        produce(item, draft => {
          newTemplate[i].active = !newTemplate[i].active;

          draft.templeWithTokens = newTemplate;

          setTemplate(newTemplate);
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.tokenHighlight.templateTitle")}</Subtitle>
        <Tabs style={{ marginBottom: 15 }} value={templateTab} onChange={setTemplateTab}>
          <Tab label={t("component.tokenHighlight.editTemplateTab")} />
          <Tab label={t("component.tokenHighlight.editTokenTab")} />
        </Tabs>

        {templateTab === 0 && (
          <QuestionTextArea onChange={val => handleItemChangeChange("template", val)} value={item.template} />
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
      </Widget>
    );
  }
}

Template.propTypes = {
  item: PropTypes.object.isRequired,
  template: PropTypes.object.isRequired,
  templateTab: PropTypes.number.isRequired,
  setTemplateTab: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setTemplate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Template.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Template);
