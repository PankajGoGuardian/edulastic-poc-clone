import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { cloneDeep } from "lodash";
import { withNamespaces } from "@edulastic/localization";

import { WORD_MODE, PARAGRAPH_MODE } from "../../constants/constantsForQuestions";
import { updateVariables } from "../../utils/variables";

import QuestionTextArea from "../../components/QuestionTextArea";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

class ComposeQuestion extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.tokenHighlight.composeQuestion"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, setTemplate, t } = this.props;

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

    const handleItemChangeChange = (prop, uiStyle) => {
      setQuestionData(
        produce(item, draft => {
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

          draft[prop] = uiStyle;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.tokenHighlight.composeQuestion")}</Subtitle>
        <QuestionTextArea
          placeholder={t("component.tokenHighlight.enterQuestion")}
          onChange={stimulus => handleItemChangeChange("stimulus", stimulus)}
          value={item.stimulus}
        />
      </Widget>
    );
  }
}

ComposeQuestion.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setTemplate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ComposeQuestion.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(ComposeQuestion);
